import { Navigate, useSearchParams } from "react-router-dom"
import { memo, Suspense, useEffect } from "react"
import Appbar from "../components/Appbar"
import BlogLoader from "../components/BlogLoader"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { myBlogAtomFamily } from "../store/blogs/atom"
import { editBlog } from "../store/blogUploadEdit/atom"
import SearchedUserOneBlog from "../components/SearchedOneBlog"


const UserBlog = memo(() => {
    const [param] = useSearchParams();
    const blogId = param.get("blogId");
    const number = param.get("number");
    if (!sessionStorage.getItem("token")){
        return <Navigate to={"/signin"} />
    }
    if (!blogId || !number){
        return <Navigate to={"/signin"} />
    }
    
    const atomNumber = parseInt(number)
    if (!atomNumber){
        return <Navigate to={"/signin"} />
    }
    const myBlogs = useRecoilValue(myBlogAtomFamily(atomNumber))
    const setEditBlog = useSetRecoilState(editBlog)
    useEffect(() => {
        setEditBlog(myBlogs[blogId])
    },[])

    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={false} publish={false} write={false} edit={false} />
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <Suspense fallback={<BlogLoader/>}> <SearchedUserOneBlog blogId={blogId} atomNumber={atomNumber} /> </Suspense>
            </div>
        </div>
    )
})
export default UserBlog;