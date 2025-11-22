import { z } from 'zod';
import { LessonStatus, OrderStatus, PaymentStatus } from './enums';
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
export const ZUserCreate = ZUser.pick({
    email: true, password: true, firstName: true, lastName: true, teacherProfileId: true, studentId: true
}).partial({ firstName: true, lastName: true, teacherProfileId: true, studentId: true });
export const ZUserUpdate = ZUser.partial().extend({ id: z.string() });
/** Students-internal */
export const ZStudent = z.object({
    id: z.string(),
    userId: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export const ZStudentCreate = z.object({
    userId: z.string().optional(),
    displayName: z.string().optional(),
});
export const ZStudentUpdate = z.object({
    id: z.string(),
    userId: z.string().optional(),
    displayName: z.string().optional(),
});
export const ZStudentCourse = z.object({
    id: z.string(),
    studentId: z.string(),
    courseId: z.string(),
    completed: z.boolean().optional(),
    progress: z.number().int().nullable().optional(),
    enrolledAt: z.string().optional(),
});
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
export const ZTeacherCreate = z.object({
    bio: z.string().min(1),
    subjects: z.string().min(1),
    avatarUrl: z.string().optional(),
    verified: z.boolean().optional(),
    payoutEmail: z.string().email().optional(),
    userId: z.string().optional(),
});
export const ZTeacherUpdate = z.object({
    id: z.string(),
    bio: z.string().optional(),
    subjects: z.string().optional(),
    avatarUrl: z.string().optional(),
    verified: z.boolean().optional(),
    payoutEmail: z.string().email().optional(),
    userId: z.string().optional(),
});
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
export const ZModule = z.object({
    id: z.string(),
    courseId: z.string(),
    title: z.string(),
});
export const ZModuleCreate = z.object({
    courseId: z.string(),
    title: z.string().min(1),
});
export const ZModuleUpdate = z.object({
    id: z.string(),
    courseId: z.string().optional(),
    title: z.string().optional(),
});
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
/** Ecommerce */
export const ZStudentMirror = z.object({
    id: z.string(),
    userId: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export const ZOrderItem = z.object({
    id: z.string(),
    orderId: z.string(),
    courseId: z.string(),
    titleSnapshot: z.string(),
    priceSnapshot: z.number(),
    quantity: z.number().int().min(1),
});
export const ZPayment = z.object({
    id: z.string(),
    orderId: z.string(),
    provider: z.string().nullable().optional(),
    status: PaymentStatus.default('PENDING'),
    amount: z.number(),
    payload: z.any().optional(),
    createdAt: z.string().optional(),
});
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
export const ZOrderUpdate = z.object({
    id: z.string(),
    email: z.string().email().optional(),
    currency: z.string().optional(),
    status: OrderStatus.optional(),
    items: z.array(ZOrderItem).optional(),
});
