import { memo, useCallback, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getImage, htmlContent as content, preview, summary as s, title as t, imageExist as imgExist, editorState as eState } from "../store/blogUploadEdit/atom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getDateTime from "./getDateTime";
import { myBlogAtomFamily, myImageAtomFamily } from "../store/blogs/atom";


const Publish = memo(() => {
    const title = useRecoilValue(t)
    const [summary,setSummary] = useRecoilState(s)
    const htmlContent = useRecoilValue(content)
    const editorState = useRecoilValue(eState)
    const setPreview = useSetRecoilState(preview)
    const image = useRecoilValue(getImage)
    const imageExist = useRecoilValue(imgExist)
    const [ring, setRing ] = useState <boolean> (false)
    const [draftRing, setDraftRing] = useState <boolean>(false)
    const [clicked,setClicked] = useState <boolean>(false)
    const setMyblogs = useSetRecoilState(myBlogAtomFamily(1))
    const setMyImages = useSetRecoilState(myImageAtomFamily(1))
    const navigate = useNavigate()
    


    const handleApi = useCallback(async (published: boolean) => {
        try{
            const formData = new FormData()
            if (image){
                formData.append("image", image)
            }
            if (title.trim() === ""){
                setRing(false)
                setDraftRing(false)
                setClicked(false)
                return
            } 
            if (htmlContent == `<p class="PlaygroundEditorTheme__paragraph"><br></p>`){
                setRing(false)
                setDraftRing(false)
                setClicked(false)
                alert("Content is empty!!!")
                return
            }
            formData.append("title", title)
            formData.append("content", htmlContent)
            formData.append("imageExist", imageExist ? "true" : "false")
            formData.append("published", published ? "true" : "false")
            formData.append("summary",summary)
            formData.append("time", getDateTime())
            formData.append("editorState", editorState)
            
            const response = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/upload",formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            
            setRing(false)
            setDraftRing(false)
            setClicked(false)
            navigate("/me")
            if (published){
                alert("Published")
            } else {
                alert("Saved in drafts")
            }
            if(response.data){
                const message: string = response.data.message;
                if (message){
                    setMyblogs(previous =>{
                        return {
                            [response.data.message]:{
                                id: message,
                                title,
                                summary,
                                content: htmlContent,
                                editorState,
                                imageExist: imageExist==="true",
                                published,
                                date: getDateTime(),
                                likes: 0,
                                numberOfComments: 0,
                                author: {
                                    name: window.sessionStorage.getItem("username")
                                },
                                authorId: window.sessionStorage.getItem("userId")
                            }
                            ,...previous
                        }
                    })
                    if (image){
                        setMyImages(previous=>{
                            return {
                                ...previous,
                                [message]: {
                                    id: message,
                                    image: URL.createObjectURL(image)
                                }
                            }
                        } )
                    }
                }
            }
        } catch(e) {
            setRing(false)
            setDraftRing(false)
            setClicked(false)
            alert("Failed! try again")
        }
            
      },[title, summary, setSummary, setPreview, image, imageExist, htmlContent])


    return(
        <div className="w-full">
            <div className="hidden lg:block min-w-full max-w-full max-h-screen min-h-screen">
                <div onClick={clicked ? () => {} : () => setPreview("edit")} className="absolute top-5 lg:right-23 xl:right-55 ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={` ${clicked ? "text-gray-400" : "text-gray-500 hover:text-gray-600  hover:cursor-pointer" } size-6 `}>
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                    </svg>
                </div>
                <div className="grid grid-cols-12 gap-5 h-screen w-full">
                    <div className="lg:col-span-1 xl:col-span-2"></div>
                    <div className=" flex flex-col justify-center lg:col-span-5 xl:col-span-4 w-full h-screen">
                        <div className="text-xl text-gray-800 font-bold">
                            Mind-Draft Preview
                        </div>    
                        <div className="flex justify-center w-full">
                            <div className="flex flex-col justify-center text-center text-sm text-gray-600 h-50 w-sm">
                                Include a high-quality image in your story to make it more inviting to readers.
                            </div>
                        </div>
                        <div className="text-lg font-semibold border-b-2 pb-2 border-gray-200">
                            { title.trim() == "" ? <div className="text-red-600 animate-pulse ">Title is empty!!!</div> :  <div>{title.length < 125 ? title : `${title.slice(0,125)}...`}</div>}
                        </div>
                        <div className="">
                            <textarea rows={2} 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setSummary(e.target.value)
                            }}
                            className="w-full pb-2 text-gray-800 border-b-2 border-gray-200 placeholder:text-gray-800 resize-none overflow-hidden text-base focus:outline-none cursor-text" 
                            placeholder="Summarize your mind-draft here..." />
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">Note:</span> Changes here will affect how your story appears in public places like Medium’s homepage and in subscribers’ inboxes — not the contents of the story itself.
                        </div>
                    </div>
                    <div className="flex flex-col justify-center lg:col-span-5 xl:col-span-4 h-full">
                        <div className="text-gray-800 text-xl font-bold ml-7">
                            Public visibility:
                        </div>
                        <div className=" flex justify-center ml-7">
                            <div className=" w-full border-b-2 border-gray-200 pb-5 mt-4">
                                <div className="flex text-sm">
                                    <div className="bg-amber-400 text-center py-1 h-6 w-6 text-xs mx-1 rounded-full">
                                        {"Vatsal mahajan"[0]}
                                    </div>
                                    <div className="font-semibold pt-0.5">
                                        {"Vatsal Mahajan".length > 7 ? `${"Vatsal Mahajan".slice(0,7)}.` : "Vatsal mahajan" } 
                                    </div>
                                    <div className="  text-slate-500 ml-1 text-sm pt-0.5 ">
                                        ·
                                    </div>
                                    <div className="ml-1 pt-0.5  text-slate-500">
                                        {"7 Apr, 2025"}
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-10 mt-2">
                                    <div className="col-span-4">
                                        <div className=" text-xl font-bold">
                                            {title.length > 94 ? `${title.slice(0,81)}...` : title}
                                        </div>
                                        <div className="mt-2 font-semibold text-gray-500">
                                            {summary.length > 94 ? `${summary.slice(0,94)}...` : summary}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ml-7 mt-5 text-gray-800 text-lg">
                            <span className="">Publishing to:</span>
                            <span className="ml-2 font-bold">Vatsal Mahajan</span>
                        </div>
                        <div>
                            <div className="ml-7 flex mt-5 h-33">
                                <div>
                                    <button onClick={clicked ? () => {
                                    } : () => {
                                        setRing(true)
                                        setClicked(true)
                                        handleApi(true)
                                    }} className={`${clicked? "bg-green-300" : "bg-green-600 hover:bg-green-700 hover:cursor-pointer"} flex text-white rounded-full px-2.5 py-1.5 `} >
                                        <div className=" text-white">Publish now</div>
                                        <div className={`${ring ? "block" : "hidden"}`}>
                                            <svg className="inline w-4 h-4 ml-2 text-white animate-spin duration-100 fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                                <div onClick={() => {
                                    setDraftRing(true)
                                    setClicked(true)
                                    handleApi(false)
                                }}
                                className={` ${clicked? "text-gray-400" : "text-gray-600 hover:text-gray-700 hover:cursor-pointer"} flex ml-8  pt-1.5 font-semibold`} > 
                                    <div className="">
                                        Save in drafts
                                    </div>
                                    <div className={`${draftRing ? "block" : "hidden"} `}>
                                        <svg className="inline mb-1 w-4 h-4 ml-2 text-gray-600 animate-spin duration-100 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-span-2"></div>
                </div>
            </div>
            {/* small than lg */}
            <div className="lg:hidden flex justify-center w-full">
                <div onClick={clicked ? () => {} : () => setPreview("edit")} className="absolute top-5 right-3 sm:right-16 md:right-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={` ${clicked ? "text-gray-400" : "text-gray-500 hover:text-gray-600  hover:cursor-pointer" } size-6 `}>
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                    </svg>
                </div>
                <div className="max-w-xl">
                    <div className=" flex flex-col justify-center col-span-4 w-auto mt-4">
                        <div className="text-xl text-gray-800 font-bold">
                            Mind-Draft Preview
                        </div>    
                        <div className="flex justify-center ">
                            <div className="flex flex-col justify-center text-center text-sm text-gray-600 h-50 w-sm">
                                Include a high-quality image in your story to make it more inviting to readers.
                            </div>
                        </div>
                        <div className="text-lg font-semibold border-b-2 pb-2 border-gray-200">
                            { title.trim() == "" ? <div className="text-red-600 animate-pulse">Title is empty!!!</div> :  <div>{title.length < 157 ? title : `${title.slice(0,157)}...`}</div>}
                        </div>
                        <div className="">
                            <textarea rows={2} 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setSummary(e.target.value)
                            }}
                            className="w-full pb-2 text-gray-800 border-b-2 border-gray-200 placeholder:text-gray-800 resize-none overflow-hidden text-base focus:outline-none cursor-text" 
                            placeholder="Summarize your mind-draft here..." />
                        </div>
                        <div className="text-sm text-gray-600 mb-8">
                            <span className="font-semibold">Note:</span> Changes here will affect how your story appears in public places like Medium’s homepage and in subscribers’ inboxes — not the contents of the story itself.
                        </div>
                        <div className="text-gray-800 text-xl font-bold">
                            Public visibility:
                        </div>
                        <div className=" flex justify-center ">
                            <div className=" w-full border-b-2 border-gray-200 mt-4 pb-6">
                                <div className="flex text-sm">
                                    <div className="bg-amber-400 text-center py-1 h-6 w-6 text-xs mx-1 rounded-full">
                                        {"Vatsal mahajan"[0]}
                                    </div>
                                    <div className="font-semibold pt-0.5">
                                        {"Vatsal Mahajan".length > 7 ? `${"Vatsal Mahajan".slice(0,7)}.` : "Vatsal mahajan" } 
                                    </div>
                                    <div className="  text-slate-500 ml-1 text-sm pt-0.5 ">
                                        ·
                                    </div>
                                    <div className="ml-1 pt-0.5  text-slate-500">
                                        {"7 Apr, 2025"}
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-10 mt-2">
                                    <div className="col-span-4">
                                        <div className=" text-xl font-bold">
                                            {title.length > 109 ? `${title.slice(0,109)}...` : title}
                                        </div>
                                        <div className="mt-2 font-semibold text-gray-500">
                                            {summary.length >= 120 ? `${summary.slice(0,120)}...` : summary}
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" mt-5 text-gray-800 text-lg">
                            <span className="">Publishing to:</span>
                            <span className="ml-2 font-bold">Vatsal Mahajan</span>
                        </div>
                        <div>
                            <div className=" flex mt-5 h-25">
                                <div>
                                    <button onClick={clicked ? () => {
                                    } : () => {
                                        setRing(true)
                                        setClicked(true)
                                        handleApi(true)
                                    }} className={` ${clicked? "bg-green-300" : "bg-green-600 hover:bg-green-700 hover:cursor-pointer"} flex justify-between rounded-full px-2.5 py-1.5`}>
                                        <div className=" text-white">Publish now</div>
                                        <div className={`${ring ? "block" : "hidden"}`}>
                                            <svg className="inline w-4 h-4 ml-2 text-white animate-spin duration-100 fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                                <div onClick={() => {
                                    setDraftRing(true)
                                    setClicked(true)
                                    handleApi(false)
                                }}
                                className={` ${clicked? "text-gray-400" : "text-gray-600 hover:text-gray-700 hover:cursor-pointer"} flex ml-8  pt-1.5 font-semibold`} >
                                    <div className="">
                                        Save in drafts
                                    </div>
                                    <div className={`${draftRing ? "block" : "hidden"} `}>
                                        <svg className="inline mb-1 w-4 h-4 ml-2 text-gray-600 animate-spin duration-100 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                    
            </div>
        </div>
    )
}) 

export default Publish;