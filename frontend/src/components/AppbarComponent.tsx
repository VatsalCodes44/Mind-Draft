import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSetRecoilState } from "recoil";
import { htmlContent, preview } from "../store/blogUploadEdit/atom";
import { memo, useEffect, useRef, useState } from "react";


const AppbarComponent = memo(({searchBar, write, publish, edit, notifications}: {searchBar: boolean, write: boolean, publish: boolean, edit:boolean, notifications: boolean}) => {
    const navigate = useNavigate()
    const setHtmlContent = useSetRecoilState(htmlContent)
    const setPreview = useSetRecoilState(preview)
    const [dropDown, setDropDown] = useState(false)
    const dropDownElement = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    const lastScroll = useRef<number> (0);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropDown==true){
                if (dropDownElement.current && !dropDownElement.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                    setDropDown(false);
                }
            }
        }
        function handleScroll() {
            if (window.scrollY > lastScroll.current && window.scrollY > 10) {
                setDropDown(false);
            }
            lastScroll.current = window.scrollY;
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropDown]);

    return (
        <div className="border-b-1 border-slate-200">
            <div className="flex justify-between mt-2.5 ml-3 mb-1.5 sm:ml-6.5 ">
                <div className="flex">
                    <div onClick={() => {
                        navigate("/blogs")
                    }} className="font-[Noe_Display_Bold] text-3xl font-bold min-w-37 hover:cursor-pointer">
                        Mind Draft
                    </div>
                    <div className={`${searchBar ? "" : "hidden"}`}>
                        <div className=" mx-3 hidden sm:block">
                            <SearchBar />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 sm:gap-6">
                    <div className={` ${publish ? "" : "hidden"} flex justify-center items-center`} >
                        <div className="bg-green-600 hover:bg-green-700 hover:cursor-pointer rounded-full">
                            <button onClick={() => {
                                const editorValue = document.querySelector(".ContentEditable__root")
                                const htmlString = editorValue?.innerHTML ?? "";
                                setHtmlContent(htmlString)
                                setPreview("publish")
                            }} className="text-center hover:cursor-pointer py-1.5 mx-3 text-sm text-white" >Publish</button>
                        </div> 
                    </div>

                    <div className={` ${searchBar ? "" : "hidden"} `}>
                        <div className=" sm:hidden mt-2 hover:cursor-pointer">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={.6} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className={` ${write ? "" : "hidden"} `}>
                        <div onClick={() => {
                            navigate("/upload")
                        }} className=" mt-0.5 hover:cursor-pointer">
                            <div className="flex">
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={.5} stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                                <div className="hidden sm:block text-gray-600 text-sm mt-1">
                                    Write
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={` ${edit ? "" : "hidden"} `}>
                        <div onClick={() => {
                            navigate("/edit")
                        }} className="sm:block mt-0.5 hover:cursor-pointer">
                            <div className="flex">
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={.5} stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </div>
                                <div className=" text-gray-600 text-sm mt-1">
                                    Edit
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={` ${notifications ? "" : "hidden"} `} >
                        <div className=" mt-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </div>
                    </div>

                    <div ref={buttonRef} onClick={() => {
                                setDropDown(p => !p);
                    }} className="mr-3 sm:mr-6.5 bg-red-600 h-8 w-8 text-center rounded-full p-1 hover:cursor-pointer">
                        V
                    </div>
                    <div ref={dropDownElement}
                    className={`
                        hover:cursor-pointer
                        absolute top-12 right-6 z-10 mt-2 w-60 rounded-xs bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden 
                        transform transition-all duration-300 ease-out text-gray-700
                        ${dropDown ? "opacity-100 translate-y-2" : "opacity-0 -translate-y-2 pointer-events-none"}
                    `}
                    role="menu">
                        <div onClick={() => {
                            navigate("/me");
                        }} className="flex justify-start pl-5 py-3 gap-4 items-center ">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 text-current"
                            aria-label="Profile"
                            >
                            <circle cx="12" cy="7" r="4.5" stroke="currentColor" strokeWidth={2} />
                            <path
                                strokeWidth={2}
                                stroke="currentColor"
                                strokeLinecap="round"
                                d="M3.5 21.5v-4.342C3.5 15.414 7.306 14 12 14s8.5 1.414 8.5 3.158V21.5"
                            />
                            </svg>                            
                            <span>
                                Profile
                            </span>
                        </div>
                        <div className="flex justify-start pl-5 py-3 gap-4 items-center ">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="w-5 h-5"
                            aria-label="Lists"
                            >
                            <path d="M6.44 6.69a1.5 1.5 0 0 1 1.06-.44h9a1.5 1.5 0 0 1 1.06.44l.354-.354-.353.353A1.5 1.5 0 0 1 18 7.75v14l-5.694-4.396-.306-.236-.306.236L6 21.75v-14c0-.398.158-.78.44-1.06Z" />
                            <path d="M12.5 2.75h-8a2 2 0 0 0-2 2v11.5" />
                            </svg>
                            <span>
                                Library
                            </span>
                        </div>
                        <div className="flex justify-start pl-5 py-3 gap-4 items-center">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="w-5 h-5"
                            aria-label="Stories"
                            >
                            <path d="M4.75 21.5h14.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .138.112.25.25.25Z" />
                            <path d="M8 8.5h8M8 15.5h5M8 12h8" />
                            </svg>
                            <span>
                                Drafts
                            </span>
                        </div>
                        <div onClick={() => {
                            navigate("/upload");
                        }} className="flex justify-start pl-5 py-3 gap-4 items-center">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="w-5 h-5"
                            aria-label="Stories"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            <span>
                                Write
                            </span>
                        </div>
                        <div className="flex hover:text-red-600 justify-start border-t-1 border-gray-300 pl-5 py-3 gap-4 items-center ">
                            <span>
                                Log out
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
)


export default AppbarComponent;