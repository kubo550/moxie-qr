import axios from "axios";
import nookies from "nookies";
import {NextApiRequest} from "next";
import {Product, ProductSource} from "../domain/products";

export class ApiClient {
    constructor() {
    }

    static async sendRegistrationEmail(email: string) {
        const {data} = await axios.post(`/api/registration-mail`, {email}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data
    }

    static async triggerWebhook(body: NextApiRequest['body']) {
        console.log('triggerWebhook');
        await axios.post(`https://my.reshrd.com/api/webhook/handle-buy-item`, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async getItems(params: {source?: ProductSource} = {}) {
        const {data} = await axios.get(`/api/items`, {
            params,
            headers: this.getAuthorization()
        });
        return data
    }

    async updateItem(item: Partial<Product>) {
        const {data} = await axios.post(`/api/update-item`, {item}, {
            headers: this.getAuthorization()
        });
        return data
    }

    async sendContactForm(emailData: { message: string, email: string, subject: string }) {
        const {data} = await axios.post(`/api/contact`, emailData, {
            headers: this.getAuthorization()
        });
        return data
    }

    async getReport() {
        const {data} = await axios.get<any>('/api/items-report', {
            responseType: 'blob',
            headers: this.getAuthorization()
        });
        return data;
    }

    getAuthorization() {
        const cookies = nookies.get(null, 'token');
        return {
            'Authorization': `Bearer ${cookies.token}`
        }
    }
}

