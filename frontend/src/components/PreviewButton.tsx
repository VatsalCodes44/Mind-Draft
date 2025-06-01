import { memo } from "react";
import { useSetRecoilState } from "recoil";
import { htmlContent, preview } from "../store/blogUploadEdit/atom";


const PreviewButton = memo( () => {
    const setHtmlContent = useSetRecoilState(htmlContent)
    const setPreview = useSetRecoilState(preview)
    const previewHandle = () => {
        const editorValue = document.querySelector(".ContentEditable__root")
        const htmlString = editorValue?.innerHTML ?? "";
        setHtmlContent(htmlString)
        setPreview("preview")
    }
    return (
        <div onClick={previewHandle} className="text-white text-lg bg-green-600 hover:bg-green-700 mx-2 rounded-full py-2 px-3">
            <button >Preview</button>
        </div>
    )
})

export default PreviewButton;