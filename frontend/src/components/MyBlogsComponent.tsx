import { memo, useEffect, useState } from "react";
import { getMyBlogsObjectAtom, getMyImagesObjectAtom, isMyFirstBlogsBundleSet as MyFirstBlogsBundleSet, myBlogAtomFamily, myImageAtomFamily } from "../store/blogs/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import MyPagination from "./MyPagination";


const MyBlogsComponent = memo(({homeDraftsLibrary}: {homeDraftsLibrary: "home" | "drafts"}) => {
    const [requestNumber, setRequestNumber] = useState<number>(1)
    const myFirstBlogs = useRecoilValue(getMyBlogsObjectAtom)
    const myFirstImages = useRecoilValue(getMyImagesObjectAtom)
    const setMyBlogAtomFamily = useSetRecoilState(myBlogAtomFamily(1))   
    const setMyImagesAtomFamily = useSetRecoilState(myImageAtomFamily(1)) 
    const [isMyFirstBlogsBundleSet, setIsMyFirstBlogsBundleSet] = useRecoilState(MyFirstBlogsBundleSet)
    useEffect(() => {
        if (!isMyFirstBlogsBundleSet) {
            setMyBlogAtomFamily(myFirstBlogs)
            setMyImagesAtomFamily(myFirstImages)
            setIsMyFirstBlogsBundleSet(true)
        }
    }, [])

    return(
        <MyPagination requestNumber={requestNumber} setRequestNumber={setRequestNumber} homeDraftsLibrary={homeDraftsLibrary} />
    )
})

export default MyBlogsComponent;