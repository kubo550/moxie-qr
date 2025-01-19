import {ApiVersion, shopifyApi} from "@shopify/shopify-api";
import '@shopify/shopify-api/adapters/node'
import {Variant} from "../domain/products";

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


export async function getShopifyVariant(variantId: number):Promise<Variant> {
    const session = shopify.session.customAppSession(process.env.NEXT_PUBLIC_SHOPIFY_SHOP_URL!);
    const client = new shopify.clients.Graphql({ session });

    const query = `
    query GetVariant($id: ID!) {
      productVariant(id: $id) {
        id
        title
      }
    }
  `;

    const variables = {
        id: `gid://shopify/ProductVariant/${variantId}`,
    };

    const response = await client.query({
        data: {
            query,
            variables,
        },
    });

    // @ts-ignore
    return response.body.data.productVariant;
}