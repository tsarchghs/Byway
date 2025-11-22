import { ZOrder } from '../types/models';
/** Cart is modeled as a PENDING order for a student */
export class CartService {
    constructor(http) {
        this.http = http;
    }
    async getCart(studentId) {
        const data = await this.http.get(`/plugins/ecommerce/api/carts/by-student/${studentId}`);
        return ZOrder.parse(data);
    }
    async addItem(studentId, item) {
        const data = await this.http.post(`/plugins/ecommerce/api/carts/by-student/${studentId}/items`, item);
        return ZOrder.parse(data);
    }
    async removeItem(studentId, orderItemId) {
        const data = await this.http.delete(`/plugins/ecommerce/api/carts/by-student/${studentId}/items/${orderItemId}`);
        return ZOrder.parse(data);
    }
    async clear(studentId) {
        const data = await this.http.delete(`/plugins/ecommerce/api/carts/by-student/${studentId}`);
        return ZOrder.parse(data);
    }
}
