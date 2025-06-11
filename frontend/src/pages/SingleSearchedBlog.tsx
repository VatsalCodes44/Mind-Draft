import { Navigate, useSearchParams } from 'react-router-dom';
import Appbar from '../components/Appbar';
import SearchBlog from '../components/SearchBlog';

function SingleSearchedBlog() {
    const [param] = useSearchParams()
    const blogId = param.get("blogId")
    if (!blogId) {
        return <Navigate to={"/blogs"} />

    }
    if (!sessionStorage.getItem("token")){
        return <Navigate to={"/signin"} />
    }
  return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={true} publish={false} write={true} edit={false} />
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <SearchBlog blogId={blogId} />
            </div>
        </div>
    )
}

export default SingleSearchedBlog;