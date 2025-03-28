import {Platform, Product, ProductSource, VariantConfig, VariantTitle, VariantType} from "../domain/products";
import {ShopifyItem} from "../types/products";
import {getShopifyProduct} from "../infrastructure/shopify";
import {generateCodeId} from "../infrastructure/generateCode";

export const dailyMoxieUrl = 'https://daily.moxieimpact.com'

export function getVariantQrConfig(variant: VariantTitle): VariantConfig {
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
                    base: `${dailyMoxieUrl}/moxie-tube`,
                    platforms: [Platform.youtube],
                }
            }
        case VariantTitle.moxieTok:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: `${dailyMoxieUrl}/moxie-tok`,
                    platforms: [Platform.tiktok],
                }
            }
        case VariantTitle.moxieMusic:
            return {
                type: VariantType.CHANGEABLE,
                options: {
                    base: `${dailyMoxieUrl}/moxie-music`,
                    platforms: [Platform.spotify],
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

export const toDbItemsFormat = async (item: ShopifyItem): Promise<Omit<Product, 'orderId'>> => {
    const [codeId, shopifyProduct] = await Promise.all([await generateCodeId(), await getShopifyProduct(item.product_id)])
    const qrConfig = {
        type: VariantType.CONSTANT,
        options: {
            base: `${dailyMoxieUrl}/motivation`,
        }
    };

    return {
        codeId,
        imageUrl: shopifyProduct?.images?.[0]?.src || '',
        linkUrl: qrConfig.options.base,
        title: item.name,
        productId: item.product_id,
        source: ProductSource.MOXIE,
        variant: VariantTitle.motivationalQuotes,
    }
};