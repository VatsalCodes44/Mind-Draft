import axios from "axios"
import { memo, useEffect, useRef, useState } from "react"
import getDateTime from "./getDateTime";
import { useSetRecoilState } from "recoil";
import { commentAtomFamily } from "../store/blogs/atom";

interface Blog {
    id: string;
    title: string;
    summary: string;
    content: string;
    editorState: string;
    imageExist: boolean;
    published: boolean;
    date: string;
    likes: number;
    numberOfComments: number;
    author: {
      name: string
    }
    authorId: string;
}
const SearchedBlogCommentUpload = memo(({blog, setBlog}: {blog: Blog | null, setBlog: React.Dispatch<React.SetStateAction<Blog | null>>}) => {
    const [comment,setComment] = useState("")
    const setComments = useSetRecoilState(commentAtomFamily(1))
    const [minHeight, setMinHeight] = useState("1rem")
    const [clicked, setClicked] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // Adjust height on content change
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
        textarea.style.height = 'auto'; // reset first
        textarea.style.height = `${textarea.scrollHeight}px`; // set to scroll height
        }
    };

    useEffect(() => {
        adjustHeight(); // initial run
    }, [comment]);

    return (
        <div className="bg-gray-100 border-1 rounded-md border-gray-100 pt-2 pb-2 pr-4">
            <textarea 
            ref={textareaRef}
            rows={1}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setComment(e.target.value)
            }} onClick={() => {
                setMinHeight('10rem')
            }}
            placeholder="What are your thoughts?" 
            className={`${minHeight === "1rem" ? "min-h-[1rem]" : "min-h-[6rem]"} transition-all px-2 pt-1.5 duration-500 rounded-sm resize-none overflow-hidden w-full font-sans font-semibold text-sm placeholder:text-sm placeholder:text-gray-400 focus:outline-none`} />
            <div className={`${minHeight === "1rem" ? "hidden" : "block"} flex justify-end gap-5`}>
                <div>
                    <button onClick={() => {
                        setComment("")
                        if (textareaRef.current) {
                            textareaRef.current.value = "";
                        }
                    }} className="text-xs text-gray-800 hover:text-gray-950 mt-2 hover:cursor-pointer">Cancel</button>
                </div>  
                <div>
                    <button onClick={async () => {
                        if (comment==""){

                        }else{
                            setClicked(true)
                            const response = await axios.post("http://127.0.0.1:8787/api/v1/blog/addComment",{
                                blogId: blog?.id,
                                authorId: window.sessionStorage.getItem("userId"),
                                comment,
                                date: getDateTime()
                            }, {
                                headers: {
                                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                                }
                            })
                            if (response.status.toString() == "200") {
                                setComments(previous => {
                                    return [
                                        {   
                                            id: Math.random(),
                                            authorId: window.sessionStorage.getItem("userId")?.toString() || "",
                                            date: getDateTime(),
                                            comment,
                                            Commentor: {
                                                name: window.sessionStorage.getItem("username")?.toString() || ""
                                            }
                                        }, ...previous
                                    ]
                                })
                                if (textareaRef.current){
                                    textareaRef.current.value = ""
                                    textareaRef.current.style.height= "20px"
                                }
                                setBlog(previous => {
                                    if (previous){
                                        return {...previous, numberOfComments: previous.numberOfComments + 1}
                                    } else {
                                        return null
                                    }
                                })
                                setClicked(false)
                                setComment("")
                                setMinHeight("1rem")
                            }

                            }
                        }
                    } className={` ${!(comment != "" && clicked==false) ? "bg-gray-300" : "bg-gray-700 hover:bg-gray-950 hover:cursor-pointer"} text-xs text-white py-2 px-4 rounded-full`}>Respond</button>
                </div>  
            </div>
        </div>
    )
})

export default SearchedBlogCommentUpload;
