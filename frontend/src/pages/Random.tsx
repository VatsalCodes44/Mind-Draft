// import { useRef, useState } from "react"

import axios from "axios";
import { memo, useEffect, useRef, useState } from "react";
import randomColor from "../components/randomColor";












// searchbar
interface suggestionType {
    id: string,
    title: string
}
interface Results {
    id: string,
    title: string,
}

function Random() {
    
    return(
        <div> 
            <AutoComplete2 />
        </div>
    )
}

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
const AutoComplete2 = () => {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [blogSuggestions, setBlogSuggestions] = useState<blogSuggestionType[]>([]);
  const [authorSuggestions, setAuthorSuggestions] = useState<AuthorSuggestionType[]>([]);
  const [loading, setLoading] = useState(false);
  const element = useRef<HTMLDivElement>(null)
  const lastScroll = useRef<number>(0)
  // Load cached suggestions once on mount
  useEffect(() => {
    const blogResults = localStorage.getItem("cachedBlogResults") || "[]";
    const authorResults = localStorage.getItem("cachedAuthorResults") || "[]";

    const storedBlogArray: blogSuggestionType[] = JSON.parse(blogResults);
    const storedAuthorArray: AuthorSuggestionType[] = JSON.parse(authorResults);

    setBlogSuggestions(storedBlogArray.slice(0, 4));
    setAuthorSuggestions(storedAuthorArray.slice(0, 4));
    function handleClickOutside(event: MouseEvent) {
        if (showResults==true){
            if (element.current && !element.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
    }
    function handleScroll() {
        if (window.scrollY > lastScroll.current && window.scrollY > 10) {
            setShowResults(false);
        }
        lastScroll.current = window.scrollY;
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll);
    };
  }, [showResults]);

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
          `http://127.0.0.1:8787/api/v1/blog/getSuggestions?query=${query}`,
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
          `http://127.0.0.1:8787/api/v1/user/getAuthorSuggestions?query=${query}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
            },
          }
        );
        const authors: AuthorSuggestionType[] = response2.data || []
        const authorIds = authors.filter(x => x.profilePicExist).map(x => x.id);
        const response3 = await axios.post(`http://127.0.0.1:8787/api/v1/blog/images`,{
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

  useEffect(() => {
    if (input.length >= 1) {
      fetchSuggestions(input);
    } else {
      // If input is cleared, show cached suggestions again
      const blogResults = localStorage.getItem("cachedBlogResults") || "[]";
      const authorResults = localStorage.getItem("cachedAuthorResults") || "[]";

      const storedBlogArray: blogSuggestionType[] = JSON.parse(blogResults);
      const storedAuthorArray: AuthorSuggestionType[] = JSON.parse(authorResults);

      setBlogSuggestions(storedBlogArray.slice(0, 4));
      setAuthorSuggestions(storedAuthorArray.slice(0, 4));
    }
  }, [input]);

  return (
    <div ref={element} >
      <div className="relative">
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
            if (e.key == "Backspace" && input == "") setShowResults(false)
          }}
        />
      </div>

      {showResults && (
        <div>
          {loading ? (
            <div className="mt-2 w-full rounded-md shadow-md shadow-gray-300 ">
              <div className="h-8 w-full p-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse shadow"></div>
            </div>
          ) : blogSuggestions.length > 0 ? (
            <div className="mt-2 bg-white rounded-md shadow-md shadow-gray-300 ">
              {authorSuggestions.length > 0 ? <div className="mb-2 text-md text-gray-500 font-semibold">PEOPLE</div> : <div></div>}
              {authorSuggestions.map((s, i) => (
                <AuthorSuggestion
                  key={i}
                  suggestion={s}
                  setInput={setInput}
                />
              ))}
              {blogSuggestions.length > 0 ? <div className="mb-2 text-md text-gray-500 font-semibold">BLOGS</div> : <div></div>}
              {blogSuggestions.map((s, i) => (
                <Suggestion2
                  key={i}
                  suggestion={s}
                  highlight={input}
                  setInput={setInput}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const Suggestion2 = ({
  suggestion,
  highlight,
  setInput,
}: {
  suggestion: blogSuggestionType;
  highlight: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) => {

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
        if (!alreadyExists) {
          storedArray.unshift({
            id: suggestion.id,
            title: suggestion.title,
          });
          localStorage.setItem("cachedBlogResults", JSON.stringify(storedArray));
        }
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


const AuthorSuggestion = ({suggestion, setInput,}: { suggestion: AuthorSuggestionType, setInput: React.Dispatch<React.SetStateAction<string>>}) => {

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
        if (!alreadyExists) {
          storedArray.unshift({
            id: suggestion.id,
            name: suggestion.name,
            profilePicExist: suggestion.profilePicExist,
            profilePic: suggestion.profilePic
          });
          localStorage.setItem("cachedAuthorResults", JSON.stringify(storedArray));
        }
      }}
    >   
        <div className="w-10 h-10 rounded-full " >
                {suggestion.profilePic ? <Image profilePic={suggestion.profilePic}/> : <ImageNotExist username={ suggestion.name ? suggestion.name.trim()[0].toUpperCase() : "A"} color={randomColor()}/>}
        </div>
        <div>
            {suggestion.name}
        </div>
    </div>
  );
};

const Image = memo(({profilePic}: {profilePic: string}) => {
    return (
        <img src={profilePic} className="w-full h-full rounded-full" />
    )
})

const ImageNotExist = memo(({username, color}:{username: string, color: string}) => {
    return(
        <div className="w-full h-full text-xs text-white rounded-full flex justify-center items-center" style={{background: color}}>
                {username}
        </div>
    )
})




export const AutoComplete = () => {
    const [input, setInput] = useState("")
    const [suggestions, setSuggestions] = useState<suggestionType[]>([])
    const [loading, setLoading] = useState(false)
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
    return (
        <div className="relative w-full max-w-3xs sm:max-w-sm md:max-w-md mx-auto mt-10">
  <input
    type="text"
    value={input}
    placeholder="Search blogs..."
    className="w-full p-3 pl-10 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
    onChange={(e) => setInput(e.target.value)}
  />
  <div className="absolute left-3 top-3 text-gray-400">🔍</div>

  {loading ? (
    <div className="mt-2 rounded-lg shadow-lg border border-gray-200">

        <div
          className="h-8 w-full p-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse shadow"
        ></div>
      
    </div>
   ) : (
     suggestions.length > 0 && (
       <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
         {suggestions.map((s) => (
           <Suggestion key={s.id} suggestion={s} highlight={input} />
         ))}
       </div>
     )
   )} 
</div>
    )
}

const Suggestion = ({suggestion, highlight}: {suggestion: suggestionType, highlight: string}) => {
    const getHighlitedText = (text: string, highlight: string) => {
        return text.split(new RegExp(`(${highlight})`, 'gi'))
    }
    console.log(getHighlitedText(suggestion.title, highlight))
    return  (
        <div className="truncate w-full p-1 h-8 hover:bg-gray-50 hover:cursor-pointer" onClick={() => {
            const results = localStorage.getItem("cachedSearchResults") || "[]";
            const storedArray: Results[] = JSON.parse(results)
            storedArray.unshift({
                id: suggestion.id,
                title: suggestion.title
            })
            localStorage.setItem("cachedSearchResults",JSON.stringify(storedArray))
            console.log("done")
        }} >
            {
                getHighlitedText(suggestion.title, highlight).map((x,i) => {
                    if (x.toLowerCase() === highlight.toLowerCase()) {
                        return <span key={i} className="font-semibold text-indigo-700">{x}</span>
                    } else {
                        return (
                            <span>{x}</span>
                        )
                    }
                })
            }
        </div>
    )
}









export const OTP = ({x}: {x:number}) => {
    
    const ref1 = useRef<HTMLInputElement[]>([]);

    return (
        <div className="w-max mx-auto grid grid-cols-12 my-1">
            {Array(x).fill(0).map((_,index) => {
                return(
                    <SubOTP key={index} reference={(element) => {
                       if (element) ref1.current[index] = element
                    }} onDone={() => {
                        if (index == x-1){

                        } else {
                            ref1.current[index+1].focus()
                        }
                    }} onBackspace={() => {
                        if (index == 0){

                        } else {
                            ref1.current[index-1].focus()
                            ref1.current[index-1].value = ""
                        }
                    }} />
                )
            })}
        </div>
    )
}

const SubOTP = ({reference, onDone, onBackspace}: {reference: (e: HTMLInputElement) => void, onDone: () => void, onBackspace: () => void}) => {
    const [value, setValue] = useState("")
    return (
            <input type="text" value={value} placeholder="*" ref={reference} onChange={(e) => {
                console.log(e.target.value)
                if (["0","1","2","3","4","5","6","7","8","9"].includes(e.target.value.slice(0)) ){
                    setValue(e.target.value.slice(0))
                    onDone()
                } else if (e.target.value.length==2 && ["0","1","2","3","4","5","6","7","8","9"].includes(e.target.value.slice(1)) ) {
                    setValue(e.target.value.slice(1))
                    onDone()
                }
            }} onKeyDown={(e) => {
                if (e.key == "Backspace") {
                    setValue("")
                    onBackspace()
                }
            }} className="ml-1 w-5 h-5 my-1 bg-amber-200 text-center pt-0.5" />
    )
}



// OTP UNPOLISHED
// const Random = () => {
    
//     const ref1 = useRef<HTMLInputElement>(null);
//     const ref2 = useRef<HTMLInputElement>(null);
//     const ref3 = useRef<HTMLInputElement>(null);
//     const ref4 = useRef<HTMLInputElement>(null);
//     const ref5 = useRef<HTMLInputElement>(null);
//     const ref6 = useRef<HTMLInputElement>(null);

//     return (
//         <div className="w-full">
//             <div className="w-max mx-auto">
//                 <SubOTP reference={ref1} onDone={() => {
//                     ref2.current?.focus()
//                 }} onBackspace={() => {
                    
//                 }}/>
//                 <SubOTP reference={ref2} onDone={() => {
//                     ref3.current?.focus()
//                 }} onBackspace={() => {
//                     ref1.current?.focus()
//                 }}/>
//                 <SubOTP reference={ref3} onDone={() => {
//                     ref4.current?.focus()
//                 }} onBackspace={() => {
//                     ref2.current?.focus()
//                 }}/>
//                 <SubOTP reference={ref4} onDone={() => {
//                     ref5.current?.focus()
//                 }} onBackspace={() => {
//                     ref3.current?.focus()
//                 }}/>
//                 <SubOTP reference={ref5} onDone={() => {
//                     ref6.current?.focus()
//                 }} onBackspace={() => {
//                     ref4.current?.focus()
//                 }}/>
//                 <SubOTP reference={ref6} onDone={() => {
//                 }} onBackspace={() => {
//                     ref5.current?.focus()
//                 }}/>
//             </div>
//         </div>
//     )
// }

// const SubOTP = ({reference, onDone, onBackspace}: {reference: React.RefObject<HTMLInputElement | null>, onDone: () => void, onBackspace: () => void}) => {
//     const [value, setValue] = useState(" ")
//     return (
//             <input type="text" placeholder="*" value={value} ref={reference} onChange={(e) => {
//                 console.log(e.target.value)
//                 if (["0","1","2","3","4","5","6","7","8","9"].includes(e.target.value.slice(1)) ){
//                     setValue(e.target.value.slice(1))
//                     onDone()
//                 } else {

//                 }
//             }} onKeyDown={(e) => {
//                 console.log(e.key)
//                 if (e.key == "Backspace") {
//                     setValue("*")
//                     onBackspace()
//                 }
//             }} className="ml-1 w-5 h-5 bg-amber-200 text-center pt-0.5" />
//     )
// }





export default Random;