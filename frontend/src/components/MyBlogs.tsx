import { useRecoilValue } from "recoil";
import { getMyBlogsObjectAtom } from "../store/blogs/atom";
import { memo } from "react";
import MyBlogCard from "./MyBlogCard";

const MyBlogs = memo(({homeDraftsLibrary}: {homeDraftsLibrary: string}) => {
    const myBlogsObject = useRecoilValue(getMyBlogsObjectAtom)
    return (
        <div className="">
            <div className=" mx-auto w-full ">
                {
                Object.keys(myBlogsObject).map((id) => {
                    return (
                        <div key={`${myBlogsObject[id]}${id}`}>
                            <MyBlogCard myBlog={myBlogsObject[id]} homeDraftsLibrary={homeDraftsLibrary}/>
                        </div>
                    )
                })  
                }
            </div>
        </div>
    )
            
})
export default MyBlogs;