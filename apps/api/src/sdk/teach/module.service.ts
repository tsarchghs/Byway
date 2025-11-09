
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';
import { ZModule, ZModuleCreate, ZModuleUpdate, type Module, type ModuleCreate, type ModuleUpdate } from '../types/models';

/** CRUD for Teach-Internal.Module */
export class ModuleService {
  constructor(private http: HttpClient) {}

  async list(courseId?: string): Promise<Module[]> {
    const data = await this.http.get<Module[]>('/plugins/teach-internal/api/modules', courseId ? { params: { courseId } } as any : undefined);
    return z.array(ZModule).parse(data);
  }

  async get(id: string): Promise<Module> {
    const data = await this.http.get<Module>(`/plugins/teach-internal/api/modules/${id}`);
    return ZModule.parse(data);
  }

  async create(input: ModuleCreate): Promise<Module> {
    const payload = ZModuleCreate.parse(input);
    await this.http.get(`/plugins/teach-internal/api/courses/${payload.courseId}`);
    const data = await this.http.post<Module>('/plugins/teach-internal/api/modules', payload);
    return ZModule.parse(data);
  }

  async update(input: ModuleUpdate): Promise<Module> {
    const payload = ZModuleUpdate.parse(input);
    if (!payload.id) throw new ValidationError('Missing id in update', payload);
    if (payload.courseId) {
      await this.http.get(`/plugins/teach-internal/api/courses/${payload.courseId}`);
    }
    const data = await this.http.put<Module>(`/plugins/teach-internal/api/modules/${payload.id}`, payload);
    return ZModule.parse(data);
  }

  async delete(id: string): Promise<{ success: true }> {
    await this.http.delete(`/plugins/teach-internal/api/modules/${id}`);
    return { success: true };
  }
}
