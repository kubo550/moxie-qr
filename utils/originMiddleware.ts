import type { NextApiRequest, NextApiResponse } from 'next';

export const checkOriginMiddleware = async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    const origin = req.headers.origin || req.headers.referer || '';
    console.log('checkOriginMiddleware - origin', origin);

    const isAllowed = allowedOrigins.some((allowed) =>
        origin.includes(allowed.trim())
    );

    if (!isAllowed) {
        console.warn(`checkOriginMiddleware - Forbidden origin: ${origin}`, {allowedOrigins});

        return res.status(403).json({ message: 'Forbidden origin' });
    }

    return next();
};
