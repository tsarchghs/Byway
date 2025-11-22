import { z } from 'zod';
import { ZPayment } from '../types/models';
export class PaymentService {
    constructor(http) {
        this.http = http;
    }
    async list(orderId) {
        const data = await this.http.get('/plugins/ecommerce/api/payments', orderId ? { params: { orderId } } : undefined);
        return z.array(ZPayment).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/ecommerce/api/payments/${id}`);
        return ZPayment.parse(data);
    }
    async create(input) {
        const data = await this.http.post('/plugins/ecommerce/api/payments', input);
        return ZPayment.parse(data);
    }
}
