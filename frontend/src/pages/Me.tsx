import { memo, Suspense, useRef, useState } from "react";
import randomColor from "../components/randomColor";
import Profile from "../components/Profile";
import Appbar from "../components/Appbar";
import MyBlogs from "../components/MyBlogs";
import BlogsLoader from "../components/BlogsLoader";


const Me = memo(() => {
        const color = useRef<string>(randomColor());
        const [homeDraftsLibrary, setHomeDraftsLibrary] = useState<"home" | "drafts" | "library">("home")
    return (
        <div className="w-full h-screen">
            <Appbar searchBar={true} edit={false} write={true} publish={false}  notifications={true}/>
            <div className="w-full px-5 lg:grid lg:grid-cols-12 lg:gap-8 pt-25">
                <div className="hidden lg:block lg:col-span-1"></div>
                <div className=" lg:col-span-6">
                    <div className="lg:flex-none sm:mx-16 md:mx-16 lg:mx-0">
                        <Profile color={color.current.toString()} />
                    </div>
                    <div className="min-w-auto sm:mx-16 md:mx-16 lg:mx-0">
                        <div className="flex gap-6 border-b-1 mt-10 border-b-gray-200 pb-3 text-gray-600 ">
                            <div onClick={() => {
                                setHomeDraftsLibrary("home")
                            }} className={`${homeDraftsLibrary == "home" ? "text-black underline underline-offset-17" : ""} hover:cursor-pointer`}>
                                Home
                            </div>
                            <div onClick={() => {
                                setHomeDraftsLibrary("drafts")
                            }}  className={`${homeDraftsLibrary == "drafts" ? "text-black underline underline-offset-17" : ""} hover:cursor-pointer`}>
                                Drafts
                            </div>
                            <div onClick={() => {
                                setHomeDraftsLibrary("library")
                            }}  className={`${homeDraftsLibrary == "library" ? "text-black underline underline-offset-17" : ""} hover:cursor-pointer`}>
                                Library
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <Suspense fallback={<div><BlogsLoader /></div>}><MyBlogs homeDraftsLibrary={homeDraftsLibrary}/></Suspense>

                    </div>
                </div>
                <div className="hidden w-full bg-zinc-200 text-white lg:block lg:col-span-3">
                    <div className="flex justify-center">
                        <div className={` w-30 h-30 rounded-full flex justify-center items-center text-5xl text-white`} style={{background: color.current.toString()}} >
                            {/* {oneBlog.author.name[0].toUpperCase()} */}
                            V
                        </div>
                    </div>
                    <div className="text-gray-700 flex justify-center">
                        2 followers
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-1"></div>
            </div>
        </div>
    )
})

export default Me;