import { memo, useRef } from "react";
import randomColor from "./randomColor";
import date from "./date"
import { useRecoilValue } from "recoil";
import { commentImageAtomFamily } from "../store/blogs/atom";
import { useNavigate } from "react-router-dom";

type Comment = {
    authorId: string;
    date: string;
    comment: string;
    Commentor: {
        name: string;
    }
}
const Comments = memo(({comment, commentAtomNumber}: {comment: Comment, commentAtomNumber: number }) => {
    const images = useRecoilValue(commentImageAtomFamily(commentAtomNumber))
    const color = useRef<string>(randomColor())
    const commentAuthorImage = images[comment.authorId]
    const navigate = useNavigate()
    return (
        <div className="border-b-1 border-gray-100 pb-8 mb-8">
            <div className=" flex"> 
                <div className={`hover:cursor-pointer mr-3 w-9 h-9 text-center rounded-full flex justify-center`} style={{background: randomColor()}} >
                    {commentAuthorImage ? <CommentorImage image={commentAuthorImage.image} /> : <ImageNotExist username={comment.Commentor.name[0].toUpperCase()} color={color.current} />}
                </div>
                <div className=" text-md ">
                    <div className="flex ">
                        <div onClick={() => {
                            navigate(`/searchUser?userId=${comment.authorId}`)
                        }} className="font-semibold text-slate-900 hover:underline hover:decoration-gray-900 hover:cursor-pointer">
                            {comment.Commentor.name}
                        </div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium flex mb-4">
                        <div>
                            {date(comment.date)}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {comment.comment}
            </div>
        </div>
    )
})

export default Comments;

const CommentorImage = memo(({image}: {image: string }) => {
    return (
        <img src={image} className="w-full h-full rounded-full" />
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