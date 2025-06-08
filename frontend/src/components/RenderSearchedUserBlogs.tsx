import { useRecoilValue } from "recoil";
import { searchedUserAtomFamily } from "../store/blogs/atom";
import { memo } from "react";
import SearchedBlogCard from "./SearchedBlogCard";

const RenderSearchedUserBlogs = memo(({homeDraftsLibrary, atomNumber}: {homeDraftsLibrary: "home" | "drafts", atomNumber: number}) => {
    const userBlogsObject = useRecoilValue(searchedUserAtomFamily(atomNumber))
    return (
            <div className=" mx-auto w-full ">
                {
                Object.keys(userBlogsObject).map((id) => {
                    return (
                        <div key={`${userBlogsObject[id]}${id}`}>
                            <SearchedBlogCard userBlog={userBlogsObject[id]} homeDraftsLibrary={homeDraftsLibrary} atomNumber={atomNumber} />
                        </div>
                    )
                })  
                }

            </div>
    )
            
})
export default RenderSearchedUserBlogs;