// import { useRef, useState } from "react"

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import SearchedUserLoader from "../components/SearchedUserLoader";












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
            <SearchedUserLoader />
        </div>
    )
}

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