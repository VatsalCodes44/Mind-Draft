import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { createUser, findUser, client, userLogin, editBlog, editUser } from '../db/prismaFunctions';
import { signupBodySchema, signinBodySchema } from "common-medium-project";
import {string, z} from "zod"
import { jwtVerification } from '../middlewares/middlewares';
import { PrismaClient } from '@prisma/client/extension';

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    secretKey: string,
    MY_BUCKET: R2Bucket
  }, Variables: {
    userId: string
  }
}>()


async function hash(text: string) {
  const myText = new TextEncoder().encode(text);

  const myDigest = await crypto.subtle.digest("SHA-256", myText);

  const hashArray = Array.from(new Uint8Array(myDigest)); // Convert buffer to byte array
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0')) // Convert each byte to hex
    .join(''); // Join all hex values into a single string

  return hashHex; // 🔥 Hexadecimal SHA-256 hash
}



interface BodySignup {
  email: string,
  name: string,
  password: string
}


userRouter.post('/signup', async (c) => {
  try {
  const prisma = await client(c.env.DATABASE_URL)

  const body: BodySignup = await c.req.json()
  const parseBody = signupBodySchema.safeParse(body)
  if (!parseBody.success){
    return c.json({
      message: parseBody.error.issues[0].message
    },403)
  }
  const email = body.email;
  const name = body.name;
  const password = body.password;
  const hashPassword = await hash(password)

  const userExist = await findUser(prisma, { email })
  if (userExist){
    return c.json({
      message: "user already exist"
    }, 409)
  } 

  const user = await createUser(prisma, {
    email, 
    password: hashPassword, 
    name
  })
  if (user) {
      const token = await sign({
        email: email, 
        id: user.id
      }, c.env.secretKey)
      return c.json({
        jwt: token,
        user: user
      })
    } else {
      return c.json({
        message: "user cannot be created",
      },409)
    }
  } catch (err) {
    return c.json({
      message: "user cannot be created"
    },409)
  }
  
})





interface BodySignin {
  email: string,
  password: string
}

userRouter.post('/signin', async (c) => {
  try {
    const prisma = await client(c.env.DATABASE_URL)
    const body: BodySignin = await c.req.json();
    const parseBody = signinBodySchema.safeParse(body)
    if (!parseBody.success){
      return c.json({
        message: parseBody.error.issues[0].message
      },403)
    }
    
    const email: string = body.email;
    const password: string = body.password;

    const userExist = await userLogin(prisma,{
      email: email,
      password: await hash(password)
    })
    if (userExist) {
      const token = await sign({
        id: userExist.id,
        email: userExist.email
      }, c.env.secretKey)
      return c.json({
        jwt: token,
        user: userExist
      })
    } else {
      return c.json({
        message: "user do not exist"
      },403)
    }
  } catch (err) {
    return c.json({
      message: "user do not exist"
    },403)
  }
})




const updateUserSchema = z.object({
  image: z.instanceof(File).optional().nullable(),
  name: z.string(),
  aboutMe: z.string()
})
userRouter.use("/*", jwtVerification)
userRouter.put("/updateUser", async (c) => {
  const prisma = await client(c.env.DATABASE_URL) as unknown as PrismaClient
  const formData: FormData = await c.req.formData()
  const file = formData.get("image")
  const name = formData.get("name")
  const aboutMe = formData.get("aboutMe")
  const parseFormData = updateUserSchema.safeParse({
    image:file,
    name,
    aboutMe
  })
  if (!parseFormData.success) {
    return c.json({
      message: parseFormData.error.issues[0].message
    }, 403)
  }

  if (typeof name !== "string" || typeof aboutMe !== "string") {
    return c.json({
      message: "invalid data"
    }, 403)
  }
  if (file && !(file instanceof File)) {
    return c.json({
      message: "invalid data"
    }, 403)
  }
  
  const data = {
    name,
    aboutMe,
    profilePicExist: file ? true : undefined
  }

  let response = await editUser(prisma, c.get("userId"), data)
  if (!response) {
    let created: boolean = false;
    let attempts = 0;
    const maxAttempts = 3

    while (!created && attempts < maxAttempts ) {
      const response2 = await editUser(prisma, c.get("userId"), data)
      await new Promise(res => setTimeout(res, 300))
      if (response2) {
        created = true
      }
      attempts++;
    }
    return c.json({
      message: "user cannot be updated"
    },403)
  }

  if (file){
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

          return c.json({
          message: "user updated"
        },200) 
        }
      } catch (err) {    
        return c.json({
          message: "user updated"
        },403)
      }
  }
  return c.json({
    message: response.id
  })

})


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
userRouter.post("/userImage", async (c) => {
  try {
    const body: { userId: string } = await c.req.json();
    const userId = body.userId;
    const response = await z.string().safeParse(userId)
    if (!response.success) {
    return c.json({
      message: response.error.issues[0].message
    }, 403)
  }
    const r2Object = await c.env.MY_BUCKET.get(userId);
    if (!r2Object || !r2Object.body) return c.json({message: "profile not exist"}, 403)

    const arrayBuffer = await streamToArrayBuffer(r2Object.body);
    const base64 = arrayBufferToBase64(arrayBuffer);
    const contentType = r2Object.httpMetadata?.contentType || "image/jpeg";

    const image = `data:${contentType};base64,${base64}`
    


    return c.json({
      image
    });

  } catch (err) {
    return c.json({ message: "internal error" }, 500);
  }
});

export default userRouter;