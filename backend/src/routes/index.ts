import { Hono } from 'hono'
import userRouter from './userRouter';
import blogsRouter from './blogsRouter';

const router = new Hono()


router.route("/blog",blogsRouter)
router.route("/user",userRouter);

export default router;