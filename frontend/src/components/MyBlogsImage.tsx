import { useRecoilValue } from "recoil"
import { getMyImagesObjectAtom } from "../store/blogs/atom"
import { memo } from "react"


const MyBlogsImage = memo(({blogId}: {blogId: string}) => {
    const images = useRecoilValue(getMyImagesObjectAtom)
    return <div><img src={images[blogId].image} className="h-15 w-25 sm:h-20 sm:w-33 md:h-25 md:w-41 rounded-sm" alt="" /></div>
})

export default MyBlogsImage;