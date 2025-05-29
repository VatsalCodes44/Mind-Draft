import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { createUser, findUser, client, userLogin } from '../db/prismaFunctions';
import { signupBodySchema, signinBodySchema } from "common-medium-project";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    secretKey: string
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
  console.log(user)
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

export default userRouter;