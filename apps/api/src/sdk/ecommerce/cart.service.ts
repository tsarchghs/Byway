
import { HttpClient } from '../utils/http';
import { ZOrder, type Order } from '../types/models';

/** Cart is modeled as a PENDING order for a student */
export class CartService {
  constructor(private http: HttpClient) {}

  async getCart(studentId: string): Promise<Order> {
    const data = await this.http.get<Order>(`/plugins/ecommerce/api/carts/by-student/${studentId}`);
    return ZOrder.parse(data);
  }

  async addItem(studentId: string, item: { courseId: string; titleSnapshot: string; priceSnapshot: number; quantity?: number }): Promise<Order> {
    const data = await this.http.post<Order>(`/plugins/ecommerce/api/carts/by-student/${studentId}/items`, item);
    return ZOrder.parse(data);
  }

  async removeItem(studentId: string, orderItemId: string): Promise<Order> {
    const data = await this.http.delete<Order>(`/plugins/ecommerce/api/carts/by-student/${studentId}/items/${orderItemId}`);
    return ZOrder.parse(data);
  }

  async clear(studentId: string): Promise<Order> {
    const data = await this.http.delete<Order>(`/plugins/ecommerce/api/carts/by-student/${studentId}`);
    return ZOrder.parse(data);
  }
}
