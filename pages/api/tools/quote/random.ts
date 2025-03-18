import {NextApiRequest, NextApiResponse} from "next";
import {use} from "next-api-route-middleware";
import {basicAuthMiddleware, validateMethod} from "../../../../utils/validateUser";
import {getRandomQuote, QuoteType} from "../../../../infrastructure/firebase";


const randomQuote = async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const type = (req.query.type || 'affirmation') as QuoteType ;
        console.log('quotes - get random quote', {type});

        const quote = await getRandomQuote(type);
        console.log('quotes - get random quote', {quoteId: quote.id});

        return res.status(200).json({quote});
    } catch (e) {
        console.error('error during create quotes', e)
        return res.status(500).json({})
    }
};

export default use(validateMethod('GET'), basicAuthMiddleware, randomQuote)