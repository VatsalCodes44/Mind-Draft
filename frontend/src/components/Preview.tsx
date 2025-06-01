import { memo } from "react";
import Content from "./Content";
import { useRecoilValue } from "recoil";
import { htmlContent, getImage as img, title as t } from "../store/blogUploadEdit/atom";


const Preview = memo(() => {
    const title = useRecoilValue(t)
    const image = useRecoilValue(img)
    const content = useRecoilValue(htmlContent)
    return (
            <div className="">
                <div className="mt-8">
                    <div className=" font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        {title}
                    </div>
                </div>
                
                <div className="mt-10 ">
                    {image ? <img src={URL.createObjectURL(image)} className=" w-full h-auto rounded-2xl border-2 border-gray-100"/> : null}
                </div>

                <div className="mt-10">
                    <Content content={content}/>
                </div>
                
            </div>
    )
})

export default Preview;