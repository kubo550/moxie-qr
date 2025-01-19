export enum ProductSource {
    MOXIE = 'MOXIE',
};

export enum VariantTitle {
    motivationalQuotes = 'Motivational Quotes',
    dailyAffirmations = 'Daily Affirmations',
    verseOfTheDay = 'Verse of The Day',
    moxieMeditation = 'Moxie Meditation',
    moxieTube = 'MoxieTube',
    moxieTok = 'MoxieTok',
    moxieMusic = 'MoxieMusic',
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
