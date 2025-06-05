import z from "zod";


export const signupBodySchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(6, "password must be minimum 6 characters")
  })

export const signinBodySchema = z.object({
email: z.string().email(),
password: z.string()
})

export const blogPostSchema = z.object({
    image: z.instanceof(File).optional().nullable(),
    title: z.string().min(1),
    summary: z.string(),
    content: z.string().min(10),
    editorState: z.string(),
    time: z.string(),
    imageExist: z.enum(["true", "false"]),
    published: z.enum(["true", "false"])
})

export const editPostSchema = z.object({
  image: z.instanceof(File).optional(),
  blogId: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  editorState: z.string(),
  imageExist: z.boolean(),
})

export type signupBodySchemaType = z.infer<typeof signupBodySchema>
export type signinBodySchemaType = z.infer<typeof signinBodySchema>
export type blogPostSchemaType = z.infer<typeof blogPostSchema>
export type blogUpdateSchemaType = z.infer<typeof editPostSchema>