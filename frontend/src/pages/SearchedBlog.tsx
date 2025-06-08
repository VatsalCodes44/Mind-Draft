import { useNavigate, useSearchParams } from "react-router-dom"
import { memo, Suspense } from "react"
import Appbar from "../components/Appbar"
import BlogLoader from "../components/BlogLoader"
import SearchedUserOneBlog from "../components/SearchedOneBlog"


const SearchedBlog = memo(() => {
    const [param] = useSearchParams();
    const blogId = param.get("blogId");
    const number = param.get("number");
    const navigate = useNavigate();
    if (!blogId || !number){
        navigate("/me");
        return;
    }
    const atomNumber = parseInt(number)
    if (!atomNumber){
        navigate("/me");
        return;
    }

    return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={false} publish={false} write={false} edit={false} notifications={true}/>
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <Suspense fallback={<BlogLoader/>}> <SearchedUserOneBlog blogId={blogId} atomNumber={atomNumber} /> </Suspense>
            </div>
        </div>
    )
})
export default SearchedBlog;