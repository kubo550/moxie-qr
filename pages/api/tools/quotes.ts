import {NextApiRequest, NextApiResponse} from "next";
import {use} from "next-api-route-middleware";
import {basicAuthMiddleware, validateMethod} from "../../../utils/validateUser";
import {createQuotes} from "../../../infrastructure/firebase";
import * as yup from 'yup';


const quoteSchema = yup.object({
    quote: yup.string().required("Quote is required").min(1, "Quote cannot be empty"),
});

const quotesSchema = yup.object({
    quotes: yup.array().of(quoteSchema).min(1, "At least one quote is required")
});

const quotes = async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log('quotes - create quotes - got request');

        try {
            await quotesSchema.validate(req.body);
        } catch (e) {
            console.log('quotes - create quotes - validation error', e);
            return res.status(400).json({message: e instanceof yup.ValidationError ? e.errors : 'Invalid request'});
        }

        await createQuotes(req.body.quotes);

        return res.status(200).json({count: req.body.quotes.length});
    } catch (e) {
        console.error('error during create quotes', e)
        return res.status(500).json({})
    }
};

export default use(validateMethod('POST'), basicAuthMiddleware, quotes)