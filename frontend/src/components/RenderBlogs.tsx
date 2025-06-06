import { memo } from "react";
import { useRecoilValue } from "recoil";
import { blogAtomFamily } from "../store/blogs/atom";
import BlogCard from "./BlogCard";


const RenderBlogs = memo(({atomNumber}:{atomNumber: number}) => {
    const blogsObject = useRecoilValue(blogAtomFamily(atomNumber))
    return (
        <div className=" mx-auto w-full ">
            { blogsObject &&
            Object.keys(blogsObject).map((id) => {
                return (
                    <div key={`${blogsObject[id].id}${id}`}>
                        <BlogCard blog={blogsObject[id]} atomNumber={atomNumber} />
                    </div>
                )
            })  
            }
        </div>
    )
})

export default RenderBlogs;