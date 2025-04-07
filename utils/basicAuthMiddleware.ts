import {Middleware} from "next-api-route-middleware";

export const basicAuthMiddleware: Middleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({error: 'Unauthorized'});
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if (username !== process.env.NEXT_PUBLIC_API_AUTH_USERNAME || password !== process.env.NEXT_PUBLIC_API_AUTH_PASSWORD) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        return next();
    } catch (e) {
        console.error('error during allowMethods', e)
        return res.status(500).json({})
    }
};