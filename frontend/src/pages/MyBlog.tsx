import { useNavigate, useSearchParams } from "react-router-dom"
import { memo, Suspense, useEffect } from "react"
import Appbar from "../components/Appbar"
import MyOneBlog from "../components/MyOneBlog"
import BlogLoader from "../components/BlogLoader"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { getMyBlogsObjectAtom } from "../store/blogs/atom"
import { editBlog } from "../store/blogUploadEdit/atom"


const MyBlog = memo(() => {
    const [param] = useSearchParams();
    const myBlogId = param.get("myBlogId");
    const number = param.get("number");
    const navigate = useNavigate();
    if (!myBlogId || !number){
        navigate("/me");
        return;
    }
    const myBlogs = useRecoilValue(getMyBlogsObjectAtom)
    const setEditBlog = useSetRecoilState(editBlog)
    useEffect(() => {
        setEditBlog(myBlogs[myBlogId])
    },[])

    const atomNumber = parseInt(number)
    if (!atomNumber){
        navigate("/me");
        return;
    }

    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={false} publish={false} write={false} edit={true} notifications={true}/>
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <Suspense fallback={<BlogLoader/>}> <MyOneBlog myBlogId={myBlogId} atomNumber={atomNumber} /> </Suspense>
            </div>
        </div>
    )
})
export default MyBlog;