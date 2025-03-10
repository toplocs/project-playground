import { CorsOptions } from 'cors';
import { CookieOptions } from 'express';
import { SecureContextOptions } from 'tls';
import fs from 'fs';

export const enable_https: boolean = process.env.HTTPS === 'true';
export const port: number =  process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const rpName: string = 'TEST';
export const rpID: string = 'localhost';
export const origin: string[] = [
  `http://${rpID}:${port}`,
  `https://${rpID}:${port}`,
  `http://localhost:5173`,
  `https://localhost:5173`
];

export const corsOptions: CorsOptions = {
  origin: origin,
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE']
};

export const cookieOptions: CookieOptions = {
  maxAge: 86400000,
  httpOnly: false,
  sameSite: enable_https ? 'none' : 'lax',
  secure: enable_https ? true : undefined,
};

const certificatesKey = `${__dirname}/../../localhost-key.pem`;
const certificatesCert = `${__dirname}/../../localhost.pem`;

let certificate: SecureContextOptions = { key: '', cert: '' };
if (enable_https) {
  try {
    certificate.key = fs.readFileSync(certificatesKey, 'utf8');
    certificate.cert = fs.readFileSync(certificatesCert, 'utf8');
    console.log('Certificate files loaded successfully.');
  } catch (error) {
    console.error('Certificate files are not found. Please create them to enable HTTPS');
    process.exit(1);
  }
} else {
  console.log('HTTPS is disabled.');
}
export { certificate };