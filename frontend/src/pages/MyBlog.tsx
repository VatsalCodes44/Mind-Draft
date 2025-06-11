import { Navigate, useSearchParams } from "react-router-dom"
import { memo, Suspense, useEffect } from "react"
import Appbar from "../components/Appbar"
import MyOneBlog from "../components/MyOneBlog"
import BlogLoader from "../components/BlogLoader"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { myBlogAtomFamily } from "../store/blogs/atom"
import { editBlog } from "../store/blogUploadEdit/atom"


const MyBlog = memo(() => {
    const [param] = useSearchParams();
    const myBlogId = param.get("myBlogId");
    const number = param.get("number");
    if (!sessionStorage.getItem("token")){
        return <Navigate to={"/signin"} />
    }
    if (!myBlogId || !number){
        return <Navigate to={"/signin"} />
    }
    
    const atomNumber = parseInt(number)
    if (!atomNumber){
        return <Navigate to={"/signin"} />
    }
    const myBlogs = useRecoilValue(myBlogAtomFamily(atomNumber))
    const setEditBlog = useSetRecoilState(editBlog)
    useEffect(() => {
        setEditBlog(myBlogs[myBlogId])
    },[])

    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={false} publish={false} write={false} edit={true} />
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <Suspense fallback={<BlogLoader/>}> <MyOneBlog myBlogId={myBlogId} atomNumber={atomNumber} /> </Suspense>
            </div>
        </div>
    )
})
export default MyBlog;