import { memo, useEffect, useRef } from "react";
import { commentAtomFamily, commentImageAtomFamily, numberOfCommentsFetched } from "../store/blogs/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import RenderComments from "./RenderComments";

type Comment = {
    id: number,
    authorId: string;
    date: string;
    comment: string;
    Commentor: {
        name: string;
    }
}
const CommentsPagination = memo(({ commentRequestNumber, setCommentRequestNumber , blogId, totalComments}: { commentRequestNumber: number, setCommentRequestNumber: React.Dispatch<React.SetStateAction<number>>, blogId: string, totalComments: number }) => {
    const currentComments = useRecoilValue(commentAtomFamily(commentRequestNumber));
    const setNextComments = useSetRecoilState(commentAtomFamily(commentRequestNumber + 1));
    const setNextCommentorImages = useSetRecoilState(commentImageAtomFamily(commentRequestNumber + 1))
    const [commentsFetched, setCommentsFetched] = useRecoilState(numberOfCommentsFetched) 
    const fetching = useRef(false)

    const onBottomReach = async () => {
        if (fetching.current) return;
        fetching.current = true;
        console.log("resolved")
            console.log(commentsFetched)
            console.log(totalComments)
            try {
                const cursor = currentComments[currentComments.length - 1].id
                const response = await axios.get(`http://localhost:8787/api/v1/blog/getNextComments?cursor=${cursor}`, {
                    headers: {
                        blogId,
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                })
                if (response){
                    const comments: Comment[] = response.data
        
                    const commentorIds = comments.map(comment => {
                        return comment.authorId
                    })
                    console.log("djnkjkc", commentorIds)
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
                        setNextComments(comments)
                        setNextCommentorImages(commentorImages)
                        setCommentRequestNumber(p => p + 1)
                        console.log(commentsFetched)
                        setCommentsFetched( p=> p +comments.length)
                    }
                }
            } catch {
            } finally {
                fetching.current = false
            }

    }

    const pagination = () => {
        if (fetching.current) return;
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (totalComments == 0) return;
        if (totalComments > commentsFetched){
            if (scrollPosition + windowHeight >= documentHeight - 20) {
                onBottomReach();
            }
        } else {
            return
        }
    }
    
    useEffect(() => {
        window.addEventListener("scroll", pagination);
        return () => {
            window.removeEventListener("scroll", pagination);
        };
    }, [pagination, onBottomReach]);

    return (
        <div>
            {Array.from({ length: commentRequestNumber }, (_, i) => (
                <RenderComments key={i} commentAtomNumber={i + 1} />
            ))}
        </div>
    )
})

export default CommentsPagination;