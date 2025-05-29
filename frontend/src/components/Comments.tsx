import { memo } from "react";
import randomColor from "./randomColor";
import date from "./date"

type Comment = {
    authorId: string;
    date: string;
    comment: string;
    Commentor: {
        name: string;
    }
}
const Comments = memo(({comment}: {comment: Comment }) => {
   
    return (
        <div className="border-b-1 border-gray-100 pb-8 mb-8">
            <div className=" flex"> 
                <div className={`hover:cursor-pointer mr-3 w-9 h-9 text-center p-5 rounded-full flex justify-center`} style={{background: randomColor()}} >
                    <div className="flex flex-col justify-center text-white text-lg">
                        {comment.Commentor.name[0]}
                    </div>
                </div>
                <div className=" text-md ">
                    <div className="flex ">
                        <div className="font-semibold text-slate-900 hover:underline hover:decoration-gray-900 hover:cursor-pointer">
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