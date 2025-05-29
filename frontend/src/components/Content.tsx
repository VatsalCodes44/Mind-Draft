import { memo } from "react";


const Content = memo(({content}: {content: string}) => {
    return (
        <div className="text-md sm:text-lg md:text-xl mx-2" dangerouslySetInnerHTML={{ __html: content }}/>
    )
})

export default Content;