
import { z } from 'zod';
import { HttpClient } from '../utils/http';
import { ValidationError } from '../utils/errors';

/** Handles StudentCourse creation with duplicate prevention and cross-plugin checks */
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  /** Enroll a student to a course if not already enrolled */
  async enroll(studentId: string, courseId: string): Promise<{ enrolled: boolean; studentCourseId?: string }> {
    if (!studentId || !courseId) {
      throw new ValidationError('studentId and courseId are required', { studentId, courseId });
    }
    // Ensure student exists
    await this.http.get(`/plugins/students-internal/api/students/${studentId}`);
    // Ensure course exists (teach-internal)
    await this.http.get(`/plugins/teach-internal/api/courses/${courseId}`);

    // Check if enrollment exists
    const existing: any[] = await this.http.get(`/plugins/students-internal/api/student-courses`, {
      params: { studentId, courseId }
    } as any);
    if (Array.isArray(existing) && existing.length > 0) {
      return { enrolled: false, studentCourseId: existing[0]?.id };
    }

    const created = await this.http.post(`/plugins/students-internal/api/student-courses`, { studentId, courseId });
    return { enrolled: true, studentCourseId: (created as any)?.id };
  }

  async listByStudent(studentId: string) {
    const data = await this.http.get(`/plugins/students-internal/api/student-courses`, { params: { studentId } } as any);
    return data as any[];
  }
}


export async function enrollInClassroom(client: any, input: { studentId: string; courseId: string; classroomId: string }) {
  const query = `mutation($studentId:String!,$courseId:String!,$classroomId:String!){ enrollInClassroom(studentId:$studentId,courseId:$courseId,classroomId:$classroomId) }`
  return client.post('/api/students-internal/graphql', { query, variables: input })
}


export async function hasEnrollment(client: any, input: { studentId: string; courseId: string }) {
  const query = `query($studentId:String!,$courseId:String!){ hasEnrollment(studentId:$studentId, courseId:$courseId) }`
  const r = await client.post('/api/students-internal/graphql', { query, variables: input })
  return (r as any)?.data?.hasEnrollment === true
}


export async function bulkEnrollCsv(client: any, csv: string) {
  const query = `mutation($csv:String!){ bulkEnrollCsv(csv:$csv) }`
  return client.post('/api/students-internal/graphql', { query, variables: { csv } })
}
