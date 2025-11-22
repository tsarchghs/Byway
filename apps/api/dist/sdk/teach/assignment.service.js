export class AssignmentService {
    constructor(http) {
        this.http = http;
    }
    async byClassroom(classroomId) {
        const query = `query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title description dueDate } }`;
        const variables = { classroomId };
        return this.http.post('/api/teach-internal/graphql', { query, variables })
            .then(r => r.data.assignmentsByClassroom);
    }
    async create(input) {
        const query = `mutation($classroomId:String!, $title:String!, $description:String!, $dueDate:String!){ createAssignment(classroomId:$classroomId, title:$title, description:$description, dueDate:$dueDate){ id } }`;
        const variables = input;
        return this.http.post('/api/teach-internal/graphql', { query, variables })
            .then(r => r.data.createAssignment);
    }
}
