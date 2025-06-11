import { useRecoilValue } from "recoil"
import { myImageAtomFamily } from "../store/blogs/atom"
import { memo } from "react"


const MyBlogsImage = memo(({myBlogId, atomNumber}: {myBlogId: string, atomNumber: number}) => {
    const images = useRecoilValue(myImageAtomFamily(atomNumber))
    return (
    <div>
        {images[myBlogId] ? <div><img src={images[myBlogId].image} className="h-15 w-25 sm:h-20 sm:w-33 md:h-25 md:w-41 rounded-sm" alt="" /></div> : <div></div>}
    </div>
)
})

export default MyBlogsImage;