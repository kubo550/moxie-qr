export enum ProductSource {
    MOXIE = 'MOXIE',
};

export enum VariantTitle {
    instagram = 'Instagram',
    youtube = 'YouTube',
    tiktok = 'TikTok',
    facebook = 'Facebook',
    spotify = 'Spotify',


    moxieDaily = 'MoxieDaily',
    moxieFaith = 'MoxieFaith',
    moxieRecovery = 'MoxieRecovery',
}

export type Variant = {
    id: string,
    title: VariantTitle
};
export enum VariantType {
    CONSTANT = 'constant',
    CHANGEABLE = 'changeable',
}

export type VariantConfig = {
    type: VariantType;
    options: VariantOptions;
}

export enum Platform {
    youtube = 'youtube',
    tiktok = 'tiktok',
    spotify = 'spotify',
    facebook = 'facebook',
    instagram = 'instagram',
}
export type VariantOptions = {
    base: string;
    platforms?: Platform[];
}

export type Product = {
    orderId: string
    codeId: string,
    imageUrl: string
    linkUrl: string,
    productId: string,
    title: string,
    source?: ProductSource,
    variant: VariantTitle,
}

export type DbCustomer = {
    email: string,
    createdAt: string,
    items: Product[]
}
