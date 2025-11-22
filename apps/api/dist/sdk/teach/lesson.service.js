import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { ZLesson, ZLessonCreate, ZLessonUpdate } from '../types/models';
/** CRUD for Teach-Internal.Lesson */
export class LessonService {
    constructor(http) {
        this.http = http;
    }
    async list(moduleId) {
        const data = await this.http.get('/plugins/teach-internal/api/lessons', moduleId ? { params: { moduleId } } : undefined);
        return z.array(ZLesson).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/teach-internal/api/lessons/${id}`);
        return ZLesson.parse(data);
    }
    async create(input) {
        const payload = ZLessonCreate.parse(input);
        await this.http.get(`/plugins/teach-internal/api/modules/${payload.moduleId}`);
        const data = await this.http.post('/plugins/teach-internal/api/lessons', payload);
        return ZLesson.parse(data);
    }
    async update(input) {
        const payload = ZLessonUpdate.parse(input);
        if (!payload.id)
            throw new ValidationError('Missing id in update', payload);
        if (payload.moduleId) {
            await this.http.get(`/plugins/teach-internal/api/modules/${payload.moduleId}`);
        }
        const data = await this.http.put(`/plugins/teach-internal/api/lessons/${payload.id}`, payload);
        return ZLesson.parse(data);
    }
    async delete(id) {
        await this.http.delete(`/plugins/teach-internal/api/lessons/${id}`);
        return { success: true };
    }
}
