
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';
import { ZTeacherProfile, ZTeacherCreate, ZTeacherUpdate, type TeacherProfile, type TeacherCreate, type TeacherUpdate } from '../types/models';

/** CRUD for Teach.TeacherProfile */
export class TeacherService {
  constructor(private http: HttpClient) {}

  async list(): Promise<TeacherProfile[]> {
    const data = await this.http.get<TeacherProfile[]>('/plugins/teach/api/teachers');
    return z.array(ZTeacherProfile).parse(data);
  }

  async get(id: string): Promise<TeacherProfile> {
    const data = await this.http.get<TeacherProfile>(`/plugins/teach/api/teachers/${id}`);
    return ZTeacherProfile.parse(data);
  }

  async create(input: TeacherCreate): Promise<TeacherProfile> {
    const payload = ZTeacherCreate.parse(input);
    const data = await this.http.post<TeacherProfile>('/plugins/teach/api/teachers', payload);
    return ZTeacherProfile.parse(data);
  }

  async update(input: TeacherUpdate): Promise<TeacherProfile> {
    const payload = ZTeacherUpdate.parse(input);
    if (!payload.id) throw new ValidationError('Missing id in update', payload);
    const data = await this.http.put<TeacherProfile>(`/plugins/teach/api/teachers/${payload.id}`, payload);
    return ZTeacherProfile.parse(data);
  }

  async delete(id: string): Promise<{ success: true }> {
    await this.http.delete(`/plugins/teach/api/teachers/${id}`);
    return { success: true };
  }
}
