import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { blogAtomFamily, getBlogsObjectAtom, isFirstBlogsBundleSet as FirstBlogsBundleSet, imageAtomFamily, getImagesObjectAtom, authorImageAtomFamily, getAuthorImagesObjectAtom } from "../store/blogs/atom";
import { memo, useEffect, useState } from "react";
import Pagination from "./Pagination";


const BlogsComponent = memo(() => {
    const [requestNumber, setRequestNumber] = useState<number>(1);
    const firstBlogs = useRecoilValue(getBlogsObjectAtom)
    const firstImages = useRecoilValue(getImagesObjectAtom)
    const firstAuthorimages = useRecoilValue(getAuthorImagesObjectAtom)
    const setBlogAtomFamily = useSetRecoilState(blogAtomFamily(1))
    const setImagesAtomFamily = useSetRecoilState(imageAtomFamily(1))
    const setAuthorImagesAtomFamily = useSetRecoilState(authorImageAtomFamily(1))
    const [isFirstBlogsBundleSet, setIsFirstBlogsBundleSet] = useRecoilState(FirstBlogsBundleSet)
    useEffect(() => {
        if (!isFirstBlogsBundleSet){
            setBlogAtomFamily(firstBlogs)
            setImagesAtomFamily(firstImages)
            setAuthorImagesAtomFamily(firstAuthorimages)
            setIsFirstBlogsBundleSet(true)
        }
    }, [])
    
    return(
        <Pagination requestNumber={requestNumber} setRequestNumber={setRequestNumber} />
    )
            
})
export default BlogsComponent;