
import { z } from 'zod';
import { LessonStatus, SubmissionType, LabState, OrderStatus, PaymentStatus } from './enums';

/** Authentication.User */
export const ZUser = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().min(1),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  teacherProfileId: z.string().nullable().optional(),
  studentId: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type User = z.infer<typeof ZUser>;

export const ZUserCreate = ZUser.pick({
  email: true, password: true, firstName: true, lastName: true, teacherProfileId: true, studentId: true
}).partial({ firstName: true, lastName: true, teacherProfileId: true, studentId: true });
export type UserCreate = z.infer<typeof ZUserCreate>;

export const ZUserUpdate = ZUser.partial().extend({ id: z.string() });
export type UserUpdate = z.infer<typeof ZUserUpdate>;

/** Students-internal */
export const ZStudent = z.object({
  id: z.string(),
  userId: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Student = z.infer<typeof ZStudent>;

export const ZStudentCreate = z.object({
  userId: z.string().optional(),
  displayName: z.string().optional(),
});
export type StudentCreate = z.infer<typeof ZStudentCreate>;

export const ZStudentUpdate = z.object({
  id: z.string(),
  userId: z.string().optional(),
  displayName: z.string().optional(),
});
export type StudentUpdate = z.infer<typeof ZStudentUpdate>;

export const ZStudentCourse = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  completed: z.boolean().optional(),
  progress: z.number().int().nullable().optional(),
  enrolledAt: z.string().optional(),
});
export type StudentCourse = z.infer<typeof ZStudentCourse>;

export const ZLessonProgress = z.object({
  id: z.string(),
  studentId: z.string(),
  lessonId: z.string(),
  status: LessonStatus,
  score: z.number().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
});
export type LessonProgress = z.infer<typeof ZLessonProgress>;

/** Teach */
export const ZTeacherProfile = z.object({
  id: z.string(),
  bio: z.string(),
  subjects: z.string(),
  avatarUrl: z.string().nullable().optional(),
  verified: z.boolean().optional(),
  payoutEmail: z.string().email().nullable().optional(),
  createdAt: z.string().optional(),
  userId: z.string().nullable().optional(),
});
export type TeacherProfile = z.infer<typeof ZTeacherProfile>;

export const ZTeacherCreate = z.object({
  bio: z.string().min(1),
  subjects: z.string().min(1),
  avatarUrl: z.string().optional(),
  verified: z.boolean().optional(),
  payoutEmail: z.string().email().optional(),
  userId: z.string().optional(),
});
export type TeacherCreate = z.infer<typeof ZTeacherCreate>;

export const ZTeacherUpdate = z.object({
  id: z.string(),
  bio: z.string().optional(),
  subjects: z.string().optional(),
  avatarUrl: z.string().optional(),
  verified: z.boolean().optional(),
  payoutEmail: z.string().email().optional(),
  userId: z.string().optional(),
});
export type TeacherUpdate = z.infer<typeof ZTeacherUpdate>;

export const ZCourse = z.object({
  id: z.string(),
  teacherId: z.string(),
  title: z.string(),
  category: z.string().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().optional(),
  discount: z.number().optional(),
  coverUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Course = z.infer<typeof ZCourse>;

export const ZCourseCreate = z.object({
  teacherId: z.string(),
  title: z.string().min(1),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  coverUrl: z.string().optional(),
});
export type CourseCreate = z.infer<typeof ZCourseCreate>;

export const ZCourseUpdate = z.object({
  id: z.string(),
  teacherId: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  discount: z.number().optional(),
  coverUrl: z.string().optional(),
});
export type CourseUpdate = z.infer<typeof ZCourseUpdate>;

export const ZModule = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
});
export type Module = z.infer<typeof ZModule>;

export const ZModuleCreate = z.object({
  courseId: z.string(),
  title: z.string().min(1),
});
export type ModuleCreate = z.infer<typeof ZModuleCreate>;

export const ZModuleUpdate = z.object({
  id: z.string(),
  courseId: z.string().optional(),
  title: z.string().optional(),
});
export type ModuleUpdate = z.infer<typeof ZModuleUpdate>;

export const ZLesson = z.object({
  id: z.string(),
  moduleId: z.string(),
  title: z.string(),
  type: z.string(),
  duration: z.number().int().nullable().optional(),
  content: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  rubric: z.string().nullable().optional(),
  preview: z.boolean().optional(),
  metadata: z.any().optional(),
  createdAt: z.string().optional(),
});
export type Lesson = z.infer<typeof ZLesson>;

export const ZLessonCreate = z.object({
  moduleId: z.string(),
  title: z.string().min(1),
  type: z.string().min(1),
  duration: z.number().int().optional(),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  rubric: z.string().optional(),
  preview: z.boolean().optional(),
  metadata: z.any().optional(),
});
export type LessonCreate = z.infer<typeof ZLessonCreate>;

export const ZLessonUpdate = z.object({
  id: z.string(),
  moduleId: z.string().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  duration: z.number().int().optional(),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  rubric: z.string().optional(),
  preview: z.boolean().optional(),
  metadata: z.any().optional(),
});
export type LessonUpdate = z.infer<typeof ZLessonUpdate>;

/** Ecommerce */
export const ZStudentMirror = z.object({
  id: z.string(),
  userId: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type StudentMirror = z.infer<typeof ZStudentMirror>;

export const ZOrderItem = z.object({
  id: z.string(),
  orderId: z.string(),
  courseId: z.string(),
  titleSnapshot: z.string(),
  priceSnapshot: z.number(),
  quantity: z.number().int().min(1),
});
export type OrderItem = z.infer<typeof ZOrderItem>;

export const ZPayment = z.object({
  id: z.string(),
  orderId: z.string(),
  provider: z.string().nullable().optional(),
  status: PaymentStatus.default('PENDING'),
  amount: z.number(),
  payload: z.any().optional(),
  createdAt: z.string().optional(),
});
export type Payment = z.infer<typeof ZPayment>;

export const ZOrder = z.object({
  id: z.string(),
  studentId: z.string(),
  email: z.string().nullable().optional(),
  currency: z.string().default('EUR'),
  subtotal: z.number().default(0),
  discount: z.number().default(0),
  total: z.number().default(0),
  status: OrderStatus.default('PENDING'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  items: z.array(ZOrderItem).default([]),
  payments: z.array(ZPayment).default([]),
});
export type Order = z.infer<typeof ZOrder>;

export const ZOrderCreate = z.object({
  studentId: z.string(),
  email: z.string().email().optional(),
  currency: z.string().optional(),
  items: z.array(z.object({
    courseId: z.string(),
    titleSnapshot: z.string(),
    priceSnapshot: z.number().nonnegative(),
    quantity: z.number().int().min(1).default(1),
  })).default([]),
});
export type OrderCreate = z.infer<typeof ZOrderCreate>;

export const ZOrderUpdate = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  currency: z.string().optional(),
  status: OrderStatus.optional(),
  items: z.array(ZOrderItem).optional(),
});
export type OrderUpdate = z.infer<typeof ZOrderUpdate>;
