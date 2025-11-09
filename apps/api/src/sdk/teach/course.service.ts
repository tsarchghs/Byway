
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';
import { ZCourse, ZCourseCreate, ZCourseUpdate, type Course, type CourseCreate, type CourseUpdate } from '../types/models';

/** CRUD for Teach-Internal.Course */
export class CourseService {
  constructor(private http: HttpClient) {}

  async list(): Promise<Course[]> {
    const data = await this.http.get<Course[]>('/plugins/teach-internal/api/courses');
    return z.array(ZCourse).parse(data);
  }

  async get(id: string): Promise<Course> {
    const data = await this.http.get<Course>(`/plugins/teach-internal/api/courses/${id}`);
    return ZCourse.parse(data);
  }

  async create(input: CourseCreate): Promise<Course> {
    const payload = ZCourseCreate.parse(input);
    // Ensure teacherId corresponds to an existing user (soft link) – optional existence check if endpoint exists
    await this.http.get(`/plugins/authentication/api/users/${payload.teacherId}`);
    const data = await this.http.post<Course>('/plugins/teach-internal/api/courses', payload);
    return ZCourse.parse(data);
  }

  async update(input: CourseUpdate): Promise<Course> {
    const payload = ZCourseUpdate.parse(input);
    if (!payload.id) throw new ValidationError('Missing id in update', payload);
    if (payload.teacherId) {
      await this.http.get(`/plugins/authentication/api/users/${payload.teacherId}`);
    }
    const data = await this.http.put<Course>(`/plugins/teach-internal/api/courses/${payload.id}`, payload);
    return ZCourse.parse(data);
  }

  async delete(id: string): Promise<{ success: true }> {
    await this.http.delete(`/plugins/teach-internal/api/courses/${id}`);
    return { success: true };
  }
}
