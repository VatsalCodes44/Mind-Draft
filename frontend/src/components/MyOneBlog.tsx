import randomColor from "./randomColor";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { commentAtomFamily, commentImageAtomFamily, myBlogAtomFamily, numberOfCommentsFetched } from "../store/blogs/atom";
import date from "./date";
import { memo, useEffect, useRef, useState } from "react";
import axios from "axios";
import MyImage from "./MyImage";
import MyClap from "./MyClap";
import MyCommentUpload from "./MyCommentUpload";
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

const MyOneBlog = memo(({ myBlogId, atomNumber }: {myBlogId: string, atomNumber: number}) => {
    const color = useRef<string>(randomColor())
    const ref1 = useRef<HTMLDivElement>(null);
    const myBlogs = useRecoilValue(myBlogAtomFamily(atomNumber));
    const profilePic = sessionStorage.getItem("profilePic")
    const username = sessionStorage.getItem("username")
    const [commentRequestNumber, setCommentRequestNumber] = useState<number>(1)
    const setFirstComments = useSetRecoilState(commentAtomFamily(1))
    const setFirstCommentorsImages = useSetRecoilState(commentImageAtomFamily(1))
    const setCommentsFetched = useSetRecoilState(numberOfCommentsFetched)
    // const [isFirstCommentsBundleSet, setIsFirstCommentsBundleSet] = useRecoilState(FirstCommentsBundleSet)
    const isFirstCommentsBundleSet = useRef<boolean>(false)
    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await axios.get("http://localhost:8787/api/v1/blog/getFirstComments", {
                    headers: {
                        blogId: myBlogId,
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                })
                if (response){
                    const comments: Comment[] = response.data
    
                    const commentorIds = comments.map(comment => {
                        return comment.authorId
                    })
                    const response2 = await axios.post("http://127.0.0.1:8787/api/v1/blog/images",{
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
    }, [])

    return (
            <div className="">
                <div className="">
                    <div className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        {myBlogs[myBlogId].title}
                    </div>
                </div>
                <div className=" flex my-8 ">
                    <div className="hover:cursor-pointer mr-3 text-center rounded-full flex justify-center items-center" >
                        <div className="h-9 w-9 text-md rounded-full">
                                {profilePic ? <AuthorImage profilePic={profilePic}/> : <ImageNotExist username={username ? username[0].toUpperCase() : ""} color={color.current}/>}
                        </div>
                    </div>
                    <div className="text-md ">
                        <div className="flex ">
                            <div className="font-mono text-slate-900 hover:underline hover:decoration-gray-900 hover:cursor-pointer">{myBlogs[myBlogId].author.name}</div>
                            <div className="ml-2 text-gray-500 font-bold">·</div>
                            <div className="ml-2 font-mono text-slate-900 underline hover:decoration-gray-900 hover:cursor-pointer">Follow</div>
                        </div>
                        <div className="text-sm text-slate-500 font-medium flex">
                            <div>
                                {date(myBlogs[myBlogId].date)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex py-2 border-y-1 border-gray-100 ">
                    <div>
                       <MyClap blogId={myBlogId} atomNumber={atomNumber} />
                    </div>
                    <div onClick={() => {
                        ref1.current?.scrollIntoView({behavior: "smooth"})
                    }} className="ml-5 flex hover:cursor-pointer group">
                        <div className="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="24" height="24" fill="none" className="mt-0.5 text-gray-600 group-hover:text-gray-950">
                                <path className="" stroke="currentColor" strokeWidth={0.5} d="M1 8c0-3.43 3.262-6 7-6s7 2.57 7 6-3.262 6-7 6c-.423 0-.838-.032-1.241-.094-.9.574-1.941.948-3.06 1.06a.75.75 0 0 1-.713-1.14c.232-.378.395-.804.469-1.26C1.979 11.486 1 9.86 1 8Z" fill="none"/>
                            </svg>
                        </div>
                        <div className="text-gray-600 text-sm mt-0.5 group-hover:text-gray-950">{myBlogs[myBlogId].numberOfComments}</div>
                    </div>
                </div>
                
                <div className={`mt-15`}>
                    {myBlogs[myBlogId].imageExist ? <MyImage myBlogId={myBlogId} atomNumber={atomNumber} /> : <div></div> }
                </div>
                <div className="mt-10 border-b-1 border-gray-100 pb-15 ">
                    <div className="text-md sm:text-lg md:text-xl mx-2" dangerouslySetInnerHTML={{ __html: myBlogs[myBlogId].content }}/>
                </div> 
                <div ref={ref1} className="mt-15 text-2xl font-semibold mb-10">
                    Responses ({myBlogs[myBlogId].numberOfComments})
                </div>
                <div className=" flex"> 
                    <div className={`hover:cursor-pointer mr-3 text-center rounded-full flex justify-center`} >
                        <div className="h-9 w-9 text-md rounded-full">
                                {profilePic ? <AuthorImage profilePic={profilePic}/> : <ImageNotExist username={username ? username[0].toUpperCase() : ""} color={color.current}/>}
                        </div>
                    </div>
                    <div className=" text-md font-mono mt-2">
                        {sessionStorage.getItem("username")}
                    </div>
                </div>
                <div className="border-b-1 border-gray-100 pb-8 mb-8 mt-6">
                    <MyCommentUpload blogId={myBlogId} atomNumber={atomNumber} />
                </div>
                <div>
                    <CommentsPagination commentRequestNumber={commentRequestNumber} setCommentRequestNumber={setCommentRequestNumber} blogId={myBlogId} totalComments={myBlogs[myBlogId].numberOfComments} />
                </div>
            </div>
    )
})

export default MyOneBlog;

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
{/* <div className="h-6 w-6 text-xs mr-2 rounded-full">
        {authorImages[blog.authorId] ? <Image profilePic={AuthorImages[blog.authorId].image}/> : <ImageNotExist username={blog.author.name.trim()[0].toUpperCase()} color={color.current}/>}
</div> */}