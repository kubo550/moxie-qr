import '@shopify/shopify-api/adapters/node'
import type {NextApiResponse} from 'next'
import {Product, ProductSource, ShopifyCreateOrder, ShopifyItem} from "../../../types/products";
import {getShopifyProduct} from "../../../infrastructure/shopify";
import {createNewCustomer, DbCustomer, getCustomerByEmail, updateCustomer} from "../../../infrastructure/firebase";
import {sendEmailToOldCustomer, sendInvitationEmail} from "../../../infrastructure/email-utils";


export default async function handler(
    req: ShopifyCreateOrder,
    res: NextApiResponse
) {

    try {
        console.log('handle-buy-item - new request');
        const customerEmail = req.body.customer.email
        console.log('handle-buy-item - customerEmail', customerEmail);

        const customerNewProducts = await getMappedItems(req.body.line_items, req.body.order_number);

        console.log(JSON.stringify(customerNewProducts, null, 2));

        const customer = await getCustomerByEmail(customerEmail);
        console.log('handle-buy-item - got customer', customer);

        if (!customer) {
            console.log('customer not found, creating new one');
            await createNewCustomer(customerEmail, customerNewProducts);
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


const toDbItemsFormat = async (item: ShopifyItem): Promise<Omit<Product, 'orderId'>> => {

    const codeId = '-1' // await generateCodeId();
    const shopifyProduct = await getShopifyProduct(item.product_id);

    return {
        codeId,
        imageUrl: shopifyProduct?.images?.[0]?.src || '',
        linkUrl: 'https://moxieimpact/',
        name: 'Set your name',
        title: item.name,
        productId: item.product_id,
        source: ProductSource.MOXIE
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
