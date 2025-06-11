import { memo, useEffect, useState } from "react";
import { isSearchedUserFirstBlogsBundleSet, searchedUserImageAtomFamily, searchedUserAtomFamily, searchedUserBlogsObjectAtom, searchedUserImagesObjectAtom } from "../store/blogs/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import SearchedUserPagination from "./SearchedUserPagination";


const SearchedUserBlogsComponent = memo(({homeDraftsLibrary, userId}: {homeDraftsLibrary: "home" | "drafts", userId: string}) => {
    const [requestNumber, setRequestNumber] = useState<number>(1)
    const userFirstBlogs = useRecoilValue(searchedUserBlogsObjectAtom)
    const userFirstImages = useRecoilValue(searchedUserImagesObjectAtom)
    const setUserBlogAtomFamily = useSetRecoilState(searchedUserAtomFamily(1))   
    const setUserImagesAtomFamily = useSetRecoilState(searchedUserImageAtomFamily(1)) 
    const [isSearchedUserBlogsBundleSet, setIsSearcheduserBlogsBundleSet] = useRecoilState(isSearchedUserFirstBlogsBundleSet)
    useEffect(() => {
        if (!isSearchedUserBlogsBundleSet) {
            setUserBlogAtomFamily(userFirstBlogs)
            setUserImagesAtomFamily(userFirstImages)
            setIsSearcheduserBlogsBundleSet(true)
        }
    }, [])

    return(
        <SearchedUserPagination requestNumber={requestNumber} setRequestNumber={setRequestNumber} homeDraftsLibrary={homeDraftsLibrary} userId={userId} />
    )
})

export default SearchedUserBlogsComponent;