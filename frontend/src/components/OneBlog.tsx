import randomColor from "./randomColor";
import Image from "./Image";
import { useRecoilState, useRecoilValue } from "recoil";
import { blogAtomFamily, commentsDataAtom } from "../store/blogs/atom";
import date from "./date";
import { memo, useEffect, useRef } from "react";
import Clap from "./Clap";
import axios from "axios";
import Comments from "./Comments";
import CommentUpload from "./CommentUpload";
const color = randomColor()

const OneBlog = memo(({ blogId }: {blogId: string}) => {
    const ref1 = useRef<HTMLDivElement>(null)
    const oneBlog = useRecoilValue(blogAtomFamily(blogId))
    const [comments, setComments] = useRecoilState(commentsDataAtom)
    useEffect(() => {
        const getComments = async () => {
            const res = await axios.get("http://localhost:8787/api/v1/blog/getComments", {
                headers: {
                    blogId,
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`
                }
            })
            setComments(res.data)
        }
        getComments()
    }, [])
    return (
            <div className="">
                <div className="">
                    <div className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        {oneBlog.title}
                    </div>
                </div>
                <div className=" flex my-8 pb-">
                    <div className={`hover:cursor-pointer mr-3 mt-3 w-9 h-9 text-center p-5 rounded-full flex justify-center`} style={{background: color}} >
                        <div className="flex flex-col justify-center text-white text-lg">
                            {oneBlog.author.name[0].toUpperCase()}
                        </div>
                    </div>
                    <div className="mt-3 text-md ">
                        <div className="flex ">
                            <div className="font-mono text-slate-900 hover:underline hover:decoration-gray-900 hover:cursor-pointer">{oneBlog.author.name}</div>
                            <div className="ml-2 text-gray-500 font-bold">·</div>
                            <div className="ml-2 font-mono text-slate-900 underline hover:decoration-gray-900 hover:cursor-pointer">Follow</div>
                        </div>
                        <div className="text-sm text-slate-500 font-medium flex">
                            <div>
                                {date(oneBlog.date)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex py-2 border-y-1 border-gray-100 ">
                    <div>
                       <Clap blogId={oneBlog.id}/>
                    </div>
                    <div onClick={() => {
                        ref1.current?.scrollIntoView({behavior: "smooth"})
                    }} className="ml-5 flex hover:cursor-pointer group">
                        <div className="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="24" height="24" fill="none" className="mt-0.5 text-gray-600 group-hover:text-gray-950">
                                <path className="" stroke="currentColor" strokeWidth={0.5} d="M1 8c0-3.43 3.262-6 7-6s7 2.57 7 6-3.262 6-7 6c-.423 0-.838-.032-1.241-.094-.9.574-1.941.948-3.06 1.06a.75.75 0 0 1-.713-1.14c.232-.378.395-.804.469-1.26C1.979 11.486 1 9.86 1 8Z" fill="none"/>
                            </svg>
                        </div>
                        <div className="text-gray-600 text-sm mt-0.5 group-hover:text-gray-950">{oneBlog.numberOfComments}</div>
                    </div>
                </div>
                
                <div className={`${oneBlog.imageExist ? "" : "hidden"} mt-15`}>
                    <Image blogId={blogId} />
                </div>
                <div className="mt-10 border-b-1 border-gray-100 pb-15 ">
                    <div className="text-md sm:text-lg md:text-xl mx-2" dangerouslySetInnerHTML={{ __html: oneBlog.content }}/>
                </div> 
                <div ref={ref1} className="mt-15 text-2xl font-semibold mb-10">
                    Responses ({oneBlog.numberOfComments})
                </div>
                <div className=" flex"> 
                    <div className={`hover:cursor-pointer mr-3 w-9 h-9 text-center p-5 rounded-full flex justify-center`} style={{background: randomColor()}} >
                        <div className="flex flex-col justify-center text-white text-lg">
                            {localStorage.getItem("username")?.[0]}
                        </div>
                    </div>
                    <div className=" text-md font-mono mt-2">
                        {localStorage.getItem("username")}
                    </div>
                </div>
                <div className="border-b-1 border-gray-100 pb-8 mb-8 mt-6">
                    <CommentUpload blogId={oneBlog.id} />
                </div>
                <div>
                    {comments ? 
                    comments.map((comment) => {
                        return (
                            <Comments key={comment.comment} comment={comment} />
                        )
                    }) : null
                    }
                </div>
            </div>
    )
})

export default OneBlog;

