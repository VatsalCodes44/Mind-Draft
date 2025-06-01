import { useRecoilValue } from "recoil";
import {  getMyBlogsObjectAtom } from "../store/blogs/atom";
import { memo } from "react";
import MyBlogCard from "./MyBlogCard";


const MyBlogs = memo(({homeDraftsLibrary}: {homeDraftsLibrary: string}) => {
    const blogsObject = useRecoilValue(getMyBlogsObjectAtom)
    return (
        <div className="">
            <div className=" mx-auto w-full ">
                {
                Object.keys(blogsObject).map((id) => {
                    return (
                        <div key={blogsObject[id].id}>
                            <MyBlogCard blog={blogsObject[id]} homeDraftsLibrary={homeDraftsLibrary}/>
                        </div>
                    )
                })  
                }
            </div>
        </div>
    )
            
})
export default MyBlogs;