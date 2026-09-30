import express, { type RequestHandler, type ErrorRequestHandler } from 'express';
import session from 'express-session';
import { SqliteSessionStore } from './session-store.js';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { resolve } from 'node:path';
import type Database from 'better-sqlite3';
import { getProfile, saveProfile, createProject, getProject, listProjects } from './database.js';
import { validateProfile, limits } from './shared/profile.js';
import { normalizeProject, projectLimits } from './shared/project.js';
import { hashPassword, verifyPassword } from './password.js';

declare module 'express-session' { interface SessionData { authenticated?: boolean; csrf?: string } }
export async function createApp(options: { db: Database.Database; secret: string; production?: boolean; proxyHops?: number }) {
  const { db, secret, production = false, proxyHops = 0 } = options;
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', proxyHops);
  app.set('view engine', 'ejs');
  app.set('views', resolve('views'));
  app.use(helmet({ strictTransportSecurity: production ? undefined : false, contentSecurityPolicy: { directives: { 'upgrade-insecure-requests': production ? [] : null } } }));
  app.use('/assets', express.static(resolve('public'), { maxAge: production ? '1h' : 0 }));
  app.use(express.urlencoded({ extended: false, limit: '32kb' }));
  const store = new SqliteSessionStore(db);
  const cookieName = production ? '__Host-portfolio.sid' : 'portfolio.sid';
  app.use(session({ name: cookieName, secret, store, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'strict', secure: production, maxAge: 8 * 60 * 60 * 1000 } }));
  // SQLite cleanup without a background timer that could keep tests or shutdown alive.
  db.prepare('DELETE FROM sessions WHERE expires <= ?').run(Date.now());
  app.use('/admin', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  const csrfToken: RequestHandler = (req, res, next) => {
    req.session.csrf ??= randomBytes(32).toString('hex');
    res.locals.csrf = req.session.csrf;
    next();
  };
  const checkCsrf: RequestHandler = (req, res, next) => {
    const candidate = req.body?._csrf;
    const expected = req.session.csrf;
    if (typeof candidate !== 'string' || !expected || Buffer.byteLength(candidate) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(candidate), Buffer.from(expected))) {
      res.status(403).render('error', { title: 'Request expired', message: 'Please reload the form and try again.' }); return;
    }
    next();
  };
  const requireAdmin: RequestHandler = (req, res, next) => {
    if (!req.session.authenticated) { res.redirect(303, '/admin/login'); return; }
    next();
  };
  const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, skipSuccessfulRequests: true, handler: (_req, res) => res.status(429).render('error', { title: 'Please try again later', message: 'Too many sign-in attempts. Please wait 15 minutes.' }) });
  const dummyHash = await hashPassword(randomBytes(32).toString('hex'));
  app.get('/', (_req, res) => res.render('home', { profile: getProfile(db) }));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/admin/login', csrfToken, (req, res) => {
    if (req.session.authenticated) { res.redirect('/admin'); return; }
    res.render('login', { error: '', username: '' });
  });
  app.post('/admin/login', loginLimiter, checkCsrf, csrfToken, async (req, res, next) => {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const admin = db.prepare('SELECT username, password_hash FROM administrator WHERE id = 1').get() as { username: string; password_hash: string } | undefined;
    const validPassword = await verifyPassword(password, admin?.password_hash ?? dummyHash);
    if (!admin || username !== admin.username || !validPassword) { res.status(401).render('login', { error: 'Username or password is incorrect.', username }); return; }
    req.session.regenerate(error => {
      if (error) { next(error); return; }
      req.session.authenticated = true;
      req.session.csrf = randomBytes(32).toString('hex');
      req.session.save(error => error ? next(error) : res.redirect(303, '/admin'));
    });
  });
  app.get('/admin', requireAdmin, csrfToken, (req, res) => res.render('admin', { profile: getProfile(db), limits, errors: {}, saved: req.query.saved === '1' }));
  app.get('/admin/projects', requireAdmin, csrfToken, (_req, res) => res.render('projects/index', { projects: listProjects(db) }));
  app.get('/admin/projects/new', requireAdmin, csrfToken, (_req, res) => res.render('projects/form', {
    values: { title: '', description: '', technologies: '', codeUrl: '', demoUrl: '' }, errors: {}, limits: projectLimits,
  }));
  app.post('/admin/projects', requireAdmin, checkCsrf, csrfToken, (req, res) => {
    const result = normalizeProject(req.body);
    if (!result.valid) {
      const values = {
        title: typeof req.body.title === 'string' ? req.body.title : '',
        description: typeof req.body.description === 'string' ? req.body.description : '',
        technologies: typeof req.body.technologies === 'string' ? req.body.technologies : '',
        codeUrl: typeof req.body.codeUrl === 'string' ? req.body.codeUrl : '',
        demoUrl: typeof req.body.demoUrl === 'string' ? req.body.demoUrl : '',
      };
      res.status(422).render('projects/form', { values, errors: result.errors, limits: projectLimits }); return;
    }
    const id = createProject(db, result.value);
    res.redirect(303, `/admin/projects/${id}`);
  });
  app.get('/admin/projects/:id', requireAdmin, csrfToken, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) { res.status(404).render('error', { title: 'Project not found', message: 'This project could not be found.' }); return; }
    const project = getProject(db, id);
    if (!project) { res.status(404).render('error', { title: 'Project not found', message: 'This project could not be found.' }); return; }
    res.render('projects/detail', { project });
  });
  app.post('/admin/presentation', requireAdmin, checkCsrf, csrfToken, (req, res) => {
    const result = validateProfile(req.body);
    if (!result.valid) { res.status(422).render('admin', { profile: result.value, limits, errors: result.errors, saved: false }); return; }
    saveProfile(db, result.value);
    res.redirect(303, '/admin?saved=1');
  });
  app.post('/admin/logout', requireAdmin, checkCsrf, (req, res, next) => req.session.destroy(error => {
    if (error) { next(error); return; }
    res.clearCookie(cookieName, { path: '/', httpOnly: true, sameSite: 'strict', secure: production });
    res.redirect(303, '/admin/login');
  }));
  app.use((_req, res) => res.status(404).render('error', { title: 'Page not found', message: 'The page you are looking for is not here.' }));
  const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
    if (res.headersSent) { _next(error); return; }
    const status = error?.type === 'entity.too.large' ? 413 : 500;
    if (status === 500) console.error('Request failed:', error instanceof Error ? error.message : 'Unknown error');
    res.status(status).render('error', { title: status === 413 ? 'Request too large' : 'Something went wrong', message: 'Your changes could not be saved. Please try again.' });
  };
  app.use(handleError);
  return app;
}
