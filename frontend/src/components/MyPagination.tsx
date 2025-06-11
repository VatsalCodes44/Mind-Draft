import { memo, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { myBlogAtomFamily, myImageAtomFamily } from "../store/blogs/atom";
import axios from "axios";
import RenderMyBlogs from "./RenderMyBlogs";


const MyPagination = memo(({ requestNumber, setRequestNumber, homeDraftsLibrary }: { requestNumber: number, setRequestNumber: React.Dispatch<React.SetStateAction<number>>, homeDraftsLibrary: "home" | "drafts"}) => {
    const mycurrentBlogObject = useRecoilValue(myBlogAtomFamily(requestNumber));
    const setMyNextBulkBlogObject = useSetRecoilState(myBlogAtomFamily(requestNumber + 1));
    const setMyNextBulkImageObject = useSetRecoilState(myImageAtomFamily(requestNumber + 1))
    const fetching = useRef(false)

    const onBottomReach = async () => {
        if (fetching.current) return;
        fetching.current = true;
        try {
            const keys = Object.keys(mycurrentBlogObject);
            if(keys.length === 0) return;

            const cursor = keys[keys.length - 1]
            const response = await axios.get(`https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/myBulk?cursor=${cursor}`, {
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                },
                responseType: "json"
            })
            const myBlogs = response.data;

            const myBlogIds = Object.keys(myBlogs).filter(id => myBlogs[id]?.imageExist);
            const response2 = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/images", {
                blogIds: myBlogIds,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            })
            const myImages = response2.data;

            setMyNextBulkBlogObject(myBlogs)
            setMyNextBulkImageObject(myImages)
            setRequestNumber(p => p + 1)
        } catch (error) {
            setMyNextBulkBlogObject({})
            setMyNextBulkImageObject({})
        } finally {
            fetching.current = false;
        }
    }

    const pagination = () => {
        if (fetching.current) return;
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition + windowHeight >= documentHeight - 200) {
            onBottomReach();
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", pagination);
        return () => {
            window.removeEventListener("scroll", pagination)
        }
    }, [pagination, onBottomReach])

    return (
        <div className="">
            {
                [...Array(requestNumber)].map((_,i) => {
                    return <RenderMyBlogs key={i} atomNumber = {i+1} homeDraftsLibrary={homeDraftsLibrary} />
                })
            }
        </div>
    )
})

export default MyPagination;