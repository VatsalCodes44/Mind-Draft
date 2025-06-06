import { memo, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authorImageAtomFamily, blogAtomFamily, imageAtomFamily } from "../store/blogs/atom";
import axios from "axios";
import RenderBlogs from "./RenderBlogs";
import { BlogsLoaderChild } from "./BlogsLoader";

const Pagination = memo(({ requestNumber, setRequestNumber }: { requestNumber: number, setRequestNumber: React.Dispatch<React.SetStateAction<number>> }) => {
    const currentBlogObject = useRecoilValue(blogAtomFamily(requestNumber));
    const setNextBulkBlogObject = useSetRecoilState(blogAtomFamily(requestNumber + 1));
    const setNextBulkImageObject = useSetRecoilState(imageAtomFamily(requestNumber + 1));
    const setNextbulkAuthorImageObject = useSetRecoilState(authorImageAtomFamily(requestNumber + 1));
    const fetching = useRef(false);

    const onBottomReach = async () => {
        if (fetching.current) return;
        fetching.current = true;
        try {
            const keys = Object.keys(currentBlogObject);
            if (keys.length === 0) return;

            const cursor = keys[keys.length - 1];
            const response = await axios.get(`http://127.0.0.1:8787/api/v1/blog/bulk?cursor=${cursor}`, {
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                },
                responseType: "json"
            });

            const blogs = response.data;

            const blogIds = Object.keys(blogs).filter(id => blogs[id]?.imageExist);
            const response2 = await axios.post("http://127.0.0.1:8787/api/v1/blog/images", {
                blogIds,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            });

            const images = response2.data;

            const authorIds = Object.values(response2).map(blog => blog.authorId);
            const response3 = await axios.post("http://127.0.0.1:8787/api/v1/blog/images", {
                blogIds: authorIds,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            });

            const authorImages = response3.data;

            setNextBulkBlogObject(blogs);
            setNextBulkImageObject(images);
            setNextbulkAuthorImageObject(authorImages);
            setRequestNumber(p => p + 1);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
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
            window.removeEventListener("scroll", pagination);
        };
    }, [pagination, onBottomReach]);

    return (
        <div>
            {
                [...Array(requestNumber)].map((_, i) => (
                    <RenderBlogs key={i} atomNumber={i + 1} />
                ))
            }
            <div className="mx-8 sm:mx-16 md:mx-16 lg:mx-0">
                <BlogsLoaderChild />
            </div>
        </div>
    );
});

export default Pagination;
