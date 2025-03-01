import {db} from "../config/firebase";
import {addDoc, collection, doc, getDocs, updateDoc, writeBatch} from "@firebase/firestore";
import {uuidv4} from "@firebase/util";
import {DbCustomer, Product} from "../domain/products";


const QUOTES_COLLECTION_NAME = 'quotes';


export async function getCustomers() {
    console.log('getCustomers');
    const customerRef = collection(db, 'customers');

    const documents = await getDocs(customerRef);
    return documents.docs.map(doc => doc.data());
}


export async function updateItem(email: string, codeId: string, update: Partial<Product>) {
    console.log('updateItem', {email, codeId, update});

    const customerRef = collection(db, 'customers');
    const customers = await getDocs(customerRef);

    const customer = customers.docs.find(doc => doc.data().email === email);

    if (!customer) {
        console.log('updateItem: customer not found');
        return
    }

    const customerDoc = doc(db, 'customers', customer.id);
    const customerData = customer.data();
    const items = customerData.items;
    const item = items.find((item: any) => item.codeId === codeId);

    if (!item) {
        console.log('updateItem: item not found');
        return
    }


   const itemsToSave = items.map((item: any) => {
        if (item.codeId === codeId) {
            return {
                ...item,
                ...update
            }
        }
        return item;
    });


    await updateDoc(customerDoc, {
        items: itemsToSave
    });
}


export async function getCustomerByEmail(email: string | null) {
    console.log('getCustomerByEmail', {email});
    if (!email) {
        console.log('getCustomerByEmail - no email');
        return {};
    }
    const customers = await getCustomers();
    return customers.find(customer => customer.email === email);
}


export async function upsertItems(customerEmail: string, customerNewProducts: Product[]) {
    console.log('upsertItems', {customerEmail, customerNewProducts});
    const customerRef = collection(db, 'customers');

    const newCustomer: DbCustomer = {
        email: customerEmail,
        createdAt: new Date().toISOString(),
        items: customerNewProducts
    }

    const docRef = await addDoc(customerRef, newCustomer);
    console.log("Document written with ID: ", docRef.id);
}


export async function updateCustomer(customer: DbCustomer, customerAllProducts: Product[]) {
    console.log('updateCustomer', {customer, customerAllProducts});
    const customerRef = collection(db, 'customers');
    const customers = await getDocs(customerRef);

    const customerDoc = customers.docs.find(doc => doc.data().email === customer.email);

    if (!customerDoc) {
        console.log('updateCustomer - customer not found');
        return
    }

    const customerDocRef = doc(db, 'customers', customerDoc.id);

    await updateDoc(customerDocRef, {
        items: customerAllProducts
    });
}

export type QuoteType = 'affirmation' | 'motivation' | 'meditation' | string;

interface Quote {
    quote: string,
    type: QuoteType,
    id: string
}

export async function createQuotes(quotes: Quote[]) {
    console.log('firestore - createQuotes', {quotes});
    const batch = writeBatch(db);

    quotes.forEach((quote) => {
        const docRef = doc(db, "quotes", uuidv4());
        batch.set(docRef, {...quote, id: shortUuid()});
    });

    try {
        await batch.commit();
        console.log('firestore - created batch of quotes');
    } catch (error) {
        console.error('firestore - error creating batch of quotes', error);
    }
}

const shortUuid = () => {
    const uuid = uuidv4();
    return Buffer.from(uuid).toString('base64').replace(/=/g, '').substring(0, 12); // Skraca do 12 znaków
};

export async function migrateQuotes() {
    console.log('firestore - migrateQuotes');
    const quotesRef = collection(db, 'quotes');
    const quotes = await getDocs(quotesRef);

    const batch = writeBatch(db);

    quotes.docs.forEach((quote) => {
        const docRef = doc(db, 'quotes', quote.id);
        batch.update(docRef, {
            id: shortUuid()
        });
    });

    try {
        await batch.commit();
        console.log('firestore - migrated quotes');
    } catch (error) {
        console.error('firestore - error migrating quotes', error);
    }
}



export const getRandomQuote = async (type: string): Promise<Quote> => {
    try {
        const querySnapshot = await getDocs(collection(db, QUOTES_COLLECTION_NAME));
        const quotes = querySnapshot.docs.map(doc => doc.data()) as Quote[];
        const currentTypeQuotes = quotes.filter(quote => quote.type === type);
        return randomElement(currentTypeQuotes) || randomElement(quotes);
    } catch (error) {
        console.log('Error getting quote:', error as unknown);
        return randomElement(fallbackQuotes);
    }
}

export function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}



const fallbackQuotes = [
    {id: '1', type: 'affirmation', quote: "I am worthy of all the good things that come my way"},
    {id: '2', type: 'affirmation', quote: "Every day, in every way, I am becoming better and better"},
    {id: '3', type: 'affirmation', quote: "I choose to focus on what I can control and let go of what I can’t"},
    {id: '4', type: 'affirmation', quote: "Happiness is a choice, and today I choose to be happy"},
    {id: '5', type: 'affirmation', quote: "I am resilient, strong, and brave in the face of challenges"},
    {id: '6', type: 'affirmation', quote: "I am enough, just as I am, and I deserve love and respect"},
    {id: '7', type: 'affirmation', quote: "I have the power to create the life I desire"},
    {id: '8', type: 'affirmation', quote: "My thoughts shape my reality, and I choose to think positively"},
    {id: '9', type: 'affirmation', quote: "I am grateful for the abundance that flows into my life"},
    {id: '10', type: 'affirmation', quote: "I trust myself to make the right decisions for my growth and happiness"}
];