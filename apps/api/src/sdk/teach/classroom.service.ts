import { HttpClient } from '../utils/http'

export class ClassroomService {
  constructor(private http: HttpClient) {}

  async byCourse(courseId: string) {
    const query = `query($courseId:String!){ classroomsByCourse(courseId:$courseId){ id name startDate endDate } }`
    const variables = { courseId }
    return this.http.post<{ data: { classroomsByCourse: any[] } }>('/api/teach-internal/graphql', { query, variables })
      .then(r => (r as any).data.classroomsByCourse)
  }

  async create(input: { courseId: string; name: string; startDate: string; endDate: string; institutionId?: string }) {
    const query = `mutation($courseId:String!, $name:String!, $startDate:String!, $endDate:String!, $institutionId:String){ createClassroom(courseId:$courseId, name:$name, startDate:$startDate, endDate:$endDate, institutionId:$institutionId){ id } }`
    const variables = input
    return this.http.post<{ data: { createClassroom: any } }>('/api/teach-internal/graphql', { query, variables })
      .then(r => (r as any).data.createClassroom)
  }
}
