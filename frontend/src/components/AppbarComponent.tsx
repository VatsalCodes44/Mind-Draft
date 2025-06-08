import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { htmlContent, preview } from "../store/blogUploadEdit/atom";
import { memo, useEffect, useRef, useState } from "react";
import axios from "axios";
import { userProfileColor } from "../store/userInfo/atom";


const AppbarComponent = memo(({searchBar, write, publish, edit, notifications}: {searchBar: boolean, write: boolean, publish: boolean, edit:boolean, notifications: boolean}) => {
    const navigate = useNavigate()
    const setHtmlContent = useSetRecoilState(htmlContent)
    const setPreview = useSetRecoilState(preview)
    const [dropDown, setDropDown] = useState(false)
    const dropDownElement = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    const lastScroll = useRef<number> (0);
    const [param] = useSearchParams()
    const myBlogId = param.get("myBlogId")
    const color = useRecoilValue(userProfileColor)
    const [input, setInput] = useState("")
    const [suggestions, setSuggestions] = useState<suggestionType[]>([])
    const [loading, setLoading] = useState(false)
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false)
    useEffect(() => {
        const results = localStorage.getItem("cachedSearchResults") || "[]";
        const storedArray: Results[] = JSON.parse(results)
        if (storedArray.length >= 5){
            setSuggestions(storedArray.slice(0,5))
        } else {
            setSuggestions(storedArray.slice(0, storedArray.length))
        }
    },[])
    const fetchSuggestions = async (query: string) => {
        try{
            setLoading(true)
            const results = localStorage.getItem("cachedSearchResults") || "[]";
            const storedArray: Results[] = JSON.parse(results)
            const cachedResults = storedArray.filter(x => {
                if (x.title.includes(input)){
                    return true;
                } else {
                    return false;
                }
            })
            if (cachedResults.length > 0) {
                setSuggestions(cachedResults)
            } else {
                const response = await axios.get(`http://127.0.0.1:8787/api/v1/blog/getSuggestions?query=${query}`,{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                })
                if (response) {
                    const suggestionsArray: suggestionType[] = response.data
                    setSuggestions(suggestionsArray);
                } else {
                    setSuggestions([])
                }
            }          
        } catch {
            return []
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (input.length >= 1){
            fetchSuggestions(input)
        }
    }, [input])
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
                            <div className="relative ">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div> 
                                <input type="text" value={input}
                                    placeholder="Search blogs..."
                                    onChange={(e) => setInput(e.target.value)} 
                                    className="bg-gray-100 custom-caret py-2 px-10 rounded-full focus:outline-0" />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className={`${input == "" ? "hidden" : "block"} `}>
                                {loading ? (
                                    <div className="mt-2 absolute rounded-lg shadow-lg border border-gray-200 w-3xs sm:w-sm md:w-md">

                                        <div
                                        className="h-8 w-full p-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse shadow"
                                        ></div>
                                    
                                    </div>
                                ) : (
                                    suggestions.length > 0 && (
                                    <div className="mt-2 absolute bg-white rounded-lg shadow-lg border border-gray-200 max-w-3xs sm:max-w-sm md:max-w-md">
                                        {suggestions.map((s,i) => (
                                        <Suggestion key={i} suggestion={s} highlight={input} />
                                        ))}
                                    </div>
                                    )
                                )}
                            </div>
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
                                window.scrollTo(0,0)
                            }} className="text-center hover:cursor-pointer py-1.5 mx-3 text-sm text-white" >Publish</button>
                        </div> 
                    </div>

                    <div className={` ${searchBar ? "" : "hidden"} `} onClick={() => {
                        setShowSearchBar(p => !p)
                    }}>
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
                            navigate(`/edit?myBlogId=${myBlogId}`)
                            
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
                    }} className="h-9 w-9 text-xs rounded-full mr-3 sm:mr-6.5 pb-0.5 hover:cursor-pointer">
                            {sessionStorage.getItem("profilePicExist") ? <AuthorImage profilePic={sessionStorage.getItem("profilePic") || ""}/> : <ImageNotExist username={(sessionStorage.getItem("username") || "a").toUpperCase()[0]} color={color}/>}
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
            {showSearchBar && 
            <div className="absolute w-full sm:hidden pt-2">
                <div className={`w-3xs mx-auto`}>
                    <div className="relative ">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div> 
                        <input type="text" value={input}
                            placeholder="Search blogs..."
                            onChange={(e) => setInput(e.target.value)} 
                            className="bg-gray-100  custom-caret py-1 px-10 rounded-full focus:outline-0" 
                            onKeyDown={(e) => {
                                if (e.key == "Backspace" && input==""){
                                    setShowSearchBar(false)
                                }
                            } }
                            />
                    </div>
                    {loading ? (
                        <div className="mt-2  rounded-lg shadow-lg border border-gray-200 ">

                            <div
                            className="h-8 p-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse shadow"
                            ></div>
                        
                        </div>
                    ) : (
                        suggestions.length > 0 && (
                        <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 ">
                            {suggestions.map((s,i) => (
                            <Suggestion key={i} suggestion={s} highlight={input} />
                            ))}
                        </div>
                        )
                    )}
                </div>
            </div>
            }
        </div>
    )
}
)


export default AppbarComponent;

const AuthorImage = memo(({profilePic}: {profilePic: File | string }) => {
    if (profilePic instanceof(File)){
        profilePic = URL.createObjectURL(profilePic);
    }
    return (
        <img src={profilePic} className="w-full h-full rounded-full" />
    )
})

const ImageNotExist = memo(({username, color}:{username: string, color: string}) => {
    return(
        <div className="w-full h-full text-sm text-white rounded-full flex justify-center items-center" style={{background: color}}>
                {username}
        </div>
    )
})


interface suggestionType {
    id: string,
    title: string
}
interface Results {
    id: string,
    title: string,
}


const Suggestion = ({suggestion, highlight}: {suggestion: suggestionType, highlight: string}) => {
    const navigate = useNavigate()
    const getHighlitedText = (text: string, highlight: string) => {
        const input = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return input.split(new RegExp(`(${highlight})`, 'gi'))
    }
    return  (
        <div className="truncate p-1 h-8 hover:bg-gray-50 hover:cursor-pointer" onClick={() => {
            navigate(`/searchedBlog?blogId=${suggestion.id}`)
            const results = localStorage.getItem("cachedSearchResults") || "[]";
            const storedArray: Results[] = JSON.parse(results)
            const alreadyExists = storedArray.some(item => item.id === suggestion.id);
            if (!alreadyExists){
                storedArray.unshift({
                    id: suggestion.id,
                    title: suggestion.title
                })
                localStorage.setItem("cachedSearchResults",JSON.stringify(storedArray))
            }
        }} >
            {
                getHighlitedText(suggestion.title, highlight).map((x,i) => {
                    if (x.toLowerCase() === highlight.toLowerCase()) {
                        return <span key={i} className="font-semibold text-indigo-700">{x}</span>
                    } else {
                        return (
                            <span key={i} >{x}</span>
                        )
                    }
                })
            }
        </div>
    )
}
