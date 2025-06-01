import { useRecoilValue } from "recoil";
import BlogCard from "../components/BlogCard";
import { getBlogsObjectAtom } from "../store/blogs/atom";
import Appbar from "../components/Appbar";
import { memo } from "react";


const Blogs = memo(() => {
    // const blogs = useBlogs();
    const blogsObject = useRecoilValue(getBlogsObjectAtom)
    return (
        <div className="">
            <div>
                <Appbar searchBar={true} publish={false} edit={false} write={true} notifications={true} />
            </div>
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
        </div>
    )
            
})
export default Blogs;