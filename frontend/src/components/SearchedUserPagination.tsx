import { memo, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { searchedUserAtomFamily, searchedUserImageAtomFamily } from "../store/blogs/atom";
import axios from "axios";
import RenderSearchedUserBlogs from "./RenderSearchedUserBlogs";


const SearchedUserPagination = memo(({ requestNumber, setRequestNumber, homeDraftsLibrary, userId }: { requestNumber: number, setRequestNumber: React.Dispatch<React.SetStateAction<number>>, homeDraftsLibrary: "home" | "drafts", userId: string}) => {
    const userCurrentBlogObject = useRecoilValue(searchedUserAtomFamily(requestNumber));
    const setUserNextBulkBlogObject = useSetRecoilState(searchedUserAtomFamily(requestNumber + 1));
    const setUserNextBulkImageObject = useSetRecoilState(searchedUserImageAtomFamily(requestNumber + 1))
    const fetching = useRef(false)

    const onBottomReach = async () => {
        if (fetching.current) return;
        fetching.current = true;
        try {
            const keys = Object.keys(userCurrentBlogObject);
            if(keys.length === 0) return;

            const cursor = keys[keys.length - 1]
            const response = await axios.get(`https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/myBulk?cursor=${cursor}&&userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                },
                responseType: "json"
            })
            const userBlogs = response.data;

            const userBlogIds = Object.keys(userBlogs).filter(id => userBlogs[id]?.imageExist);
            const response2 = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/images", {
                blogIds: userBlogIds,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            })
            const userImages = response2.data;

            setUserNextBulkBlogObject(userBlogs)
            setUserNextBulkImageObject(userImages)
            setRequestNumber(p => p + 1)
        } catch (error) {
            setUserNextBulkBlogObject({})
            setUserNextBulkImageObject({})
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
                    return <RenderSearchedUserBlogs key={i} atomNumber = {i+1} homeDraftsLibrary={homeDraftsLibrary} />
                })
            }
        </div>
    )
})

export default SearchedUserPagination;