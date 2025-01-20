import '@shopify/shopify-api/adapters/node'
import type {NextApiResponse} from 'next'
import {
    ShopifyCreateOrder,
    ShopifyItem,
} from "../../../types/products";
import {upsertItems, getCustomerByEmail, updateCustomer} from "../../../infrastructure/firebase";
import {sendEmailToOldCustomer, sendInvitationEmail} from "../../../infrastructure/email-utils";
import {
    DbCustomer,
    Product,
} from "../../../domain/products";
import {toDbItemsFormat} from "../../../utils/products";


export default async function handler(
    req: ShopifyCreateOrder,
    res: NextApiResponse
) {

    console.log('handle-buy-item - new request', JSON.stringify(req.body.line_items, null, 2));
    try {
        console.log('handle-buy-item - new request');
        const customerEmail = req.body.customer.email
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
