import { memo } from "react";
import ImageLoader from "./ImageLoader";


export const BlogsLoaderChild = memo(() => {
    return(
        <div className=" flex justify-center pt-4 sm:pt-0">
                <div className="max-w-3xl w-3xl border-b-1 border-slate-100 mt-4 pb-6 hover:cursor-pointer">
                    <div className="flex text-sm items-center">
                         <svg className="w-6 h-6 me-1.5 text-gray-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                        </svg>
                        <div className="">
                            <div className="h-2.5 bg-gray-200 rounded-full w-32 "></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 mt-4" >
                        <div className="col-span-4 ">
                            <div className="h-8  bg-gray-200 rounded-sm mb-4"></div>
                            <div className="h-4  bg-gray-200 rounded-sm mb-4"></div>
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <ImageLoader />
                        </div>
                    </div>
                    <div className="mt-2 text-slate-600 text-sm flex gap-2">
                        <div className="h-2.5 bg-gray-200 rounded-full w-10 mb-4"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full w-10 mb-4"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full w-10 mb-4"></div>
                    </div>
                </div>
            </div>
    )
})



const BlogsLoader = memo(() => {
    return(
        <div className="">
            <BlogsLoaderChild />
            <BlogsLoaderChild />
            <BlogsLoaderChild />
        </div>
    )
})

export default BlogsLoader;