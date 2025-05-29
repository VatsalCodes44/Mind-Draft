import { memo } from "react";
import Preview from "./Preview";


const PreviewCard = memo(() => {
    return(
        <div className="shadow-sm shadow-gray-200">
            <Preview />
        </div>
    )
})

export default PreviewCard;