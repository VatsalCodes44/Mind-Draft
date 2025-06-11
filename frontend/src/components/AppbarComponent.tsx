import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { htmlContent, preview } from "../store/blogUploadEdit/atom";
import { memo, useEffect, useRef, useState } from "react";
import axios from "axios";
import { userProfileColor } from "../store/userInfo/atom";
import randomColor from "./randomColor";
import { homeDraftsLibrary } from "../store/blogs/atom";

interface blogSuggestionType {
    id: string,
    title: string
}
interface AuthorSuggestionType {
    id: string,
    name: string,
    profilePicExist: boolean
    profilePic? : string
}

const AppbarComponent = memo(({searchBar, write, publish, edit}: {searchBar: boolean, write: boolean, publish: boolean, edit:boolean}) => {
    const navigate = useNavigate()
    const setHtmlContent = useSetRecoilState(htmlContent)
    const setPreview = useSetRecoilState(preview)
    const [dropDown, setDropDown] = useState(false)
    const dropDownElement = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    const lastScroll = useRef<number> (0);
    const [param] = useSearchParams()
    const myBlogId = param.get("myBlogId")
    const numberAtom = param.get("number")
    const color = useRecoilValue(userProfileColor)
    const [showResults,setShowResults] = useState<boolean>(false)
    const element = useRef<HTMLDivElement>(null)
    const elementMobile = useRef<HTMLDivElement>(null)
    const focusInputMobile = useRef<HTMLInputElement>(null)
    const [shouldFocusBeTrue, setShouldFocusIsTrue] = useState<boolean>(false)
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false)
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const setHomeDraftsLibrary = useSetRecoilState(homeDraftsLibrary) 
    const [input, setInput] = useState("")
    useEffect(() => {
        // setTimeout(() => {
            setProfilePic(sessionStorage.getItem("profilePic"))
        // }, 300) 
    }, []);
    useEffect(() => {
        function handleClickOutsideInput(event: MouseEvent) {
          if (showResults==true){
              if (element.current && !element.current.contains(event.target as Node)) {
                  setShowResults(false);
                  setInput("")
              }
          }
          if (showResults==true){
              if (elementMobile.current && !elementMobile.current.contains(event.target as Node)) {
                  setShowResults(false);
                  setInput("")
              }
          }
        }
        document.addEventListener('mousedown', handleClickOutsideInput);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideInput);
        };
    }, [showResults]);
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
                setShowSearchBar(false)
                setShowResults(false)
            }
            lastScroll.current = window.scrollY;
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll);
        };
    }, [dropDown]);

    useEffect(() => {
        if (shouldFocusBeTrue){
            focusInputMobile.current?.focus()
        }
    }, [shouldFocusBeTrue])

    return (
        <div className="border-b-1 border-slate-200">
            <div className="flex justify-between mt-2.5 ml-3 mb-1.5 sm:ml-6.5 ">
                <div className="flex">
                    <div onClick={() => {
                        navigate("/blogs")
                    }} className="font-[Noe_Display_Bold] text-3xl font-bold min-w-37 hover:cursor-pointer">
                        Mind Draft
                    </div>
                    <div className={`${searchBar ? "hidden sm:block" : "hidden"} `}>
                        <div className="relative ml-3">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-black"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                            </div>
                            <input
                            type="text"
                            value={input}
                            placeholder="Search blogs..."
                            onFocus={() => setShowResults(true)}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-gray-100 custom-caret py-2 px-10 rounded-full focus:outline-0"
                            onClick={() => setShowResults(true)}
                            onKeyDown={(e) => {
                                if (e.key) setShowResults(true)
                                if (e.key == "Backspace" && input == "") setShowResults(false)
                            }}
                            />
                        </div>
                        <div ref={element} className={`${showResults ? "opacity-100 translate-y-2" : "opacity-0 -translate-y-2 pointer-events-none"} absolute mx-3 hidden sm:block`} >
                            <AutoComplete input={input} setInput={setInput} showResults={showResults} setShowSearchBar= {setShowSearchBar} setShowResults={setShowResults}  />
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
                        setShouldFocusIsTrue(p => !p)
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
                            navigate(`/edit?myBlogId=${myBlogId}&number=${numberAtom}`)
                            
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

                    <div ref={buttonRef} onClick={() => {
                            setDropDown(p => !p);
                    }} className="h-9 w-9 text-xs rounded-full mr-3 sm:mr-6.5 pb-0.5 hover:cursor-pointer">
                            { profilePic ? <AuthorImage profilePic={profilePic}/> : <ImageNotExist username={(sessionStorage.getItem("username") || "a").toUpperCase()[0]} color={color}/>}
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
                            window.scrollTo(0,0);
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
                        <div onClick={() => {
                          setHomeDraftsLibrary("drafts")
                          navigate("/me")
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
                        <div onClick={() => {
                          navigate("/signin")
                          sessionStorage.clear()
                        }} className="flex hover:text-red-600 justify-start border-t-1 border-gray-300 pl-5 py-3 gap-4 items-center ">
                            <span>
                                Log out
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {showSearchBar && searchBar && 
            <div className="absolute w-full">
                <div className="relative w-3xs mx-auto sm:hidden">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-black"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                    </div>
                    <input
                    type="text"
                    value={input}
                    ref = {focusInputMobile}
                    placeholder="Search blogs..."
                    onFocus={() => setShowResults(true)}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-gray-100 custom-caret py-2 px-10 rounded-full focus:outline-0"
                    onClick={() => setShowResults(true)}
                    onKeyDown={(e) => {
                        if (e.key == "Backspace" && input == "") setShowResults(false)
                    }}
                    />
                </div>
                <div ref={elementMobile} className={`${showResults ? "opacity-100 translate-y-2" : "opacity-0 -translate-y-2 pointer-events-none"} w-3xs mx-auto block sm:hidden`} >
                    <AutoComplete input={input} setInput={setInput} showResults={showResults} setShowSearchBar= {setShowSearchBar} setShowResults={setShowResults} />
                </div>
            </div>
            }
        </div>
    )
}
)


export default AppbarComponent;

const AuthorImage = memo(({profilePic}: {profilePic: string }) => {
    return (
        <img src={profilePic} alt="loading..." className="w-full h-full rounded-full" />
    )
})

const ImageNotExist = memo(({username, color}:{username: string, color: string}) => {
    return(
        <div className="w-full h-full text-sm text-white rounded-full flex justify-center items-center" style={{background: color}}>
                {username}
        </div>
    )
})



interface blogSuggestionType {
    id: string,
    title: string
}
interface AuthorSuggestionType {
    id: string,
    name: string,
    profilePicExist: boolean
    profilePic? : string
}

interface ImagesObject {
    [id: string]: {
        id: string,
        image: string
    }
}
const AutoComplete = ({ input, setInput, showResults, setShowSearchBar, setShowResults }: { input: string, setInput: React.Dispatch<React.SetStateAction<string>>, showResults: boolean, setShowResults: React.Dispatch<React.SetStateAction<boolean>>, setShowSearchBar:React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [blogSuggestions, setBlogSuggestions] = useState<blogSuggestionType[]>([]);
    const [authorSuggestions, setAuthorSuggestions] = useState<AuthorSuggestionType[]>([]);
    const [loading, setLoading] = useState(false);
    

    
    const fetchSuggestions = async (query: string) => {
      try {
        setLoading(true);
        const blogResults = localStorage.getItem("cachedBlogResults") || "[]";
        const storedBlogsArray: blogSuggestionType[] = JSON.parse(blogResults);
    
        const cachedBlogsResults = storedBlogsArray.filter((x) =>
          x.title.toLowerCase().includes(query.toLowerCase())
        );
    
        if (cachedBlogsResults.length > 0) {
          setBlogSuggestions(cachedBlogsResults.slice(0, 4));
        } else {
          const response = await axios.get(
            `https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/getSuggestions?query=${query}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
              },
            }
          );
          setBlogSuggestions(response.data || []);
        }
    
        const authorResults = localStorage.getItem("cachedAuthorResults") || "[]";
        const storedAuthorArray: AuthorSuggestionType[] = JSON.parse(authorResults);
    
        const cachedAuthorResults = storedAuthorArray.filter((x) =>
          x.name.toLowerCase().startsWith(query.toLowerCase())
        );
    
        if (cachedAuthorResults.length > 0) {
          setAuthorSuggestions(cachedAuthorResults.slice(0, 4));
        } else {
          const response2 = await axios.get(
            `https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/getAuthorSuggestions?query=${query}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
              },
            }
          );
          const authors: AuthorSuggestionType[] = response2.data || []
          const authorIds = authors.filter(x => x.profilePicExist).map(x => x.id);
          const response3 = await axios.post(`https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/images`,{
            blogIds: authorIds
          }, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
              },
            }
          );
    
          const images: ImagesObject = response3.data || {};
          const authorsAndImages: AuthorSuggestionType[] = authors.map(x => {
            if (images[x.id]){
              x.profilePic= images[x.id].image
            }
            return x;
          })
          setAuthorSuggestions(authorsAndImages)
        }
      } catch (error) {
        setBlogSuggestions([]);
        setAuthorSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
  // ✅ Load cached suggestions on first mount
  useEffect(() => {
    const blogResults = localStorage.getItem("cachedBlogResults") || "[]";
    const authorResults = localStorage.getItem("cachedAuthorResults") || "[]";

    const storedBlogArray: blogSuggestionType[] = JSON.parse(blogResults);
    const storedAuthorArray: AuthorSuggestionType[] = JSON.parse(authorResults);

    setBlogSuggestions(storedBlogArray.slice(0, 4));
    setAuthorSuggestions(storedAuthorArray.slice(0, 4));

  }, []);

  // ✅ Also reload cached suggestions when input is empty and user clicks (triggered by showResults)
  useEffect(() => {
    if (showResults && input === "") {
      const blogResults = localStorage.getItem("cachedBlogResults") || "[]";
      const authorResults = localStorage.getItem("cachedAuthorResults") || "[]";

      const storedBlogArray: blogSuggestionType[] = JSON.parse(blogResults);
      const storedAuthorArray: AuthorSuggestionType[] = JSON.parse(authorResults);

      setBlogSuggestions(storedBlogArray.slice(0, 4));
      setAuthorSuggestions(storedAuthorArray.slice(0, 4));
    }
  }, [showResults, input]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input.length > 0) {
        fetchSuggestions(input); // Make sure you have this function
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div >
      {showResults && (
        <div>
          {loading ? (
            <div className="mt-2 rounded-md shadow-md shadow-gray-300 w-3xs sm:w-sm md:w-md ">
              <div className="h-8 w-full p-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse shadow"></div>
            </div>
          ) : blogSuggestions.length > 0 || authorSuggestions.length > 0 ? (
            <div className="mt-2 bg-white rounded-md shadow-md shadow-gray-300 w-3xs sm:w-sm md:w-md p-2">
              {authorSuggestions.length > 0 && (
                <div className="mb-2 text-md text-gray-500 font-semibold">PEOPLE</div>
              )}
              {authorSuggestions.map((s, i) => (
                <AuthorSuggestion key={i} suggestion={s} setInput={setInput} setShowSearchBar= {setShowSearchBar} setShowResults={setShowResults} />
              ))}
              {blogSuggestions.length > 0 && (
                <div className="mb-2 text-md text-gray-500 font-semibold">BLOGS</div>
              )}
              {blogSuggestions.map((s, i) => (
                <Suggestion key={i} suggestion={s} highlight={input} setInput={setInput} setShowSearchBar= {setShowSearchBar} setShowResults={setShowResults} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};


const Suggestion = ({suggestion,  highlight, setInput, setShowSearchBar, setShowResults}: { suggestion: blogSuggestionType, highlight: string, setInput: React.Dispatch<React.SetStateAction<string>>, setShowResults: React.Dispatch<React.SetStateAction<boolean>>, setShowSearchBar:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate()
  const getHighlightedText = (text: string, highlight: string) => {
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts;
  };

  return (
    <div
      className="truncate h-8 hover:bg-gray-50  hover:cursor-pointer"
      onClick={() => {
        // navigate(`/searchedBlog?blogId=${suggestion.id}`);
        setInput("");
        const results = localStorage.getItem("cachedBlogResults") || "[]";
        const storedArray: blogSuggestionType[] = JSON.parse(results);
        const alreadyExists = storedArray.some(
          (item) => item.id === suggestion.id
        );
        if (storedArray.length > 10) {
            storedArray.pop();
        }
        if (!alreadyExists) {
          storedArray.unshift({
            id: suggestion.id,
            title: suggestion.title,
          });
          localStorage.setItem("cachedBlogResults", JSON.stringify(storedArray));
        }
        navigate(`/SingleSearchedBlog?blogId=${suggestion.id}`)
        window.scrollTo(0,0)
        setShowSearchBar(false)
        setShowResults(false)
      }}
    >
      {getHighlightedText(suggestion.title, highlight).map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="font-semibold text-indigo-700">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
};

const AuthorSuggestion = ({suggestion, setInput, setShowSearchBar, setShowResults}: { suggestion: AuthorSuggestionType, setInput: React.Dispatch<React.SetStateAction<string>>, setShowResults: React.Dispatch<React.SetStateAction<boolean>>, setShowSearchBar:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const navigate = useNavigate();
    return (
    <div
      className="truncate h-10 hover:bg-gray-50 hover:cursor-pointer flex items-center gap-2 mb-4"
      onClick={() => {
        // navigate(`/searchedBlog?blogId=${suggestion.id}`);
        setInput("");
        const results = localStorage.getItem("cachedAuthorResults") || "[]";
        const storedArray: AuthorSuggestionType[] = JSON.parse(results);
        const alreadyExists = storedArray.some(
          (item) => item.id === suggestion.id
        );
        if (storedArray.length > 10) {
            storedArray.pop();
        }
        if (!alreadyExists) {
          storedArray.unshift({
            id: suggestion.id,
            name: suggestion.name,
            profilePicExist: suggestion.profilePicExist,
            profilePic: suggestion.profilePic
          });
          localStorage.setItem("cachedAuthorResults", JSON.stringify(storedArray));
        }
        navigate(`/searchUser?userId=${suggestion.id}`)
        window.scrollTo(0,0)
        setShowSearchBar(false)
        setShowResults(false)
      }}
    >   
        <div className="w-10 h-10 rounded-full " >
                {suggestion.profilePic ? <AuthorImage profilePic={suggestion.profilePic}/> : <ImageNotExist username={ suggestion.name ? suggestion.name.trim()[0].toUpperCase() : "A"} color={randomColor()}/>}
        </div>
        <div className="truncate overflow-hidden">
            {suggestion.name}
        </div>
    </div>
  );
};