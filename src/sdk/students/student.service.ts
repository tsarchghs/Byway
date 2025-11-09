
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';
import { ZStudent, ZStudentCreate, ZStudentUpdate, type Student, type StudentCreate, type StudentUpdate } from '../types/models';

/** CRUD for Students.Student + convenience "upsertFromUser" and "enrollStudent" (proxy to EnrollmentService) */
export class StudentService {
  #enroll?: (studentId: string, courseId: string) => Promise<{ enrolled: boolean, studentCourseId?: string }>;
  constructor(private http: HttpClient) {}

  /** Called by BywayClient to wire EnrollmentService proxy */
  _setEnrollProxy(fn: (studentId: string, courseId: string) => Promise<{ enrolled: boolean, studentCourseId?: string }>) {
    this.#enroll = fn;
  }

  async list(): Promise<Student[]> {
    const data = await this.http.get<Student[]>('/plugins/students-internal/api/students');
    return z.array(ZStudent).parse(data);
  }

  async get(id: string): Promise<Student> {
    const data = await this.http.get<Student>(`/plugins/students-internal/api/students/${id}`);
    return ZStudent.parse(data);
  }

  async create(input: StudentCreate): Promise<Student> {
    const payload = ZStudentCreate.parse(input);
    const data = await this.http.post<Student>('/plugins/students-internal/api/students', payload);
    return ZStudent.parse(data);
  }

  async update(input: StudentUpdate): Promise<Student> {
    const payload = ZStudentUpdate.parse(input);
    if (!payload.id) throw new ValidationError('Missing id in update', payload);
    const data = await this.http.put<Student>(`/plugins/students-internal/api/students/${payload.id}`, payload);
    return ZStudent.parse(data);
  }

  async delete(id: string): Promise<{ success: true }> {
    await this.http.delete(`/plugins/students-internal/api/students/${id}`);
    return { success: true };
  }

  /** Ensure a Student exists for a given userId */
  async upsertFromUser(userId: string, displayName?: string): Promise<Student> {
    // Try find by userId
    try {
      const existing = await this.http.get<Student>(`/plugins/students-internal/api/students/by-user/${userId}`);
      return ZStudent.parse(existing);
    } catch (e) {
      // Create if not exists
      const created = await this.http.post<Student>('/plugins/students-internal/api/students', { userId, displayName });
      return ZStudent.parse(created);
    }
  }

  /** Proxy to EnrollmentService.enroll */
  async enrollStudent(studentId: string, courseId: string) {
    if (!this.#enroll) throw new ValidationError('Enrollment service not wired', {});
    return this.#enroll(studentId, courseId);
  }
}
