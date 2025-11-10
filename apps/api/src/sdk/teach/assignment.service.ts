import { HttpClient } from '../utils/http'

export class AssignmentService {
  constructor(private http: HttpClient) {}

  async byClassroom(classroomId: string) {
    const query = `query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title description dueDate } }`
    const variables = { classroomId }
    return this.http.post<{ data: { assignmentsByClassroom: any[] } }>('/api/teach-internal/graphql', { query, variables })
      .then(r => (r as any).data.assignmentsByClassroom)
  }

  async create(input: { classroomId: string; title: string; description: string; dueDate: string }) {
    const query = `mutation($classroomId:String!, $title:String!, $description:String!, $dueDate:String!){ createAssignment(classroomId:$classroomId, title:$title, description:$description, dueDate:$dueDate){ id } }`
    const variables = input
    return this.http.post<{ data: { createAssignment: any } }>('/api/teach-internal/graphql', { query, variables })
      .then(r => (r as any).data.createAssignment)
  }
}
