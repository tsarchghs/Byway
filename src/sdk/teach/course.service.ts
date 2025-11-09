
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';
import { ZCourse, ZCourseCreate, ZCourseUpdate, type Course, type CourseCreate, type CourseUpdate } from '../types/models';

/** CRUD for Teach-Internal.Course */
export class CourseService {
  private async graphqlFallbackGet(courseId: string) {
    // Fallback to GraphQL if REST is not available
    // NOTE: This assumes the plugin exposes /api/teach-internal/graphql with a 'course(id: String!)' query
    try {
      const data = await this.http.post<any>('/plugins/teach-internal/graphql', {
        query: 'query ($id: String!) { course(id: $id) { id title price discount coverUrl } }',
        variables: { id: courseId }
      });
      return (data?.data?.course) || null;
    } catch (e) {
      return null;
    }
  }
  constructor(private http: HttpClient) {}

  async list(): Promise<Course[]> {
    const data = await this.http.get<Course[]>('/plugins/teach-internal/api/courses');
    return z.array(ZCourse).parse(data);
  }

  async get(id: string): Promise<Course> {
    try {
      const data = await this.http.get<Course>(`/plugins/teach-internal/api/courses/${id}`);
      return ZCourse.parse(data);
    } catch (e) {
      const c = await this.graphqlFallbackGet(id);
      if (!c) throw e;
      return ZCourse.parse(c);
    }
  }`);
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
