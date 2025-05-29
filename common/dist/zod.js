"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogUpdateSchema = exports.blogPostSchema = exports.signinBodySchema = exports.signupBodySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupBodySchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    name: zod_1.default.string().optional(),
    password: zod_1.default.string().min(6, "password must be minimum 6 characters")
});
exports.signinBodySchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string()
});
exports.blogPostSchema = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string()
});
exports.blogUpdateSchema = zod_1.default.object({
    id: zod_1.default.string().uuid(),
    title: zod_1.default.string().optional(),
    content: zod_1.default.string().optional(),
    published: zod_1.default.boolean().optional()
});
