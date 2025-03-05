import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';

import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import https from "https";
import http from "http";

import { corsOptions, cookieOptions, rpID, port, enable_https, certificate } from './configs';
import { handleError } from './errors';
import routes from './routes';

const app = express();

// Session
const filestore = FileStore(session);

declare module 'express-session' {
  interface SessionData {
    currentChallengeOptions?: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
    loggedInUser: {id: string, name: string} | null;
  }
}

app.use(
  session({
    store: new filestore({
      path: './data/sessions',
      ttl: 60,
      retries: 0,
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: true,
    resave: false,
    cookie: cookieOptions,
  }),
);

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(handleError);

// Debug: Session Logging
app.use(function (req, res, next) {
  // console.log("Route:", req.originalUrl);
  // console.log("SessionId:", req.sessionID);
  // console.log("Session Data:", req.session);
  next()
});

// Routes
app.use('/api', routes);

// Serve static client
const clientBuildPath = path.join(__dirname, '../../client/dist');
console.log("Client folder:", clientBuildPath);
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
} else {
  app.get('/', (req, res) => {
    res.send(`Client build folder does not exist. Not serving client`);
  });
}

if (enable_https) {
  const server = https.createServer(certificate, app);
  server.listen(port, rpID, () => {
    console.log(`🚀 HTTPS Server ready at https://${rpID}:${port}`);
  });
} else {
  http.createServer(app).listen(port, rpID, () => {
    console.log(`🚀 HTTP Server ready at http://${rpID}:${port}`);
  });
}