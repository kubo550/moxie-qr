import {Middleware} from "next-api-route-middleware";

export type AllowedMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export const validateMethodMiddleware = (method: AllowedMethod): Middleware => async (req, res, next) => {
    if (req.method !== method) {
        return res.status(405).json({message: 'Method not allowed'});
    }
    await next();
}