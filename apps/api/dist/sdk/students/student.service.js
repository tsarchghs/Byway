var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _StudentService_enroll;
import { z } from 'zod';
import { ValidationError } from '../utils/errors';
import { ZStudent, ZStudentCreate, ZStudentUpdate } from '../types/models';
/** CRUD for Students.Student + convenience "upsertFromUser" and "enrollStudent" (proxy to EnrollmentService) */
export class StudentService {
    constructor(http) {
        this.http = http;
        _StudentService_enroll.set(this, void 0);
    }
    /** Called by BywayClient to wire EnrollmentService proxy */
    _setEnrollProxy(fn) {
        __classPrivateFieldSet(this, _StudentService_enroll, fn, "f");
    }
    async list() {
        const data = await this.http.get('/plugins/students-internal/api/students');
        return z.array(ZStudent).parse(data);
    }
    async get(id) {
        const data = await this.http.get(`/plugins/students-internal/api/students/${id}`);
        return ZStudent.parse(data);
    }
    async create(input) {
        const payload = ZStudentCreate.parse(input);
        const data = await this.http.post('/plugins/students-internal/api/students', payload);
        return ZStudent.parse(data);
    }
    async update(input) {
        const payload = ZStudentUpdate.parse(input);
        if (!payload.id)
            throw new ValidationError('Missing id in update', payload);
        const data = await this.http.put(`/plugins/students-internal/api/students/${payload.id}`, payload);
        return ZStudent.parse(data);
    }
    async delete(id) {
        await this.http.delete(`/plugins/students-internal/api/students/${id}`);
        return { success: true };
    }
    /** Ensure a Student exists for a given userId */
    async upsertFromUser(userId, displayName) {
        // Try find by userId
        try {
            const existing = await this.http.get(`/plugins/students-internal/api/students/by-user/${userId}`);
            return ZStudent.parse(existing);
        }
        catch (e) {
            // Create if not exists
            const created = await this.http.post('/plugins/students-internal/api/students', { userId, displayName });
            return ZStudent.parse(created);
        }
    }
    /** Proxy to EnrollmentService.enroll */
    async enrollStudent(studentId, courseId) {
        if (!__classPrivateFieldGet(this, _StudentService_enroll, "f"))
            throw new ValidationError('Enrollment service not wired', {});
        return __classPrivateFieldGet(this, _StudentService_enroll, "f").call(this, studentId, courseId);
    }
}
_StudentService_enroll = new WeakMap();
