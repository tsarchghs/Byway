export class InstitutionService {
    constructor(http) {
        this.http = http;
    }
    async list() {
        const query = `query { institutions { id name domain logoUrl } }`;
        return this.http.post('/api/authentication/graphql', { query })
            .then(r => r.data.institutions);
    }
    async create(input) {
        const query = `mutation($name:String!, $domain:String, $logoUrl:String){ createInstitution(name:$name, domain:$domain, logoUrl:$logoUrl){ id name } }`;
        const variables = input;
        return this.http.post('/api/authentication/graphql', { query, variables })
            .then(r => r.data.createInstitution);
    }
}
export async function roles(client, userId) {
    const query = `query($userId:String!){ institutionRoles(userId:$userId){ id institutionId role } }`;
    return client.post('/api/authentication/graphql', { query, variables: { userId } });
}
export async function hasRole(client, input) {
    const query = `query($userId:String!,$institutionId:String!,$role:String!){ hasRole(userId:$userId,institutionId:$institutionId,role:$role) }`;
    const r = await client.post('/api/authentication/graphql', { query, variables: input });
    return r?.data?.hasRole === true;
}
export async function getInstitutionBySlug(client, slug) {
    const query = `query($slug:String!){ institutionBySlug(slug:$slug){ id name domain primaryColor bannerUrl } }`;
    return client.post('/api/authentication/graphql', { query, variables: { slug } });
}
export async function gradebookCsv(client, classroomId) {
    const query = `query($classroomId:String!){ gradebookCsv(classroomId:$classroomId) }`;
    return client.post('/api/teach-internal/graphql', { query, variables: { classroomId } });
}
export async function updateAssignmentRubric(client, assignmentId, rubric) {
    const query = `mutation($assignmentId:String!,$rubric:String!){
    updateAssignmentRubric(assignmentId:$assignmentId, rubric:$rubric){ id }
  }`;
    return client.post('/api/teach-internal/graphql', {
        query, variables: { assignmentId, rubric: JSON.stringify(rubric) }
    });
}
export async function addSubmissionComment(client, submissionId, text, authorId) {
    const query = `mutation($submissionId:String!,$text:String!,$authorId:String){
    addSubmissionComment(submissionId:$submissionId, text:$text, authorId:$authorId)
  }`;
    return client.post('/api/teach-internal/graphql', { query, variables: { submissionId, text, authorId } });
}
export async function submissionComments(client, submissionId) {
    const query = `query($submissionId:String!){ submissionComments(submissionId:$submissionId) }`;
    return client.post('/api/teach-internal/graphql', { query, variables: { submissionId } });
}
