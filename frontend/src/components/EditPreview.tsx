import { memo } from "react";
import Content from "./Content";
import { useRecoilValue } from "recoil";
import { editBlog as eBlog, editImage, htmlContent } from "../store/blogUploadEdit/atom";


const EditPreview = memo(() => {
    const image = useRecoilValue(editImage);
    const editBlog = useRecoilValue(eBlog)
    const content = useRecoilValue(htmlContent)
    return (
            <div className="">
                <div className="mt-8">
                    <div className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        {editBlog.title}
                    </div>
                </div>
                
                <div className="mt-10 ">
                    {image ? <img src={image ? image : ""} className=" w-full h-auto rounded-2xl border-2 border-gray-100"/> : null}
                </div>

                <div className="mt-10">
                    <Content content={content}/>
                </div>
                
            </div>
    )
})

export default EditPreview;