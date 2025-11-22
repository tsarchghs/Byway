import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { ZOrder, ZOrderCreate, ZOrderUpdate, ZStudentMirror } from '../types/models';
/** CRUD for Ecommerce.Order + ensure StudentMirror exists; auto compute totals client-side if needed */
export class OrderService {
    constructor(http) {
        this.http = http;
    }
    async list() {
        const data = await this.http.get('/plugins/ecommerce/api/orders');
        return z.array(ZOrder).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/ecommerce/api/orders/${id}`);
        return ZOrder.parse(data);
    }
    /** Ensure StudentMirror exists before order creation, create it if missing. */
    async create(input) {
        const payload = ZOrderCreate.parse(input);
        // Check StudentMirror
        try {
            const sm = await this.http.get(`/plugins/ecommerce/api/student-mirrors/${payload.studentId}`);
            ZStudentMirror.parse(sm);
        }
        catch (_) {
            await this.http.post('/plugins/ecommerce/api/student-mirrors', {
                id: payload.studentId, // mirror id equals studentId
            });
        }
        // Optionally recompute totals here client-side (server should also do it)
        const data = await this.http.post('/plugins/ecommerce/api/orders', payload);
        return ZOrder.parse(data);
    }
    async update(input) {
        const payload = ZOrderUpdate.parse(input);
        if (!payload.id)
            throw new ValidationError('Missing id in update', payload);
        const data = await this.http.put(`/plugins/ecommerce/api/orders/${payload.id}`, payload);
        return ZOrder.parse(data);
    }
    async delete(id) {
        await this.http.delete(`/plugins/ecommerce/api/orders/${id}`);
        return { success: true };
    }
}
