// Unified Byway SDK client
import { HttpClient, type HttpClientOptions } from './utils/http';

// Services
import { UserService } from './auth/user.service';
import { StudentService } from './students/student.service';
import { EnrollmentService } from './students/enrollment.service';
import { CourseService } from './teach/course.service';
import { LessonService } from './teach/lesson.service';
import { ModuleService } from './teach/module.service';
import { TeacherService } from './teach/teacher.service';
import { CartService } from './ecommerce/cart.service';
import { OrderService } from './ecommerce/order.service';
import { PaymentService } from './ecommerce/payment.service';

export type BywayClientOptions = HttpClientOptions;

export class BywayClient {
  public http: HttpClient;
  public auth: { users: UserService };
  public students: { students: StudentService; enrollments: EnrollmentService };
  public teach: { courses: CourseService; lessons: LessonService; modules: ModuleService; teachers: TeacherService };
  public ecommerce: { cart: CartService; orders: OrderService; payments: PaymentService };

  constructor(opts: BywayClientOptions) {
    this.http = new HttpClient(opts);

    // Instantiate services
    const users = new UserService(this.http);
    const students = new StudentService(this.http);
    const enrollments = new EnrollmentService(this.http);
    const courses = new CourseService(this.http);
    const lessons = new LessonService(this.http);
    const modules = new ModuleService(this.http);
    const teachers = new TeacherService(this.http);
    const cart = new CartService(this.http);
    const orders = new OrderService(this.http);
    const payments = new PaymentService(this.http);

    // Wire cross-service proxy for convenience methods
    students._setEnrollProxy((studentId: string, courseId: string) => enrollments.enroll(studentId, courseId));

    this.auth = { users };
    this.students = { students, enrollments };
    this.teach = { courses, lessons, modules, teachers };
    this.ecommerce = { cart, orders, payments };
  }

  setToken(token: string | undefined) {
    (this.http as any).setToken?.(token);
  }
}

export default BywayClient;
