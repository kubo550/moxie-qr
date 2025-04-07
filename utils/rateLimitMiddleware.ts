import rateLimit from 'express-rate-limit';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './session';

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000 , // one hour
    max: 30,
    keyGenerator: (req: any) => {
        return req.session?.anonymousId || req.socket.remoteAddress;
    },
    handler: (req: any, res: any) => {
        console.warn(`Rate limit exceeded for ${req.session?.anonymousId || req.socket.remoteAddress}`);
        res.status(429).json({ message: 'Too many requests' });
    },
});

export const rateLimitMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const session = await getIronSession(req, res, sessionOptions) as any;

    if (!session.anonymousId) {
        session.anonymousId = crypto.randomUUID();
        await session.save();
    }

    (req as any).session = session;

    return limiter(req as any, res as any, next);
};
