
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ZPayment, type Payment } from '../types/models';

export class PaymentService {
  constructor(private http: HttpClient) {}

  async list(orderId?: string): Promise<Payment[]> {
    const data = await this.http.get<Payment[]>('/plugins/ecommerce/api/payments', orderId ? { params: { orderId } } as any : undefined);
    return z.array(ZPayment).parse(data);
  }

  async get(id: string): Promise<Payment> {
    const data = await this.http.get<Payment>(`/plugins/ecommerce/api/payments/${id}`);
    return ZPayment.parse(data);
  }

  async create(input: { orderId: string; provider?: string; amount: number; payload?: unknown }): Promise<Payment> {
    const data = await this.http.post<Payment>('/plugins/ecommerce/api/payments', input);
    return ZPayment.parse(data);
  }
}
