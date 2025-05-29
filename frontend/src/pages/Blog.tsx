import { useSearchParams } from "react-router-dom"
import OneBlog from "../components/OneBlog"
import { memo } from "react"
import Appbar from "../components/Appbar"


const Blog = memo(() => {
    const [param] = useSearchParams()
    const blogId = param.get("blogId")
    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar />
            <div className="mt-25 min-w-auto sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <OneBlog blogId={blogId || ""} />
            </div>
        </div>
    )
})
export default Blog;