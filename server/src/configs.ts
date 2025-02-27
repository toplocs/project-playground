import cors from 'cors';

export const port: number =  3000;
export const enable_https: boolean = false;

export const rpName: string = 'TEST';
export const rpID: string = 'localhost';
export const origin: string = `http://${rpID}:${port}`;

export const corsOptions: cors.CorsOptions = {
  origin: '*'
};