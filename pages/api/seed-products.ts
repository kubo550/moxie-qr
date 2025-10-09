import type {NextApiRequest, NextApiResponse} from 'next'
import {ShopifyItem} from "../../types/products";
import {upsertItems} from "../../infrastructure/firebase";
import {Product, ProductSource, VariantTitle} from "../../domain/products";
import {getShopifyProduct} from "../../infrastructure/shopify";

interface SeedProductsRequest extends NextApiRequest {
    body: {
        emailTemplate: string;
        lineItems: ShopifyItem[];
        count: number;
        startCodeId: number;
    }
}

export default async function handler(
    req: SeedProductsRequest,
    res: NextApiResponse
) {
    console.log('seed-products - new request', JSON.stringify(req.body, null, 2));

    if (req.method !== 'POST') {
        res.status(405).json({status: 'error', message: 'Method not allowed'});
        return;
    }

    try {
        const {emailTemplate, lineItems, count, startCodeId} = req.body;

        if (!emailTemplate || !lineItems || !count || startCodeId === undefined) {
            res.status(400).json({
                status: 'error',
                message: 'Missing required parameters: emailTemplate, lineItems, count, startCodeId'
            });
            return;
        }

        console.log(`seed-products - creating ${count} accounts starting from codeId ${startCodeId}`);

        for (let i = 0; i < count; i++) {
            const currentCodeId = startCodeId + i;
            const email = `${emailTemplate}${currentCodeId}@stworcustomer.com`;

            console.log(`seed-products - processing ${i + 1}/${count}: ${email}, codeId: ${currentCodeId}`);

            const customerProducts = await getMappedItemsWithCodeId(lineItems, currentCodeId);

            await upsertItems(email, customerProducts);

            console.log(`seed-products - created account for ${email} with ${customerProducts.length} products`);
        }

        res.status(200).json({
            status: 'ok',
            message: `Successfully created ${count} accounts`,
            startCodeId,
            endCodeId: startCodeId + count - 1
        });

        return;
    } catch (e) {
        console.log('ERROR in seed-products')
        console.error(e)
        res.status(500).json({status: 'error', message: 'Internal server error'});
        return;
    }
}

async function getMappedItemsWithCodeId(items: ShopifyItem[], codeId: number): Promise<Product[]> {
    if (!items) {
        return [];
    }

    const mappedItems: Product[] = [];

    // Expand items based on quantity
    const allItems = items.reduce((acc, item) => {
        const quantity = item.quantity;
        const newItem = {...item, quantity: 1};
        const newItems = Array(quantity).fill(newItem);
        return [...acc, ...newItems];
    }, [] as ShopifyItem[]);

    for (const item of allItems) {
        const shopifyProduct = await getShopifyProduct(item.product_id);

        const mappedItem: Product = {
            codeId: codeId.toString(),
            imageUrl: shopifyProduct?.images?.[0]?.src || '',
            linkUrl: 'https://moxiedaily.co/',
            title: item.name,
            productId: item.product_id,
            source: ProductSource.MOXIE,
            variant: VariantTitle.moxieDaily,
            orderId: 'seed-' + codeId.toString()
        };

        mappedItems.push(mappedItem);
    }

    return mappedItems;
}
