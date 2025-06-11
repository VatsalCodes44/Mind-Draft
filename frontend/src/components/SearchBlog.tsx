import { memo, useEffect, useRef, useState } from "react";
import axios from "axios";
import BlogLoader from "./BlogLoader";
import randomColor from "./randomColor";
import date from "./date";
import SearchedBlogCommentUpload from "./SearchedBlogCommentUpload";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { commentAtomFamily, commentImageAtomFamily, numberOfCommentsFetched } from "../store/blogs/atom";
import CommentsPagination from "./CommentsPagination";



type Comment = {
    id: number,
    authorId: string;
    date: string;
    comment: string;
    Commentor: {
        name: string;
    }
}
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


function SearchBlog({blogId}: {blogId: string}) {
    const [blog, setBlog] = useState<Blog | null>(null)
    const [image, setImage] = useState<string | null>(null)
    const ref1 = useRef<HTMLDivElement>(null)
    const [authorImage, setAuthorImage] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const color = useRef<string>(randomColor())
     const [commentRequestNumber, setCommentRequestNumber] = useState<number>(1)
    const setFirstComments = useSetRecoilState(commentAtomFamily(1))
    const setFirstCommentorsImages = useSetRecoilState(commentImageAtomFamily(1))
    const setCommentsFetched = useSetRecoilState(numberOfCommentsFetched)
    const isFirstCommentsBundleSet = useRef<boolean>(false)
    useEffect(() => {
        const getComments = async () => {
            try{
                setLoading(true)
                const response = await axios.get("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/getFirstComments", {
                    headers: {
                        blogId,
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                })
                if (response) {
                    const comments: Comment[] = response.data

                    const commentorIds = comments.map(comment => {
                        return comment.authorId
                    })
                    const response2 = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/images",{
                        blogIds: commentorIds,
                    },{
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                        }
                    })
                    if (response2){
                        const commentorImages = response2.data
                        const commentsFetched = comments.length
                        setFirstComments(comments)
                        setFirstCommentorsImages(commentorImages)
                        isFirstCommentsBundleSet.current = true
                        if (commentsFetched){
                            setCommentsFetched(comments.length)
                        }
                    }
                }
            } catch {
            }
        }

        if (!isFirstCommentsBundleSet.current){
            getComments()
        }
    }, [blogId])
    async function fetchBlog(blogId: string) {
        try{
            const response = await axios.get(`https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/getBlog?blogId=${blogId}`,{
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }, "responseType": "json"
            })
            const fetchedBlog: Blog = response.data
            if (fetchedBlog){
                setBlog(fetchedBlog)
                if (fetchedBlog.imageExist){
                    const response2 = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/userImage",{
                        userId: blogId,
                    },{
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                        }
                    })
                    if (response2) {
                        const blogImage = response2.data
                        setImage(blogImage.image)
                    }

                }
                const response3 = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/userImage",{
                    userId: fetchedBlog.authorId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                })
                const userImage = response3.data
                if (userImage){
                    setAuthorImage(userImage.image)
                }
            }
        } catch{
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchBlog(blogId)
    }, [blogId])

  return (
        <div >
            {loading ? 
            <div>
                <BlogLoader/>
            </div>
            :
            <div className="">
                <div className="">
                    <div className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        {blog?.title}
                    </div>
                </div>
                <div className=" flex my-8 items-center">
                    <div className="h-9 w-9 text-xs mr-3 rounded-full">
                            {authorImage ? <AuthorImage profilePic={authorImage}/> : <ImageNotExist username={blog?.author.name.toUpperCase()[0] || ""} color={color.current}/>}
                    </div>
                    <div className="mt-3 text-md ">
                        <div className="flex ">
                            <div className="font-mono text-slate-900 hover:underline hover:decoration-gray-900 hover:cursor-pointer">{blog?.author.name}</div>
                            <div className="ml-2 text-gray-500 font-bold">·</div>
                            <div className="ml-2 font-mono text-slate-900 underline hover:decoration-gray-900 hover:cursor-pointer">Follow</div>
                        </div>
                        <div className="text-sm text-slate-500 font-medium flex">
                            <div>
                                {blog ? date(blog.date) : ""}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex py-2 border-y-1 border-gray-100 ">
                    <div>
                        {blog ? <Clap blog={blog} setBlog={setBlog} /> : <div/>}
                    </div>
                    <div onClick={() => {
                        ref1.current?.scrollIntoView({behavior: "smooth"})
                    }} className="ml-5 flex hover:cursor-pointer group">
                        <div className="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="24" height="24" fill="none" className="mt-0.5 text-gray-600 group-hover:text-gray-950">
                                <path className="" stroke="currentColor" strokeWidth={0.5} d="M1 8c0-3.43 3.262-6 7-6s7 2.57 7 6-3.262 6-7 6c-.423 0-.838-.032-1.241-.094-.9.574-1.941.948-3.06 1.06a.75.75 0 0 1-.713-1.14c.232-.378.395-.804.469-1.26C1.979 11.486 1 9.86 1 8Z" fill="none"/>
                            </svg>
                        </div>
                        <div className="text-gray-600 text-sm mt-0.5 group-hover:text-gray-950">{blog?.numberOfComments}</div>
                    </div>
                </div>
                <div className={`${blog?.imageExist && image ? "" : "hidden"} mt-15`}>
                    {image ? <img src={image} alt="loading" className=" w-full h-auto rounded-2xl"/> : <div></div>}
                </div>
                <div className="mt-10 border-b-1 border-gray-100 pb-15 ">
                    {blog ? <div className="text-md sm:text-lg md:text-xl mx-2" dangerouslySetInnerHTML={{ __html: blog.content }}/> : <div/> }
                </div> 
                <div ref={ref1} className="mt-15 text-2xl font-semibold mb-10">
                    Responses ({blog?.numberOfComments})
                </div>
                <div className=" flex"> 
                    <div className="h-9 w-9 text-xs mr-2 rounded-full">
                            {sessionStorage.getItem("profilePicExist") ? <AuthorImage profilePic={sessionStorage.getItem("profilePic") || ""} /> : <ImageNotExist username={(sessionStorage.getItem("username") || "a").toUpperCase()[0]} color={color.current}/>}
                    </div>
                    <div className=" text-md font-mono mt-2">
                        {sessionStorage.getItem("username")}
                    </div>
                </div>
                <div className="border-b-1 border-gray-100 pb-8 mb-8 mt-6">
                    <SearchedBlogCommentUpload blog={blog} setBlog={setBlog} />
                </div>
                <div>
                    {blog ? <CommentsPagination commentRequestNumber={commentRequestNumber} setCommentRequestNumber={setCommentRequestNumber} blogId={blogId} totalComments={blog?.numberOfComments}/> : <div></div>}
                </div>
            </div>
            }
        </div>
  )
}

export default SearchBlog;


const AuthorImage = memo(({profilePic}: {profilePic:string }) => {
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

const Clap = memo(({blog, setBlog}: {blog: Blog, setBlog: React.Dispatch<React.SetStateAction<Blog | null>>}) => {
    const [clap, setClapped] = useState <boolean> (false)
    const [firstRender, setFirstRender] = useState<boolean>(true)
    const likeCountFormatter = new Intl.NumberFormat('en-US')
    const [claps, setClaps] = useState<number>(blog.likes)
    useSearchClapDebounce(blog.id, claps, firstRender, setFirstRender, setBlog)
    return (
        <div className="flex hover:cursor-pointer">
            <div >
                <button onClick={ () => {
                    setClapped(true)
                    setClaps(p => p+1)
                }} >
                    <svg width="24" height="24" viewBox="0 0 24 24" className="group hover:cursor-pointer active:animate-ping" >
                        <path fill={clap ? "currentColor" : "none"} className={` ${clap ? "text-gray-600 group-hover:text-gray-950" : " stroke-gray-600 group-hover:stroke-gray-950" }`} stroke="currentColor" strokeWidth={0.5} d="M11.37.828 12 3.282l.63-2.454zM15.421 1.84l-1.185-.388-.338 2.5zM9.757 1.452l-1.184.389 1.523 2.112zM20.253 11.84 17.75 7.438c-.238-.353-.57-.584-.93-.643a.96.96 0 0 0-.753.183 1.13 1.13 0 0 0-.443.695c.014.019.03.033.044.053l2.352 4.138c1.614 2.95 1.1 5.771-1.525 8.395a7 7 0 0 1-.454.415c.997-.13 1.927-.61 2.773-1.457 2.705-2.704 2.517-5.585 1.438-7.377M12.066 9.01c-.129-.687.08-1.299.573-1.773l-2.062-2.063a1.123 1.123 0 0 0-1.555 0 1.1 1.1 0 0 0-.273.521z"></path>
                        <path fill={clap ? "currentColor" : "none"} className={` ${clap ? "text-gray-600 group-hover:text-gray-950" : " stroke-gray-600 group-hover:stroke-gray-950" } `} stroke="currentColor" strokeWidth={0.5} d="M14.741 8.309c-.18-.267-.446-.455-.728-.502a.67.67 0 0 0-.533.127c-.146.113-.59.458-.199 1.296l1.184 2.503a.448.448 0 0 1-.236.755.445.445 0 0 1-.483-.248L7.614 6.106A.816.816 0 1 0 6.459 7.26l3.643 3.644a.446.446 0 1 1-.631.63L5.83 7.896l-1.03-1.03a.82.82 0 0 0-1.395.577.81.81 0 0 0 .24.576l1.027 1.028 3.643 3.643a.444.444 0 0 1-.144.728.44.44 0 0 1-.486-.098l-3.64-3.64a.82.82 0 0 0-1.335.263.81.81 0 0 0 .178.89l1.535 1.534 2.287 2.288a.445.445 0 0 1-.63.63l-2.287-2.288a.813.813 0 0 0-1.393.578c0 .216.086.424.238.577l4.403 4.403c2.79 2.79 5.495 4.119 8.681.931 2.269-2.271 2.708-4.588 1.342-7.086z"></path>
                    </svg>
                </button> 
            </div>
            <div className="text-gray-600 hover:text-gray-950 text-sm pt-0.5 ml-1">{likeCountFormatter.format(claps)}</div>
        </div>
    )
})
export function useSearchClapDebounce(blogId:string, likes: number, firstRender: boolean, setFirstRender: React.Dispatch<React.SetStateAction<boolean>>, setBlogs:  SetterOrUpdater<Blog | null>){
    useEffect(() => {
        if (firstRender){
            setFirstRender(false)
        } else{
            const timeout = setTimeout(async() => {
            axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/likesUpdate",{
                    blogId,
                    likes
                }, {
                    headers: {
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                }).then(() => {
                    setBlogs(p => {
                        if (p) {
                            return {
                                ...p, likes : likes+1
                            }
                        } else {
                            return null;
                        }
            })
                })
                
            }, 1000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [likes])
}
