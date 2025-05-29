import { memo } from "react";
import ImageLoader from "./ImageLoader";


const BlogLoader = memo(() => {
    return(
        <div className=" flex justify-center ml-7">
                <div className="max-w-3xl w-3xl border-b-1 border-slate-100 mt-4 pb-6 hover:cursor-pointer">
                    <div className="flex text-sm">
                         <svg className="w-10 h-10 me-3 text-gray-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                        </svg>
                        <div>
                            <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2"></div>
                            <div className="w-48 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-10 mt-2 " >
                        <div className="col-span-4 ">
                            <div className="h-8 bg-gray-200 rounded-sm mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded-sm mb-4"></div>
                        </div>
                        <div className="col-span-2">
                            <ImageLoader />
                        </div>
                    </div>
                    <div className="mt-4 text-slate-600 text-sm">
                        <div className="h-2.5 bg-gray-200 rounded-full w-15 mb-4"></div>
                    </div>
                </div>
            </div>
    )
})



const BlogsLoader = memo(() => {
    return(
        <div>
            <BlogLoader />
            <BlogLoader />
            <BlogLoader />
        </div>
    )
})

export default BlogsLoader;