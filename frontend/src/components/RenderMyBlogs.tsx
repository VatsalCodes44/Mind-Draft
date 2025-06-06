import { useRecoilValue } from "recoil";
import { myBlogAtomFamily } from "../store/blogs/atom";
import { memo } from "react";
import MyBlogCard from "./MyBlogCard";
import { BlogsLoaderChild } from "./BlogsLoader";

const RenderMyBlogs = memo(({homeDraftsLibrary, atomNumber}: {homeDraftsLibrary: "home" | "drafts" | "library", atomNumber: number}) => {
    const myBlogsObject = useRecoilValue(myBlogAtomFamily(atomNumber))
    return (
            <div className=" mx-auto w-full ">
                {
                Object.keys(myBlogsObject).map((id) => {
                    return (
                        <div key={`${myBlogsObject[id]}${id}`}>
                            <MyBlogCard myBlog={myBlogsObject[id]} homeDraftsLibrary={homeDraftsLibrary} atomNumber={atomNumber} />
                        </div>
                    )
                })  
                }

            </div>
    )
            
})
export default RenderMyBlogs;