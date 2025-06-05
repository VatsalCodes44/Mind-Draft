import { useRecoilValue } from "recoil";
import BlogCard from "../components/BlogCard";
import { getBlogsObjectAtom } from "../store/blogs/atom";
import { memo } from "react";


const BlogsComponent = memo(() => {
    // const blogs = useBlogs();
    const blogsObject = useRecoilValue(getBlogsObjectAtom)
    return (

        <div className="pt-15 mx-auto w-full ">
            {
            Object.keys(blogsObject).map((id) => {
                return (
                    <div key={blogsObject[id].id}>
                        <BlogCard blog={blogsObject[id]} />
                    </div>
                )
            })  
            }
        </div>

    )
            
})
export default BlogsComponent;