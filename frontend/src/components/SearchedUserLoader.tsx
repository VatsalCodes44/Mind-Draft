import BlogsLoader from "./BlogsLoader"

function SearchedUserLoader() {
  return (
    <div className="w-full px-5 lg:grid lg:grid-cols-12 lg:gap-8 pt-25 lg:mr-7.5 animate-pulse">
        <div className="hidden lg:block lg:col-span-1"></div>
        <div className=" lg:col-span-6">
            <div className="lg:flex-none sm:mx-16 md:mx-16 lg:mx-0 ">
                <div className="flex justify-between">
                    <div className="flex gap-4">
                        <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full " >
                            <div className="w-full h-full text-lg sm:text-3xl text-white rounded-full flex justify-center items-center">
                                    <svg className="text-gray-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                    </svg>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="h-6 bg-gray-200 rounded-md w-50"></div>
                        </div>
                    </div>
            </div>
            </div>
            <div className="min-w-auto sm:mx-16 md:mx-16 lg:mx-0">
                <div className="flex gap-6 border-b-1 mt-10 border-b-gray-200 pb-3 text-gray-600 ">
                </div>
            </div>
            <div className="">
                <BlogsLoader />
            </div>
        </div>


        <div className="hidden w-full text-black lg:block lg:col-span-4 ">
            <div className="flex justify-between">
                <div className=" w-1 h-100 mt-17 ml-7.5 border-l-1 border-gray-300 right-130" />
                <div className="w-full ml-7.5">
                    <div className="text-block">
                        <div className="flex justify-center">
                            <div className="h-30 w-30 rounded-full text-white text-4xl flex justify-center items-center" >
                                <svg className="text-gray-200 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 text-lg font-semibold font-mono">
                            <div className="h-6 bg-gray-200 rounded-md w-full mb-4"></div>
                        </div>
                        <div className={`mt-4`}>
                            <div className="h-25 bg-gray-200 rounded-md w-full mb-4"></div>
                        </div>
            
                    </div>
                </div>
            </div>
        </div>
        <div className="hidden lg:block lg:col-span-1"></div>
    </div>
  )
}

export default SearchedUserLoader
