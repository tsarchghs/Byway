
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';
import { ZLesson, ZLessonCreate, ZLessonUpdate, type Lesson, type LessonCreate, type LessonUpdate } from '../types/models';

/** CRUD for Teach-Internal.Lesson */
export class LessonService {
  constructor(private http: HttpClient) {}

  async list(moduleId?: string): Promise<Lesson[]> {
    const data = await this.http.get<Lesson[]>('/plugins/teach-internal/api/lessons', moduleId ? { params: { moduleId } } as any : undefined);
    return z.array(ZLesson).parse(data);
  }

  async get(id: string): Promise<Lesson> {
    const data = await this.http.get<Lesson>(`/plugins/teach-internal/api/lessons/${id}`);
    return ZLesson.parse(data);
  }

  async create(input: LessonCreate): Promise<Lesson> {
    const payload = ZLessonCreate.parse(input);
    await this.http.get(`/plugins/teach-internal/api/modules/${payload.moduleId}`);
    const data = await this.http.post<Lesson>('/plugins/teach-internal/api/lessons', payload);
    return ZLesson.parse(data);
  }

  async update(input: LessonUpdate): Promise<Lesson> {
    const payload = ZLessonUpdate.parse(input);
    if (!payload.id) throw new ValidationError('Missing id in update', payload);
    if (payload.moduleId) {
      await this.http.get(`/plugins/teach-internal/api/modules/${payload.moduleId}`);
    }
    const data = await this.http.put<Lesson>(`/plugins/teach-internal/api/lessons/${payload.id}`, payload);
    return ZLesson.parse(data);
  }

  async delete(id: string): Promise<{ success: true }> {
    await this.http.delete(`/plugins/teach-internal/api/lessons/${id}`);
    return { success: true };
  }
}
