import axios from "axios";
import nookies from "nookies";
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

