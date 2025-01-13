import {ApiVersion, shopifyApi} from "@shopify/shopify-api";

const shopify = shopifyApi({
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
    apiSecretKey: process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET_KEY!,
    privateAppStorefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
    adminApiAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
    scopes: ['read_products'],
    hostName: 'https://moxieimpact.com/',
    apiVersion: ApiVersion.January25,
    isEmbeddedApp: true,
    isCustomStoreApp: true,
});


export async function getShopifyProduct(productId: string) {
    const session = shopify.session.customAppSession(process.env.NEXT_PUBLIC_SHOPIFY_SHOP_URL!)
    const client = new shopify.clients.Rest({session})
    const product = await client.get({
        path: `products/${productId}`,
    })

    return product.body.product;
}
