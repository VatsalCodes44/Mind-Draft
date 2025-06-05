import { useNavigate, useSearchParams } from "react-router-dom"
import OneBlog from "../components/OneBlog"
import { memo, Suspense, useEffect } from "react"
import Appbar from "../components/Appbar"
import BlogLoader from "../components/BlogLoader"


const Blog = memo(() => {
    const [param] = useSearchParams()
    const navigate = useNavigate()
    const blogId = param.get("blogId")
    if (!blogId){
        navigate("/blogs")
        return null;
    }
    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={true} publish={false} write={true} edit={false} notifications={true}/>
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <Suspense fallback={<BlogLoader/>}><OneBlog blogId={blogId}/></Suspense>
            </div>
        </div>
    )
})
export default Blog;