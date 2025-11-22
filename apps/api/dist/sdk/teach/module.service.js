import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { ZModule, ZModuleCreate, ZModuleUpdate } from '../types/models';
/** CRUD for Teach-Internal.Module */
export class ModuleService {
    constructor(http) {
        this.http = http;
    }
    async list(courseId) {
        const data = await this.http.get('/plugins/teach-internal/api/modules', courseId ? { params: { courseId } } : undefined);
        return z.array(ZModule).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/teach-internal/api/modules/${id}`);
        return ZModule.parse(data);
    }
    async create(input) {
        const payload = ZModuleCreate.parse(input);
        await this.http.get(`/plugins/teach-internal/api/courses/${payload.courseId}`);
        const data = await this.http.post('/plugins/teach-internal/api/modules', payload);
        return ZModule.parse(data);
    }
    async update(input) {
        const payload = ZModuleUpdate.parse(input);
        if (!payload.id)
            throw new ValidationError('Missing id in update', payload);
        if (payload.courseId) {
            await this.http.get(`/plugins/teach-internal/api/courses/${payload.courseId}`);
        }
        const data = await this.http.put(`/plugins/teach-internal/api/modules/${payload.id}`, payload);
        return ZModule.parse(data);
    }
    async delete(id) {
        await this.http.delete(`/plugins/teach-internal/api/modules/${id}`);
        return { success: true };
    }
}
