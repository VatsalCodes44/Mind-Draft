import Appbar from "../components/Appbar";
import { memo, Suspense } from "react";
import BlogsLoader from "../components/BlogsLoader";
import BlogsComponent from "../components/BlogsComponent";


const Blogs = memo(() => {
    // const blogs = useBlogs();
    return (
        <div className="">
            <div>
                <Appbar searchBar={true} publish={false} edit={false} write={true} />
            </div>
            <Suspense fallback={<div className=" pt-18  max-w-3xl w-full mx-auto">
                <div className="mx-8 sm:mx-16 md:mx-16 lg:mx-0">
                    <BlogsLoader />
                </div>
            </div>}>
                <BlogsComponent />
            </Suspense>
        </div>
    )
            
})
export default Blogs;