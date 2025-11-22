import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { ZTeacherProfile, ZTeacherCreate, ZTeacherUpdate } from '../types/models';
/** CRUD for Teach.TeacherProfile */
export class TeacherService {
    constructor(http) {
        this.http = http;
    }
    async list() {
        const data = await this.http.get('/plugins/teach/api/teachers');
        return z.array(ZTeacherProfile).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/teach/api/teachers/${id}`);
        return ZTeacherProfile.parse(data);
    }
    async create(input) {
        const payload = ZTeacherCreate.parse(input);
        const data = await this.http.post('/plugins/teach/api/teachers', payload);
        return ZTeacherProfile.parse(data);
    }
    async update(input) {
        const payload = ZTeacherUpdate.parse(input);
        if (!payload.id)
            throw new ValidationError('Missing id in update', payload);
        const data = await this.http.put(`/plugins/teach/api/teachers/${payload.id}`, payload);
        return ZTeacherProfile.parse(data);
    }
    async delete(id) {
        await this.http.delete(`/plugins/teach/api/teachers/${id}`);
        return { success: true };
    }
}
