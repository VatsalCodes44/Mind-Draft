import { memo, Suspense, useRef, useState } from "react";
import randomColor from "../components/randomColor";
import Profile from "../components/Profile";
import Appbar from "../components/Appbar";
import BlogsLoader from "../components/BlogsLoader";
import UserProfile from "../components/UserProfile";
import { useNavigate } from "react-router-dom";
import MyBlogsComponent from "../components/MyBlogsComponent";
const Me = memo(() => {
    const color = useRef<string>(randomColor());
    const navigate = useNavigate()
    const [homeDraftsLibrary, setHomeDraftsLibrary] = useState<"home" | "drafts" | "library">("home")

    return (
        <div className="w-full h-screen">
            <Appbar searchBar={true} edit={false} write={true} publish={false}  notifications={true}/>
            <div className="w-full px-5 lg:grid lg:grid-cols-12 lg:gap-8 pt-25 lg:mr-7.5">
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
                        <Suspense fallback={<div className=" sm:mx-16 md:mx-16 lg:mx-0"><BlogsLoader /></div>}>
                            <MyBlogsComponent homeDraftsLibrary={homeDraftsLibrary}/>
                        </Suspense>

                    </div>
                </div>
                

                <div className="hidden w-full text-black lg:block lg:col-span-4 ">
                    <div className="flex justify-between">
                        <div className=" w-1 h-100 mt-17 ml-7.5 border-l-1 border-gray-300 right-130" />
                        <div className="w-full ml-7.5">
                            <UserProfile />
                            <div onClick={() => {
                                navigate("/updateProfile")
                            }}
                            className="flex justify-start text-blue-600 hover:text-blue-700 hover:cursor-pointer hover:underline hover:underline-offset-2 mt-4 gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                className="w-5 h-5"
                                aria-label="Stories">
                                <path  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                                <span>
                                    Edit Your Profile
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-1"></div>
            </div>
        </div>
    )
})

export default Me;
// <div className="flex justify-center">
//     <div className={` w-30 h-30 rounded-full flex justify-center items-center text-5xl text-white`} style={{background: color.current.toString()}} >
//         {/* {oneBlog.author.name[0].toUpperCase()} */}
//         V
//     </div>
// </div>
// <div className="text-gray-700 flex justify-center">
//     2 followers
// </div>