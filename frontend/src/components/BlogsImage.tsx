import { useRecoilValue } from "recoil"
import { imageAtomFamily } from "../store/blogs/atom"
import { memo } from "react"


const BlogsImage = memo(({blogId, atomNumber}: {blogId: string, atomNumber: number}) => {
    const images = useRecoilValue(imageAtomFamily(atomNumber))
    return <div>
            {images[blogId] ? <div><img src={images[blogId].image} className="h-15 w-25 sm:h-20 sm:w-33 md:h-25 md:w-41 rounded-sm" alt="" /></div> : <div></div>}
        </div>
})

export default BlogsImage;