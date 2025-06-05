import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {  getMyBlogsObjectAtom, getMyImagesObjectAtom, imagesFetch } from "../store/blogs/atom";
import { memo, useEffect } from "react";
import MyBlogCard from "./MyBlogCard";
import axios from "axios";

const MyBlogs = memo(({homeDraftsLibrary}: {homeDraftsLibrary: string}) => {
    const myBlogsObject = useRecoilValue(getMyBlogsObjectAtom)
    return (
        <div className="">
            <div className=" mx-auto w-full ">
                {
                Object.keys(myBlogsObject).map((id) => {
                    return (
                        <div key={myBlogsObject[id].id}>
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