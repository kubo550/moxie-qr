import {db} from "../config/firebase";
import {addDoc, collection, doc, getDocs, updateDoc, writeBatch} from "@firebase/firestore";
import {uuidv4} from "@firebase/util";
import {DbCustomer, Product} from "../domain/products";




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

interface Quote {
    quote: string,
    type: 'affirmation' | 'motivation' | string
}

export async function createQuotes(quotes: Quote[]) {
    console.log('firestore - createQuotes', {quotes});
    const batch = writeBatch(db);

    quotes.forEach((quote) => {
        const docRef = doc(db, "quotes", uuidv4());
        batch.set(docRef, quote);
    });

    try {
        await batch.commit();
        console.log('firestore - created batch of quotes');
    } catch (error) {
        console.error('firestore - error creating batch of quotes', error);
    }
}