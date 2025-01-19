export type ShopifyItem = {
    id: number,
    variant_id: number,
    title: string,
    quantity: number,
    sku: string,
    variant_title: string,
    vendor: string,
    fulfillment_service: string,
    product_id: string,
    requires_shipping: boolean,
    taxable: boolean,
    gift_card: boolean,
    name: string,
    variant_inventory_management: string,
    properties: any[],
    product_exists: boolean,
    fulfillable_quantity: number,
    grams: number,
    price: string,
    total_discount: string,
    fulfillment_status: string,
    price_set: {
        shop_money: {
            amount: string,
            currency_code: string
        }
    },
    total_discount_set: {
        shop_money: {
            amount: string,
            currency_code: string
        }
    },
    discount_allocations: any[],
    duties: any[],
    admin_graphql_api_id: string,
    tax_lines: any[]
}


import {NextApiRequest} from "next";

export interface ShopifyCreateOrder {
    id: number;
    admin_graphql_api_id: string;
    app_id: unknown;
    browser_ip: unknown;
    buyer_accepts_marketing: boolean;
    cancel_reason: string;
    cancelled_at: Date;
    cart_token: unknown;
    checkout_id: unknown;
    checkout_token: unknown;
    client_details: unknown;
    closed_at: unknown;
    confirmation_number: unknown;
    confirmed: boolean;
    contact_email: string;
    created_at: Date;
    currency: Currency;
    current_shipping_price_set: Set;
    current_subtotal_price: string;
    current_subtotal_price_set: Set;
    current_total_additional_fees_set: unknown;
    current_total_discounts: string;
    current_total_discounts_set: Set;
    current_total_duties_set: unknown;
    current_total_price: string;
    current_total_price_set: Set;
    current_total_tax: string;
    current_total_tax_set: Set;
    customer_locale: string;
    device_id: unknown;
    discount_codes: any[];
    duties_included: boolean;
    email: string;
    estimated_taxes: boolean;
    financial_status: string;
    fulfillment_status: unknown;
    landing_site: unknown;
    landing_site_ref: unknown;
    location_id: unknown;
    merchant_business_entity_id: string;
    merchant_of_record_app_id: unknown;
    name: string;
    note: unknown;
    note_attributes: any[];
    number: number;
    order_number: number;
    order_status_url: string;
    original_total_additional_fees_set: unknown;
    original_total_duties_set: unknown;
    payment_gateway_names: string[];
    phone: unknown;
    po_number: unknown;
    presentment_currency: Currency;
    processed_at: Date;
    reference: unknown;
    referring_site: unknown;
    source_identifier: unknown;
    source_name: string;
    source_url: unknown;
    subtotal_price: string;
    subtotal_price_set: Set;
    tags: string;
    tax_exempt: boolean;
    tax_lines: any[];
    taxes_included: boolean;
    test: boolean;
    token: string;
    total_cash_rounding_payment_adjustment_set: Set;
    total_cash_rounding_refund_adjustment_set: Set;
    total_discounts: string;
    total_discounts_set: Set;
    total_line_items_price: string;
    total_line_items_price_set: Set;
    total_outstanding: string;
    total_price: string;
    total_price_set: Set;
    total_shipping_price_set: Set;
    total_tax: string;
    total_tax_set: Set;
    total_tip_received: string;
    total_weight: number;
    updated_at: Date;
    user_id: unknown;
    billing_address: Address;
    customer: Customer;
    discount_applications: any[];
    fulfillments: any[];
    line_items: ShopifyItem[];
    payment_terms: unknown;
    refunds: any[];
    shipping_address: Address;
    shipping_lines: ShippingLine[];
    returns: any[];
}

export interface Address {
    first_name: unknown | string;
    address1: string;
    phone: string;
    city: string;
    zip: string;
    province: string;
    country: string;
    last_name: unknown | string;
    address2: unknown;
    company: unknown | string;
    latitude?: unknown;
    longitude?: unknown;
    name: string;
    country_code: string;
    province_code: string;
    id?: number;
    customer_id?: number;
    country_name?: string;
    default?: boolean;
}

export enum Currency {
    Usd = "USD",
}

export interface Set {
    shop_money: Money;
    presentment_money: Money;
}

export interface Money {
    amount: string;
    currency_code: Currency;
}

export interface Customer {
    id: number;
    email: string;
    created_at: unknown;
    updated_at: unknown;
    first_name: string;
    last_name: string;
    state: string;
    note: unknown;
    verified_email: boolean;
    multipass_identifier: unknown;
    tax_exempt: boolean;
    phone: unknown;
    currency: Currency;
    tax_exemptions: any[];
    admin_graphql_api_id: string;
    default_address: Address;
}

export interface AttributedStaff {
    id: string;
    quantity: number;
}

export interface ShippingLine {
    id: number;
    carrier_identifier: unknown;
    code: unknown;
    current_discounted_price_set: Set;
    discounted_price: string;
    discounted_price_set: Set;
    is_removed: boolean;
    phone: unknown;
    price: string;
    price_set: Set;
    requested_fulfillment_service_id: unknown;
    source: string;
    title: string;
    tax_lines: any[];
    discount_allocations: any[];
}


export interface ShopifyCreateOrder extends NextApiRequest {
    body: ShopifyCreateOrder;
}