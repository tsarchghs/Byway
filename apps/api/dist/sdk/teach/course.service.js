import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { ZCourse, ZCourseCreate, ZCourseUpdate } from '../types/models';
/** CRUD for Teach-Internal.Course */
export class CourseService {
    constructor(http) {
        this.http = http;
    }
    async list() {
        const data = await this.http.get('/plugins/teach-internal/api/courses');
        return z.array(ZCourse).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/teach-internal/api/courses/${id}`);
        return ZCourse.parse(data);
    }
    async create(input) {
        const payload = ZCourseCreate.parse(input);
        // Ensure teacherId corresponds to an existing user (soft link) – optional existence check if endpoint exists
        await this.http.get(`/plugins/authentication/api/users/${payload.teacherId}`);
        const data = await this.http.post('/plugins/teach-internal/api/courses', payload);
        return ZCourse.parse(data);
    }
    async update(input) {
        const payload = ZCourseUpdate.parse(input);
        if (!payload.id)
            throw new ValidationError('Missing id in update', payload);
        if (payload.teacherId) {
            await this.http.get(`/plugins/authentication/api/users/${payload.teacherId}`);
        }
        const data = await this.http.put(`/plugins/teach-internal/api/courses/${payload.id}`, payload);
        return ZCourse.parse(data);
    }
    async delete(id) {
        await this.http.delete(`/plugins/teach-internal/api/courses/${id}`);
        return { success: true };
    }
}
