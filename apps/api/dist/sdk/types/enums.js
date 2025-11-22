import { z } from 'zod';
export const LessonStatus = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);
export const SubmissionType = z.enum(['ASSIGNMENT', 'LAB', 'FILE']);
export const LabState = z.enum(['PENDING', 'RUNNING', 'STOPPED']);
export const OrderStatus = z.enum(['PENDING', 'PAID', 'CANCELLED', 'REFUNDED']);
export const PaymentStatus = z.enum(['PENDING', 'SUCCEEDED', 'FAILED']);
