import '@shopify/shopify-api/adapters/node'
import type {NextApiResponse} from 'next'
import {
    Product,
    ProductSource,
    ShopifyCreateOrder,
    ShopifyItem,
    VariantConfig, VariantTitle,
    VariantType
} from "../../../types/products";
import {getShopifyProduct, getShopifyVariant} from "../../../infrastructure/shopify";
import {upsertItems, DbCustomer, getCustomerByEmail, updateCustomer} from "../../../infrastructure/firebase";
import {sendEmailToOldCustomer, sendInvitationEmail} from "../../../infrastructure/email-utils";


export default async function handler(
    req: ShopifyCreateOrder,
    res: NextApiResponse
) {

    console.log('handle-buy-item - new request', JSON.stringify(req.body.line_items, null, 2));
    try {
        console.log('handle-buy-item - new request');
        const customerEmail = 'test@wp.pl' // req.body.customer.email
        console.log('handle-buy-item - customerEmail', customerEmail);

        const customerNewProducts = await getMappedItems(req.body.line_items, req.body.order_number);

        console.log('items: ', JSON.stringify(customerNewProducts, null, 2));

        const customer = await getCustomerByEmail(customerEmail);
        console.log('handle-buy-item - got customer', customer);

        if (!customer) {
            console.log('customer not found, creating new one');
            await upsertItems(customerEmail, customerNewProducts);
            await sendInvitationEmail(customerEmail);
        } else {
            console.log('customer found, updating');
            await updateCustomer(customer as DbCustomer, [...customer.items, ...customerNewProducts]);
            await sendEmailToOldCustomer(customerEmail);
        }

        res.status(200).json({status: 'ok'});

        return
    } catch (e) {
        console.log('ERROR')
        console.error(e)
        res.status(200).json({status: 'error'});
        return
    }
}


const dailyMoxieUrl = 'https://chic-crumble-94a11f.netlify.app'

function getVariantQrConfig(variant: VariantTitle): VariantConfig {
    switch (variant) {
        case VariantTitle.motivationalQuotes:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `${dailyMoxieUrl}/motivation`,
                }
            }
        case VariantTitle.dailyAffirmations:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `${dailyMoxieUrl}/affirmation`,
                }
            }
        case VariantTitle.verseOfTheDay:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `${dailyMoxieUrl}/verse`,
                }
            }
        case VariantTitle.moxieMeditation:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `${dailyMoxieUrl}/meditation`,
                }
            }
        case VariantTitle.moxieTube:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: 'https://www.youtube.com/',
                    platform: 'youtube',
                }
            }
        case VariantTitle.moxieTok:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: 'https://www.tiktok.com/',
                    platform: 'tiktok',
                }
            }
        case VariantTitle.moxieMusic:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: 'https://open.spotify.com/',
                    platform: 'spotify',
                }
            }
        default:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `${dailyMoxieUrl}/motivation`,
                }
            }
    }
}

const toDbItemsFormat = async (item: ShopifyItem): Promise<Omit<Product, 'orderId'>> => {
    const codeId = '-1' // await generateCodeId();
    const shopifyProduct = await getShopifyProduct(item.product_id);
    const variant = await getShopifyVariant(item.variant_id);
    const qrConfig = getVariantQrConfig(variant?.title);

    return {
        codeId,
        imageUrl: shopifyProduct?.images?.[0]?.src || '',
        linkUrl: qrConfig.options.base,
        name: 'Set your name',
        title: item.name,
        productId: item.product_id,
        source: ProductSource.MOXIE,
        qrConfig,
    }
};


async function getMappedItems(items: ShopifyItem[], orderNumber: number) {
    if (!items) {
        return [];
    }
    const mappedItems: Product[] = [];

    const allItems = items.reduce((acc, item) => {
        const quantity = item.quantity;
        const newItem = {...item, quantity: 1};
        const newItems = Array(quantity).fill(newItem);
        return [...acc, ...newItems];
    }, [] as ShopifyItem[]);

    for (const item of allItems) {
        const mappedItem = await toDbItemsFormat(item);
        mappedItems.push({...mappedItem, orderId: orderNumber?.toString()});
    }
    return mappedItems;
}
