import { HttpClient } from './utils/http';
import { StudentService } from './students/student.service';
import { EnrollmentService } from './students/enrollment.service';
import { CourseService } from './teach/course.service';
import { ModuleService } from './teach/module.service';
import { LessonService } from './teach/lesson.service';
import { UserService } from './auth/user.service';
import { CartService } from './ecommerce/cart.service';
import { OrderService } from './ecommerce/order.service';
import { PaymentService } from './ecommerce/payment.service';
import { InstitutionService } from './institutions/institution.service';
import { ClassroomService } from './teach/classroom.service';
import { AssignmentService } from './teach/assignment.service';
export class BywayClient {
    constructor(opts = {}) {
        this.http = new HttpClient({
            baseUrl: opts.baseUrl || 'http://localhost:4000',
            token: opts.token,
        });
        this.students = new StudentService(this.http);
        this.enrollments = new EnrollmentService(this.http);
        this.students._setEnrollProxy((studentId, courseId) => this.enrollments.enroll(studentId, courseId));
        this.courses = new CourseService(this.http);
        this.modules = new ModuleService(this.http);
        this.lessons = new LessonService(this.http);
        this.users = new UserService(this.http);
        this.cart = new CartService(this.http);
        this.orders = new OrderService(this.http);
        this.payments = new PaymentService(this.http);
        this.institutions = new InstitutionService(this.http);
        this.classrooms = new ClassroomService(this.http);
        this.assignments = new AssignmentService(this.http);
    }
    withToken(token) {
        this.http.setToken(token);
        return this;
    }
}
export const sdk = new BywayClient();
