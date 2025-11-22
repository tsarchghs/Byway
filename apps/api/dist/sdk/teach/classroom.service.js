export class ClassroomService {
    constructor(http) {
        this.http = http;
    }
    async byCourse(courseId) {
        const query = `query($courseId:String!){ classroomsByCourse(courseId:$courseId){ id name startDate endDate } }`;
        const variables = { courseId };
        return this.http.post('/api/teach-internal/graphql', { query, variables })
            .then(r => r.data.classroomsByCourse);
    }
    async create(input) {
        const query = `mutation($courseId:String!, $name:String!, $startDate:String!, $endDate:String!, $institutionId:String){ createClassroom(courseId:$courseId, name:$name, startDate:$startDate, endDate:$endDate, institutionId:$institutionId){ id } }`;
        const variables = input;
        return this.http.post('/api/teach-internal/graphql', { query, variables })
            .then(r => r.data.createClassroom);
    }
}
