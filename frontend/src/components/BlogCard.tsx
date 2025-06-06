import { useNavigate } from "react-router-dom"
import BlogsImage from "./BlogsImage";
import { memo, Suspense, useRef } from "react";
import ImageLoader from "./ImageLoader";
import date from "./date";
import randomColor from "./randomColor";
import { useRecoilValue } from "recoil";
import { authorImageAtomFamily } from "../store/blogs/atom";


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

const BlogCard = memo(({blog, atomNumber}: {blog: Blog, atomNumber: number}) => {
    const navigate = useNavigate()
    const color = useRef<string>(randomColor())
    const authorImages = useRecoilValue(authorImageAtomFamily(atomNumber))
    const likeCountFormatter = new Intl.NumberFormat('en', {
        notation: "compact",
        compactDisplay: "short",
    });


    return (
        <div className=" flex justify-center mt-4">
            <div className="max-w-3xl w-full mx-8 sm:mx-16 md:mx-16 lg:mx-0 border-b-1 border-slate-100 mt-4 pb-6 hover:cursor-pointer">
                <div className="flex text-sm">
                    <div className="h-6 w-6 text-xs mr-2 rounded-full">
                            {authorImages[blog.authorId] ? <Image profilePic={authorImages[blog.authorId].image}/> : <ImageNotExist username={blog.author.name.trim()[0].toUpperCase()} color={color.current}/>}
                    </div>
                    <div className="font-mono font-thin hover:underline hover:underline-offset-2 pt-0.5">
                        {blog.author.name.length > 15 ? `${blog.author.name.slice(0,15)}.` : blog.author.name } 
                    </div>
                </div>
                <div className="grid grid-cols-6 mt-2 hover:cursor-pointer" onClick={ () => {
                    navigate(`/blog?blogId=${blog.id}&number=${atomNumber}`)
                    window.scrollTo(0,0);
                }}>
                    <div className="col-span-4 ">
                        <div className="text-md sm:text-lg md:text-2xl text-gray-800 font-bold">
                            {blog.title.length >= 94 ? `${blog.title.slice(0,94)}...` : blog.title}
                        </div>
                        <div className="mt-2 font-medium text-xs sm:text-sm md:text-md text-gray-600">
                            {blog.summary.length >= 120 ? `${blog.summary.slice(0,120)}...` : blog.summary}
                        </div>
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <div>
                            {blog.imageExist ? 
                            <Suspense fallback={<ImageLoader />} >
                                <BlogsImage blogId={blog.id} atomNumber={atomNumber} />
                            </Suspense> : <div></div>}
                        </div>
                    </div>
                </div>
                <div onClick={ () => {
                    navigate(`/blog?blogId=${blog.id}&number=${atomNumber}`)
                    window.scrollTo(0,0);
                }}
                className=" flex mt-5 text-slate-600 text-xs font-semibold">
                    <div className=" ml-4 mt-1 ">
                        {date(blog.date)}
                    </div> 
                    <div className="flex justify-evenly gap-1 ">
                        <div>
                            <svg className="  mt-1 ml-5 h-4 w-4" viewBox="0 0 16 16">
                                <path fill="#6B6B6B" d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"></path>
                            </svg>
                        </div>
                        <div className="mt-1">{likeCountFormatter.format(blog.likes)}</div>
                    </div>
                    <div className="gap-1 flex">
                        <div className="ml-5 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className=" text-gray-500 h-4 w-4">
                                <path  d="M1 8c0-3.43 3.262-6 7-6s7 2.57 7 6-3.262 6-7 6c-.423 0-.838-.032-1.241-.094-.9.574-1.941.948-3.06 1.06a.75.75 0 0 1-.713-1.14c.232-.378.395-.804.469-1.26C1.979 11.486 1 9.86 1 8Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="mt-1">{blog.numberOfComments}</div>
                    </div>
                </div>
            </div>
        </div>
    )
})


export default BlogCard;

const Image = memo(({profilePic}: {profilePic: File | string }) => {
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
{/* <div className="h-6 w-6 text-xs mr-2 rounded-full">
        {authorImages[blog.authorId] ? <Image profilePic={authorImages[blog.authorId].image}/> : <ImageNotExist username={blog.author.name.trim()[0].toUpperCase()} color={color.current}/>}
</div> */}