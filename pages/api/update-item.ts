import {NextApiResponse} from "next";
import {updateItem} from "../../infrastructure/firebase";
import {use} from "next-api-route-middleware";
import {NextApiRequestWithUser, validateUserMiddleware} from "../../utils/validateUserMiddleware";
import {getVariantQrConfig} from "../../utils/products";
import {VariantType} from "../../domain/products";
import {validateMethodMiddleware} from "../../utils/validateMethodMiddleware";


function isValidLinkUrl(newLinkUrl: string) {
    return newLinkUrl.length <= 500 && newLinkUrl.startsWith('http');
}

export default use(validateMethodMiddleware('POST'), validateUserMiddleware, async (
    req: NextApiRequestWithUser,
    res: NextApiResponse
) => {

    try {
        const email = req.headers.email;
        const item = req.body.item;
        console.log('update item', {email, item});

        const newVariant = item.variant;
        const variantConfig = getVariantQrConfig(newVariant);
        const newLinkUrl =  item.linkUrl || variantConfig.options.base

        if (variantConfig.type === VariantType.CHANGEABLE && !isValidLinkUrl(newLinkUrl)) {
            return res.status(400).json({error: 'Invalid linkUrl'})
        }

        const linkUrl = variantConfig.type === VariantType.CHANGEABLE ? newLinkUrl : variantConfig.options.base;

        await updateItem(email, item.codeId, {variant: newVariant, linkUrl });

        res.status(200).json({item});
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({})
    }

});