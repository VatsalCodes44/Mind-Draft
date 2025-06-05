import { memo, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { userInfo as uInfo } from "../store/userInfo/atom";


const EditAbout = memo(() => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [userInfo, setUserInfo] = useRecoilState(uInfo)
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
    }, [userInfo]);

    return (
        <div className="border-1 border-gray-300 p-2 rounded-md">
            <textarea 
            ref={textareaRef}
            value={userInfo.aboutMe}
            rows={1}
            style={{ minHeight: '5rem' }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setUserInfo(p => {
                return {
                    ...p, aboutMe: e.target.value
                }
            })
            }} 
            placeholder="About me" 
            className="resize-none overflow-hidden w-full text-lg font-semibold placeholder:text-xl rounded-md placeholder:text-gray-300 focus:outline-none" />
            <div className="flex justify-end">
                <button onClick={() => {
                    setUserInfo(p => {
                        return {
                            ...p, aboutMe: ""
                        }
                    })
                }} className="text-white text-sm bg-gray-700 hover:cursor-pointer hover:bg-gray-950 rounded-full px-3 py-1"> Clear </button>
            </div>
        </div>
            
    )
})

export default EditAbout;