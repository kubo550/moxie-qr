import {Platform, Product, ProductSource, VariantConfig, VariantTitle, VariantType} from "../domain/products";
import {ShopifyItem} from "../types/products";
import {getShopifyProduct} from "../infrastructure/shopify";
import {generateCodeId} from "../infrastructure/generateCode";

export const dailyMoxieUrl = 'https://daily.moxieimpact.com'

export function getVariantQrConfig(variant: VariantTitle): VariantConfig {
    switch (variant) {
        case VariantTitle.instagram:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: `https://instagram.com/`,
                    platforms: [Platform.instagram],
                }
            }
        case VariantTitle.youtube:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: `https://youtube.com/`,
                    platforms: [Platform.youtube],
                }
            }
        case VariantTitle.tiktok:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: `https://tiktok.com/`,
                    platforms: [Platform.tiktok],
                }
            }
        case VariantTitle.facebook:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: `https://facebook.com/`,
                    platforms: [Platform.facebook],
                }
            }
        case VariantTitle.spotify:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: `https://spotify.com/`,
                    platforms: [Platform.spotify],
                }
            }

        case VariantTitle.moxieDaily:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `https://moxiedaily.co/`,
                }
            }
        case VariantTitle.moxieFaith:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `https://moxiefaith.co/`,
                }
            }
        case VariantTitle.moxieRecovery:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `https://moxierecovery.co/`,
                }
            }
        default:
            return {
                type: VariantType.CONSTANT,
                options: {
                    base: `https://moxiedaily.co/`,
                }
            }
    }
}

export const toDbItemsFormat = async (item: ShopifyItem): Promise<Omit<Product, 'orderId'>> => {
    const [codeId, shopifyProduct] = await Promise.all([await generateCodeId(), await getShopifyProduct(item.product_id)])
    const qrConfig = {
        type: VariantType.CONSTANT,
        options: {
            base: `https://moxiedaily.co/`,
        }
    };

    return {
        codeId,
        imageUrl: shopifyProduct?.images?.[0]?.src || '',
        linkUrl: qrConfig.options.base,
        title: item.name,
        productId: item.product_id,
        source: ProductSource.MOXIE,
        variant: VariantTitle.moxieDaily,
    }
};