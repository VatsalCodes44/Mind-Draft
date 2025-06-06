import { useRecoilValue } from "recoil";
import { myImageAtomFamily } from "../store/blogs/atom";
import { memo } from "react";


const MyImage = memo(({myBlogId, atomNumber}: {myBlogId: string, atomNumber: number}) => {
    const myBlogsImage = useRecoilValue(myImageAtomFamily(atomNumber))

    return <img src={myBlogsImage[myBlogId].image} alt="loading" className=" w-full h-auto rounded-2xl"/>
})

export default MyImage;