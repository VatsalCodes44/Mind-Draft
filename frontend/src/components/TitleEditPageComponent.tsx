import { memo, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { editBlog as eBlog } from "../store/blogUploadEdit/atom";


const TitleEditPageComponent = memo(() => {
    const [editBlog, setEditBlog] = useRecoilState(eBlog)
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
    }, [editBlog.title]);

    return (
        <textarea 
        ref={textareaRef}
        value = {editBlog.title}
        rows={1}
        style={{ minHeight: '2.5rem' }}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditBlog(p => ({...p, title: e.target.value}))
        }} 
        className=" border-b-1 border-slate-300 pt-3 resize-none overflow-hidden w-full text-4xl font-bold px-4 h-15 placeholder:text-4xl placeholder:text-gray-300 focus:outline-none" />
    )
})

export default TitleEditPageComponent;