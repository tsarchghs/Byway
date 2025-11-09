
import { z } from 'zod';

export const LessonStatus = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);
export type LessonStatus = z.infer<typeof LessonStatus>;

export const SubmissionType = z.enum(['ASSIGNMENT', 'LAB', 'FILE']);
export type SubmissionType = z.infer<typeof SubmissionType>;

export const LabState = z.enum(['PENDING', 'RUNNING', 'STOPPED']);
export type LabState = z.infer<typeof LabState>;

export const OrderStatus = z.enum(['PENDING', 'PAID', 'CANCELLED', 'REFUNDED']);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const PaymentStatus = z.enum(['PENDING', 'SUCCEEDED', 'FAILED']);
export type PaymentStatus = z.infer<typeof PaymentStatus>;
