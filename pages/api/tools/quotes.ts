import {NextApiRequest, NextApiResponse} from "next";
import {use} from "next-api-route-middleware";
import {basicAuthMiddleware, validateMethod} from "../../../utils/validateUser";
import {createQuotes, migrateQuotes} from "../../../infrastructure/firebase";


const quotes = async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log('quotes - create quotes', req.body.quotes.length);

        if (!req.body.quotes || req.body.quotes.length === 0) {
            console.log('quotes - no quotes given for request');
            return res.status(400).json({message: 'Bad request'});
        }

        await createQuotes(req.body.quotes);

        return res.status(200).json({count: req.body.quotes.length});
    } catch (e) {
        console.error('error during create quotes', e)
        return res.status(500).json({})
    }
};

export default use(validateMethod('POST'), basicAuthMiddleware, quotes)