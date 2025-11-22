import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { ZUser, ZUserCreate, ZUserUpdate } from '../types/models';
import { ZTeacherProfile } from '../types/models';
/** CRUD for Authentication.User with relation enforcement (teacherProfileId must exist in teach.TeacherProfile) */
export class UserService {
    constructor(http) {
        this.http = http;
    }
    async list() {
        const data = await this.http.get('/plugins/authentication/api/users');
        return z.array(ZUser).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/authentication/api/users/${id}`);
        return ZUser.parse(data);
    }
    async create(input) {
        const payload = ZUserCreate.parse(input);
        // Relation enforcement: teacherProfileId must exist if provided
        if (payload.teacherProfileId) {
            const tp = await this.http.get(`/plugins/teach/api/teachers/${payload.teacherProfileId}`);
            ZTeacherProfile.parse(tp);
        }
        const data = await this.http.post('/plugins/authentication/api/users', payload);
        return ZUser.parse(data);
    }
    async update(input) {
        const payload = ZUserUpdate.parse(input);
        if (!payload.id)
            throw new ValidationError('Missing id in update', payload);
        if (payload.teacherProfileId) {
            const tp = await this.http.get(`/plugins/teach/api/teachers/${payload.teacherProfileId}`);
            ZTeacherProfile.parse(tp);
        }
        const data = await this.http.put(`/plugins/authentication/api/users/${payload.id}`, payload);
        return ZUser.parse(data);
    }
    async delete(id) {
        await this.http.delete(`/plugins/authentication/api/users/${id}`);
        return { success: true };
    }
}
