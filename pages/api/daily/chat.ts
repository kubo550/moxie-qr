import {NextApiRequest, NextApiResponse} from "next";
import {use} from "next-api-route-middleware";
import {rateLimitMiddleware} from "../../../utils/rateLimitMiddleware";
import {checkOriginMiddleware} from "../../../utils/originMiddleware";
import {validateMethodMiddleware} from "../../../utils/validateMethodMiddleware";
import {getMoxieReply} from "../../../utils/openAiClient";
import {corsMiddleware} from "../../../utils/corsMiddleware";


const chat = async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // @ts-ignore
        const sessionId = req.session?.anonymousId
        const {conversation} = req.body
        console.log('chat - got request', {conversationLength: conversation.length, sessionId});

        const reply= await getMoxieReply(conversation);

        console.log('chat - got reply', {reply, sessionId})
        return res.status(200).json({reply})
    } catch (e) {

    }
};

export default use(corsMiddleware, validateMethodMiddleware('POST'),  checkOriginMiddleware, rateLimitMiddleware, chat)


