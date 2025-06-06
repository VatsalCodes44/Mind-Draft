import { Hono } from 'hono'
import { jwtVerification } from '../middlewares/middlewares'
import { addComment, bulkBlogs, client, createBlog, deleteBlog, editBlog, firstBulkBlogs, getBlog, getFirstComments, getNextComments, likesUpdate, myBulkBlogs, myFirstBulk } from '../db/prismaFunctions'
import { blogPostSchema } from "common-medium-project";
import { z } from 'zod';
import { PrismaClient } from '@prisma/client/extension';

const blogsRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    secretKey: string,
    MY_BUCKET: R2Bucket
  }, Variables: {
    userId: string; 
  }   
}>()

// jwt is send as header for all the blog routes 
blogsRouter.use("/*", jwtVerification)
interface createBlogFunction {
    title: string;
    summary: string;
    content: string;
    editorState: string;
    imageExist: boolean;
    published: boolean;
    date: string;
    authorId: string;
}

blogsRouter.post("/upload", async (c) => {
  
  const prisma = await client(c.env.DATABASE_URL)
  const formData: FormData = await c.req.formData()
  const file = formData.get("image")
  const title = formData.get("title")
  const summary = formData.get("summary")
  const content = formData.get("content")
  const editorState = formData.get("editorState")
  const time = formData.get("time")
  const imageExist = z.enum(["true", "false"]).transform((val) => val === "true").parse(formData.get("imageExist"))
  const published = z.enum(["true", "false"]).transform((val) => val === "true").parse(formData.get("published"))
  const parseFormData = blogPostSchema.safeParse({
    image:file,
    title,
    summary,
    content,
    editorState,
    time,
    imageExist,
    published
  })
  if (!parseFormData.success) {
    return c.json({
      message: parseFormData.error.issues[0].message
    }, 403)
  }

  if (typeof title !== "string" || typeof summary !== "string" || typeof content !== "string" || typeof editorState !== "string" || typeof time !== "string") {
    return c.json({
      message: "invalid data"
    }, 403)
  }
  if (file && !(file instanceof File)) {
    return c.json({
      message: "invalid data"
    }, 403)
  }
  
  const data: createBlogFunction = {
    title,
    summary,
    content,
    editorState,
    date:time,
    imageExist,
    published,
    authorId: c.get("userId"),
  }

  const response = await createBlog(prisma, data)
  if (!response) {
    let created: boolean = false;
    let attempts = 0;
    const maxAttempts = 3

    while (!created && attempts < maxAttempts ) {
      const response2 = await createBlog(prisma, data)
      await new Promise(res => setTimeout(res, 300))
      if (response2) {
        created = true
      }
      attempts++;
    }
    return c.json({
      message: "post cannot be created"
    },403)
  }

  if (!imageExist){
    return c.json({
      message: response.id
    })
  }

  if (imageExist){
      const fileName: string = response.id;
      try{
        const r2Object = await c.env.MY_BUCKET.put(fileName, file)
        if (r2Object){
          return c.json({
            message: response.id
          })
        } else {

          let imageUploaded: boolean = false;
          let attempts = 0;
          const maxAttempts = 3
      
          while (!imageUploaded && attempts < maxAttempts ) {
            const response2 = await c.env.MY_BUCKET.put(fileName, file);
            await new Promise(res => setTimeout(res, 300))
            if (response2) {
              imageUploaded = true;
              return c.json({
                  message: response.id
              },200)
            }
            attempts++;
          }

          attempts=0;
          let postDeleted = false;
          while (!postDeleted && attempts < maxAttempts ) {
            const response2 = await deleteBlog(prisma, fileName)
            await new Promise(res => setTimeout(res, 300))
            if (response2) {
              postDeleted = true
            }
            attempts++;
          }

          return c.json({
          message: "post cannot be created 1"
        },403) 
        }
      } catch (err) {
        let deleted: boolean = false;
        let attempts = 0;
        const maxAttempts = 3
    
        while (!deleted && attempts < maxAttempts ) {
          const response2 = await deleteBlog(prisma, fileName)
          await new Promise(res => setTimeout(res, 300))
          if (response2) {
            deleted = true
          }
          attempts++;
        }
    
        return c.json({
          message: "post cannot be created"
        },403)
      }
  }
  return c.json({
    message: response.id
  })

})



const editPostSchema = z.object({
  image: z.instanceof(File).optional().nullable(),
  blogId: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  editorState: z.string(),
  published: z.boolean(),
})

interface editPost {
    title: string,
    summary: string,
    content: string,
    editorState: string,
    imageExist?: boolean,
    published: boolean,
}
blogsRouter.put("/edit", async (c) => {
  
  console.log("...........................")
  const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
  const formData: FormData = await c.req.formData()
  const file = formData.get("image")
  const blogId = formData.get("blogId")
  const title = formData.get("title")
  const summary = formData.get("summary")
  const content = formData.get("content")
  const editorState = formData.get("editorState")
  const published = z.enum(["true", "false"]).transform((val) => val === "true").parse(formData.get("published"))
  const parseFormData = editPostSchema.safeParse({
    image:file,
    blogId,
    title,
    summary,
    content,
    editorState,
    published
  })
  if (!parseFormData.success) {
    return c.json({
      message: parseFormData.error.issues[0].message
    }, 403)
  }

  if (typeof blogId !== "string" || typeof title !== "string" || typeof summary !== "string" || typeof content !== "string" || typeof editorState !== "string" ) {
    return c.json({
      message: "invalid data"
    }, 403)
  }

  if (file && !(file instanceof File)) {
    return c.json({
      message: "invalid data"
    }, 403)
  }
  

  const data: editPost = {
    title,
    summary,
    content,
    editorState,
    imageExist: file ? true : undefined,
    published
  }
  const response = await editBlog(prisma,c.get("userId"), blogId, data)
  if (!response) {
    let created: boolean = false;
    let attempts = 0;
    const maxAttempts = 3

    while (!created && attempts < maxAttempts ) {
      const response2 = await editBlog(prisma,c.get("userId"), blogId, data)
      await new Promise(res => setTimeout(res, 300))
      if (response2) {
        created = true
      }
      attempts++;
    }

    return c.json({
      message: "post cannot be updated"
    },403)
  }

  if (file){
      const fileName: string = blogId;
      try{
        const r2Object = await c.env.MY_BUCKET.put(fileName, file)
        if (r2Object){
          console.log("''''''''''''''''''''''''''''''''")
          return c.json({
            message: response.id
          })
        } else {

          let imageUploaded: boolean = false;
          let attempts = 0;
          const maxAttempts = 3
      
          while (!imageUploaded && attempts < maxAttempts ) {
            const response2 = await c.env.MY_BUCKET.put(fileName, file);
            await new Promise(res => setTimeout(res, 300))
            if (response2) {
              imageUploaded = true;
              return c.json({
                  message: response.id
              },200)
            }
            attempts++;
          }

          return c.json({
          message: "image not updated"
        },403) 
        }
      } catch (err) {
        return c.json({
          message: "image cannot be updated"
        },403)
      }
  }
  return c.json({
  message: "blog updated successfully"
}, 200)
})



blogsRouter.get('/get/:blogId', async (c) => {
  try{
  const prisma = await client(c.env.DATABASE_URL)
  const blogId = c.req.param('blogId')
  const response = await getBlog(prisma, blogId)
  if (response) {
    return c.json(
      response,
    )
  } else {
    return c.json({
      message: "blog do not exist"
    },403)
  }
  } catch (err) {
    return c.json({
      message: "blog do not exist"
    },403)
  }
})



// Helper to convert ReadableStream to ArrayBuffer
async function streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const combined = new Uint8Array(totalLength);

  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return combined.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary); // btoa() is the browser function for Base64 encoding
}

// return a no. of images with array of blogIds.
blogsRouter.post("/images", async (c) => {
  try {
    const body: { blogIds: string[] } = await c.req.json();
    const blogIds = body.blogIds;
    if (!blogIds || !Array.isArray(blogIds)) {
      return c.json({ message: "invalid parameters" }, 400);
    }

    const promises: Promise<R2ObjectBody | null>[] = blogIds.map((id) => c.env.MY_BUCKET.get(id));
    const r2Objects = await Promise.all(promises);

    const imagesBase64: ({
      id: string,
      image: string
    } | null) [] = await Promise.all(
      r2Objects.map(async (obj) => {
        if (!obj || !obj.body) return null;

        const arrayBuffer = await streamToArrayBuffer(obj.body);
        const base64 = arrayBufferToBase64(arrayBuffer);
        const contentType = obj.httpMetadata?.contentType || "image/jpeg";

        return {
          id: obj.key,
          image: `data:${contentType};base64,${base64}`
        };
      })
    );

    // Filter out nulls
    const filteredImages: { id: string, image: string }[] = imagesBase64.filter((x): x is { id: string, image: string } => {
      if (x !== null && x !== undefined){
        return true
      } else {
        return false
      }
    });

    interface ImageType {
      id: string,
      image: string
    }
    interface ImagesObjType {
        [id: string]: {
          id: string,
          image: string
        }
    }
    const ImagesObj: ImagesObjType = {};
    for (let i = 0; i < filteredImages.length; i++) {
      ImagesObj[filteredImages[i]?.id] = filteredImages[i]
    }

    return c.json(ImagesObj);

  } catch (err) {
    return c.json({ message: "internal error" }, 500);
  }
});



interface blog {
    id: string;
    title: string;
    summary: string;
    content: string;
    editorState: string;
    authorId: string;
    imageExist: boolean;
    date: Date;
    likes: number;
    author: {
        name: string;
    };
    numberOfComments: number;
}
interface blogsObject {
  [id: string]: blog;
}

blogsRouter.get("/firstBulk", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
    const response: blog[] | null = await firstBulkBlogs(prisma, c.get("userId"))


    if (response) {
      const blogsObject : blogsObject = {};
      response.forEach((blog: blog) => {
        blogsObject[blog.id] = blog
      })
      return c.json(blogsObject)
    } else {
      return c.json({
        message: "some error occured"
      }, 403)
    }
  } catch (err) {
    return c.json({
      message: "some error occured"
    }, 403)
  }
})
blogsRouter.get("/bulk", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
    const cursor = c.req.query("cursor")
    if (cursor){
      const response: blog[] | null = await bulkBlogs(prisma, c.get("userId"), cursor)
      if (response) {
        const blogsObject : blogsObject = {};
        response.forEach((blog: blog) => {
          blogsObject[blog.id] = blog
        })
        return c.json(blogsObject)
      } else {
        return c.json({
          message: "some error occured"
        }, 403)
      }
    } else {
        return c.json({
          message: "cursor not found"
        }, 403)
    }
  } catch (err) {
    return c.json({
      message: "some error occured"
    }, 403)
  }
})


blogsRouter.get("/myFirstBulk", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
    const response: blog[] | null = await myFirstBulk(prisma, c.get("userId"))

    if (response) {
      const blogsObject : blogsObject = {};
      response.forEach((blog: blog) => {
        blogsObject[blog.id] = blog
      })
      return c.json(blogsObject)
    } else {
      return c.json({
        message: "some error occured"
      }, 403)
    }
  } catch (err) {
    return c.json({
      message: "some error occured"
    }, 403)
  }
})


blogsRouter.get("/myBulk", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
    const cursor = c.req.query("cursor")
    if (cursor){
      const response: blog[] | null = await myBulkBlogs(prisma, c.get("userId"), cursor)
        if (response) {
        const blogsObject : blogsObject = {};
        response.forEach((blog: blog) => {
          blogsObject[blog.id] = blog
        })
        return c.json(blogsObject)
      } else {
        return c.json({
          message: "some error occured"
        }, 403)
      }
    } else {
      return c.json({
        message: "cursor not found"
      })
    }
    
  } catch (err) {
    return c.json({
      message: "some error occured"
    }, 403)
  }
})

blogsRouter.post("/likesUpdate", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL)  as unknown as PrismaClient
    const body = await c.req.json()
    if (body.likes && body.blogId) {
      const res = await likesUpdate(prisma, body.blogId, body.likes)
      if (res) {
        return c.json({
          message: 'claps updated'
        })
      } else {
       return c.json({
          message: 'claps not updated'
        }) 
      }
    } else {
      return c.json({
        message: 'claps not updated'
      }) 
    }
  } catch (err) {
    return c.json({
      message: 'claps not updated'
    }) 
  }
})



blogsRouter.post("/addComment", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
    const body = await c.req.json()
    if (body.blogId && body.authorId && body.comment && body.date) {
      const res = await addComment(prisma, body.blogId, body.authorId, body.comment, body.date)
      if (res) {
        return c.json({
          message: 'comment added'
        })
      } else {
       return c.json({
          message: 'comment not added'
        }) 
      }
    } else {
      return c.json({
        message: 'comment not added'
      }) 
    }
  } catch (err) {
    return c.json({
      message: 'comment not added'
    }) 
  }
})


blogsRouter.get("/getFirstComments", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
    const blogId = c.req.header("blogId")
    if (!blogId) {
      return c.json({
        message: "invalid parameters"
      }) 
    } 
    const res = await getFirstComments(prisma, blogId)
      if (res) {
        return c.json(res)
      } else {
       return c.json({
          message: "invalid parameters"
        }) 
      }
  } catch (err) {
    return c.json({
      message: "invalid parameters"
    }) 
  }
})

blogsRouter.get("/getNextComments", async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
    const blogId = c.req.header("blogId")
    const cursor = c.req.query("cursor")
    if (!blogId || !cursor) {
      return c.json({
        message: "invalid parameters"
      }) 
    } 
    const cursorInteger = parseInt(cursor)
    if (!cursorInteger) {
      return c.json({
        message: "invalid parameters"
      }) 
    }
    const res = await getNextComments(prisma, blogId, cursorInteger)
      if (res) {
        return c.json(res)
      } else {
       return c.json({
          message: "invalid parameters"
        }) 
      }
  } catch (err) {
    return c.json({
      message: "invalid parameters"
    }) 
  }
})




export default blogsRouter;