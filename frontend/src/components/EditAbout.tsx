import { memo, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";


const EditAbout = memo(({aboutMe, setAboutMe}: {aboutMe: string | undefined, setAboutMe: React.Dispatch<React.SetStateAction<string | undefined>>}) => {
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
    }, [aboutMe]);

    return (
        <div className="border-1 border-gray-300 p-2 rounded-md">
            <textarea 
            ref={textareaRef}
            value={aboutMe}
            rows={1}
            style={{ minHeight: '5rem' }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setAboutMe(e.target.value)
            }} 
            placeholder="About me" 
            className="resize-none overflow-hidden w-full text-lg font-semibold placeholder:text-xl rounded-md placeholder:text-gray-300 focus:outline-none" />
            <div className="flex justify-end">
                <button onClick={() => {
                    setAboutMe(undefined)
                }} className="text-white text-sm bg-gray-700 hover:cursor-pointer hover:bg-gray-950 rounded-full px-3 py-1"> Clear </button>
            </div>
        </div>
            
    )
})

export default EditAbout;