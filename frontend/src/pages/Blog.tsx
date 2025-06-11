import { Navigate, useSearchParams } from "react-router-dom"
import OneBlog from "../components/OneBlog"
import { memo, Suspense } from "react"
import Appbar from "../components/Appbar"
import BlogLoader from "../components/BlogLoader"


const Blog = memo(() => {
    const [param] = useSearchParams()
    const blogId = param.get("blogId")
    let number = param.get("number")
    if (!blogId || !number){
        return <Navigate to={"/blogs"} />
    }
    let atomNumber;
    if (number){
        atomNumber = parseInt(number)
    }
    if (!atomNumber){
        return <Navigate to={"/blogs"} />
    }
    if (!sessionStorage.getItem("token")){
        return <Navigate to={"/signin"} />
    }
    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={true} publish={false} write={true} edit={false} />
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <Suspense fallback={<BlogLoader/>}><OneBlog blogId={blogId} atomNumber={atomNumber} /></Suspense>
            </div>
        </div>
    )
})
export default Blog;