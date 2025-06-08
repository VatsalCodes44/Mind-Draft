import { useNavigate, useSearchParams } from 'react-router-dom';
import Appbar from '../components/Appbar';
import SearchBlog from '../components/SearchBlog';

function SearchedBlog() {
    const navigate = useNavigate()
    const [param] = useSearchParams()
    const blogId = param.get("blogId")
    if (!blogId) {
        navigate("/blogs")
        return;
    }
  return (
        <div className=" flex justify-center w-full max-w-screen">
            <Appbar searchBar={true} publish={false} write={true} edit={false} notifications={true}/>
            <div className="mt-25 min-w-xs sm:w-xl md:w-2xl lg:min-w-3xl mx-10">
                <SearchBlog blogId={blogId} />
            </div>
        </div>
    )
}

export default SearchedBlog;