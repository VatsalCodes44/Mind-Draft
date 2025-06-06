import { memo } from "react";
import { useRecoilValue } from "recoil";
import { commentAtomFamily } from "../store/blogs/atom";
import Comments from "./Comments";

const RenderComments = memo(({commentAtomNumber}: {commentAtomNumber: number}) => {
    const comments = useRecoilValue(commentAtomFamily(commentAtomNumber))

    return (
        <div>
            {
                comments && comments.map(comment => {
                    return (
                        <Comments key={`${comment.id}${comment.comment}`} comment={comment} commentAtomNumber={commentAtomNumber} />
                    )
                })
            }
        </div>
    )
})

export default RenderComments;