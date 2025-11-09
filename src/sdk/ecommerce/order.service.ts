
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';
import { ZOrder, ZOrderCreate, ZOrderUpdate, ZStudentMirror, type Order, type OrderCreate, type OrderUpdate } from '../types/models';

/** CRUD for Ecommerce.Order + ensure StudentMirror exists; auto compute totals client-side if needed */
export class OrderService {
  constructor(private http: HttpClient) {}

  async list(): Promise<Order[]> {
    const data = await this.http.get<Order[]>('/plugins/ecommerce/api/orders');
    return z.array(ZOrder).parse(data);
  }

  async get(id: string): Promise<Order> {
    const data = await this.http.get<Order>(`/plugins/ecommerce/api/orders/${id}`);
    return ZOrder.parse(data);
  }

  /** Ensure StudentMirror exists before order creation, create it if missing. */
  async create(input: OrderCreate): Promise<Order> {
    const payload = ZOrderCreate.parse(input);
    // Check StudentMirror
    try {
      const sm = await this.http.get(`/plugins/ecommerce/api/student-mirrors/${payload.studentId}`);
      ZStudentMirror.parse(sm);
    } catch (_) {
      await this.http.post('/plugins/ecommerce/api/student-mirrors', {
        id: payload.studentId, // mirror id equals studentId
      });
    }
    // Optionally recompute totals here client-side (server should also do it)
    const data = await this.http.post<Order>('/plugins/ecommerce/api/orders', payload);
    return ZOrder.parse(data);
  }

  async update(input: OrderUpdate): Promise<Order> {
    const payload = ZOrderUpdate.parse(input);
    if (!payload.id) throw new ValidationError('Missing id in update', payload);
    const data = await this.http.put<Order>(`/plugins/ecommerce/api/orders/${payload.id}`, payload);
    return ZOrder.parse(data);
  }

  async delete(id: string): Promise<{ success: true }> {
    await this.http.delete(`/plugins/ecommerce/api/orders/${id}`);
    return { success: true };
  }
}
