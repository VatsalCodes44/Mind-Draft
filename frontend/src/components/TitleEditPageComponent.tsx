import { memo, useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { title } from "../store/blogUploadEdit/atom";


const TitleEditPageComponent = memo(({editTitle}: {editTitle: string}) => {
    const setTitle = useSetRecoilState(title)
    const [text, setText] = useState(editTitle);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Adjust height on content change
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
        textarea.style.height = 'auto'; // reset first
        textarea.style.height = `${textarea.scrollHeight}px`; // set to scroll height
        }
    };

    useEffect(() => {
        adjustHeight(); // initial run
    }, [text]);

    return (
        <textarea 
        ref={textareaRef}
        value = {text}
        rows={1}
        style={{ minHeight: '2.5rem' }}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value)
        setText(e.target.value)
        }} 
        className=" border-b-1 border-slate-300 pt-3 resize-none overflow-hidden w-full text-4xl font-bold px-4 h-15 placeholder:text-4xl placeholder:text-gray-300 focus:outline-none" />
    )
})

export default TitleEditPageComponent;