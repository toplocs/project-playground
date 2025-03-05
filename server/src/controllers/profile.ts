import { Request, Response, NextFunction } from 'express';

export const profilesLulu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('Hello from profiles controller');
};