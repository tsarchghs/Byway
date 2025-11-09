
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ApiError, ValidationError } from '../utils/errors';
import { ZUser, ZUserCreate, ZUserUpdate, type User, type UserCreate, type UserUpdate } from '../types/models';
import { ZTeacherProfile } from '../types/models';

/** CRUD for Authentication.User with relation enforcement (teacherProfileId must exist in teach.TeacherProfile) */
export class UserService {
  constructor(private http: HttpClient) {}

  async list(): Promise<User[]> {
    const data = await this.http.get<User[]>('/plugins/authentication/api/users');
    return z.array(ZUser).parse(data);
  }

  async get(id: string): Promise<User> {
    const data = await this.http.get<User>(`/plugins/authentication/api/users/${id}`);
    return ZUser.parse(data);
  }

  async create(input: UserCreate): Promise<User> {
    const payload = ZUserCreate.parse(input);
    // Relation enforcement: teacherProfileId must exist if provided
    if (payload.teacherProfileId) {
      const tp = await this.http.get(`/plugins/teach/api/teachers/${payload.teacherProfileId}`);
      ZTeacherProfile.parse(tp);
    }
    const data = await this.http.post<User>('/plugins/authentication/api/users', payload);
    return ZUser.parse(data);
  }

  async update(input: UserUpdate): Promise<User> {
    const payload = ZUserUpdate.parse(input);
    if (!payload.id) throw new ValidationError('Missing id in update', payload);
    if (payload.teacherProfileId) {
      const tp = await this.http.get(`/plugins/teach/api/teachers/${payload.teacherProfileId}`);
      ZTeacherProfile.parse(tp);
    }
    const data = await this.http.put<User>(`/plugins/authentication/api/users/${payload.id}`, payload);
    return ZUser.parse(data);
  }

  async delete(id: string): Promise<{ success: true }> {
    await this.http.delete(`/plugins/authentication/api/users/${id}`);
    return { success: true };
  }
}
