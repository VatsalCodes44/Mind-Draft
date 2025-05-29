import { Context, Next } from 'hono'
import { decode, verify } from 'hono/jwt'


export const jwtVerification = async (c: Context, next: Next) => {
    
    try{
      const token = c.req.header("Authorization")
      if (token) {
        const jwtToken: string = token.slice(7)
        const res = await verify(jwtToken, c.env.secretKey) // returns error if not verified
        const response = await decode(jwtToken)
        if (response) {
          c.set("userId", response.payload.id)
          await next();
        } else {
          return c.json({
            message: "you are not logged in"
          },403)
        }
      } else {
        return c.json({
          message: "you are not logged in"
        },403)
      }
    } catch (err) { 
      return c.json({
        message: "invalid token"
      },403)
    }
}