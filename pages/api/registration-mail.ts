import {NextApiRequest, NextApiResponse} from "next";
import {sendRegistrationEmail} from "../../infrastructure/email-utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log('registration mail', req.headers.origin)

        console.log('registration mail to', req.body.email);
        const email = req.body.email;
        await sendRegistrationEmail(email);
        console.log('registration mail sent to', email);
        return res.status(200).json({message: 'Email sent successfully'});
    } catch (e) {
        console.error(e)
        return res.status(500).json({})
    }
}