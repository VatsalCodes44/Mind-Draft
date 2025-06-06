import { memo, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { myBlogAtomFamily, myImageAtomFamily } from "../store/blogs/atom";
import axios from "axios";
import RenderMyBlogs from "./RenderMyBlogs";
import { BlogsLoaderChild } from "./BlogsLoader";


const MyPagination = memo(({ requestNumber, setRequestNumber, homeDraftsLibrary }: { requestNumber: number, setRequestNumber: React.Dispatch<React.SetStateAction<number>>, homeDraftsLibrary: "home" | "drafts" | "library" }) => {
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
            const response = await axios.get(`http://127.0.0.1:8787/api/v1/blog/myBulk?cursor=${cursor}`, {
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                },
                responseType: "json"
            })
            const myBlogs = response.data;

            const myBlogIds = Object.keys(myBlogs).filter(id => myBlogs[id]?.imageExist);
            console.log(myBlogIds)
            const response2 = await axios.post("http://127.0.0.1:8787/api/v1/blog/images", {
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
            console.log("Failed to fetch blogs:", error)
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
            <div className="sm:mx-16 md:mx-16 lg:mx-0">
                <BlogsLoaderChild/>
            </div>
        </div>
    )
})

export default MyPagination;