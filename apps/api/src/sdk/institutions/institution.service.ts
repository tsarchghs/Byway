import { HttpClient } from '../utils/http'

export class InstitutionService {
  constructor(private http: HttpClient) {}

  async list() {
    const query = `query { institutions { id name domain logoUrl } }`
    return this.http.post<{ data: { institutions: any[] } }>('/api/authentication/graphql', { query })
      .then(r => (r as any).data.institutions)
  }

  async create(input: { name: string; domain?: string; logoUrl?: string }) {
    const query = `mutation($name:String!, $domain:String, $logoUrl:String){ createInstitution(name:$name, domain:$domain, logoUrl:$logoUrl){ id name } }`
    const variables = input
    return this.http.post<{ data: { createInstitution: any } }>('/api/authentication/graphql', { query, variables })
      .then(r => (r as any).data.createInstitution)
  }
}


export async function roles(client: any, userId: string) {
  const query = `query($userId:String!){ institutionRoles(userId:$userId){ id institutionId role } }`
  return client.post('/api/authentication/graphql', { query, variables: { userId } })
}

export async function hasRole(client: any, input: { userId: string; institutionId: string; role: string }) {
  const query = `query($userId:String!,$institutionId:String!,$role:String!){ hasRole(userId:$userId,institutionId:$institutionId,role:$role) }`
  const r = await client.post('/api/authentication/graphql', { query, variables: input })
  return (r as any)?.data?.hasRole === true
}


export async function getInstitutionBySlug(client: any, slug: string) {
  const query = `query($slug:String!){ institutionBySlug(slug:$slug){ id name domain primaryColor bannerUrl } }`
  return client.post('/api/authentication/graphql', { query, variables: { slug } })
}

export async function gradebookCsv(client: any, classroomId: string) {
  const query = `query($classroomId:String!){ gradebookCsv(classroomId:$classroomId) }`
  return client.post('/api/teach-internal/graphql', { query, variables: { classroomId } })
}
