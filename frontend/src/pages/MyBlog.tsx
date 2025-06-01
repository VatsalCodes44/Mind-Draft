import { useSearchParams } from "react-router-dom"
import { memo } from "react"
import Appbar from "../components/Appbar"
import MyOneBlog from "../components/MyOneBlog"


const MyBlog = memo(() => {
    const [param] = useSearchParams()
    const blogId = param.get("blogId")
    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={false} edit={true} write={false} publish={false}  notifications={false}/>
            <div className="mt-25 min-w-auto sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <MyOneBlog blogId={blogId || ""} />
            </div>
        </div>
    )
})
export default MyBlog;