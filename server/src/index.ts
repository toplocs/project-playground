import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import https from "https";
import http from "http";

import { corsOptions, port, origin, rpID, enable_https } from './configs';
import { handleError } from './errors';

// Routes
import userRoutes from './routes/userRoutes';
import passkeyRoutes from './routes/passkeyRoutes';
import exampleRoutes from './routes/exampleRoutes';
import profileRoutes from './routes/profileRoutes';
// Models
import UserModel from './models/User';
import ProfileModel from './models/Profile';
import ExampleModel from './models/Example';
import ProfileExampleModel from './models/ProfileExample';

// Trying to fix Error MissingWebCrypto
// https://github.com/MasterKale/SimpleWebAuthn/issues/517
// import { webcrypto } from "node:crypto";
// export const crypto: Crypto = webcrypto as any;
// globalThis.crypto ??= await import("node:crypto").webcrypto

const app = express();

declare module 'express-session' {
  interface SessionData {
    currentChallengeOptions?: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
    loggedInUser: {id: string, name: string} | null;
  }
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 86400000,
      httpOnly: true, // Ensure to not expose session cookies to clientside scripts
    },
  }),
);

// TODO: Combine CORS settings for cleaner code
app.use(cors(corsOptions));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(handleError);

app.use('/api/passkey', passkeyRoutes);
app.use('/api/example', exampleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);

const clientDistPath = path.join(__dirname, '../../client/dist');
console.log(clientDistPath);
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
} else {
  app.get('/', (req, res) => {
    res.send(`Client build folder does not exist. Not serving client`);
  });
}

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

const host = "0.0.0.0";
if (enable_https) {
  https
    .createServer(
      {
        key: fs.readFileSync(`./${rpID}.key`),
        cert: fs.readFileSync(`./${rpID}.crt`),
      },
      app
    )
    .listen(port, host, () => {
      console.log(`🚀 Server ready at ${origin} (${host}:${port})`);
    });
} else {
  http.createServer(app).listen(port, host, () => {
    console.log(`🚀 Server ready at ${origin} (${host}:${port})`);
  });
}