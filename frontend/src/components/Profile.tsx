import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


const Profile = memo(({color, edit, profilePic, username, aboutMe}: {color:string, edit: boolean, profilePic?: string | null, username?: string | null, aboutMe?: string | null}) => {
    const navigate = useNavigate()
    const [dropDown, setDropDown] = useState(false)
    const dropDownElement = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)
    const lastScroll = useRef<number> (0);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropDownElement.current && !dropDownElement.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node) && dropDown==true) {
                setDropDown(false);
            }
        }
        function handleScroll() {
            if (window.scrollY > lastScroll.current && window.scrollY > 10) {
                setDropDown(false);
            }
            lastScroll.current = window.scrollY;
        }
        if (edit){
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (edit){
                document.removeEventListener('mousedown', handleClickOutside);
            }
        };
    }, []);

    return (
        <div className="flex justify-between">

            <div>
                <div className="flex gap-4">
                    <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full " style={{background: color}} >
                        {profilePic ? <Image profilePic={profilePic}/> : <ImageNotExist username={ username ? username.trim()[0].toUpperCase() : "A"} color={color}/>}
                    </div>

                    <div className="flex items-center truncate">
                        <div className="w-full text-lg sm:text-2xl flex justify-center font-mono items-center font-semibold text-slate-900 lg:text-4xl lg:font-semibold">
                            {username}
                        </div>
                    </div>
                </div>
                <div className="lg:hidden font-semibold font-mono mt-6">
                    {aboutMe}
                </div>
            </div>

            <div ref={buttonRef} className={`${edit ? "" : "hidden"} lg:hidden`} onClick={() => {
                            setDropDown(p => !p);
                }}>
                <div className="flex justify-center items-center hover:cursor-pointer ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-7 text-gray-600">
                        <path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
            </div>
            <div ref={dropDownElement}
            className={` ${edit ? "" : "hidden"}
                hover:cursor-pointer
                absolute right-2 z-10 mt-4 w-60 rounded-xs bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden 
                transform transition-all duration-300 ease-out text-gray-700
                // ${dropDown ? "opacity-100 translate-y-2" : "opacity-0 -translate-y-2 pointer-events-none"}
            `}
            role="menu">
                <div onClick={() => {
                    navigate("/updateProfile")
                }}
                className="flex justify-start pl-5 py-3 gap-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="w-5 h-5"
                    aria-label="Stories">
                    <path  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    <span>
                        Edit Your Profile
                    </span>
                </div>
            </div>
    </div>
    )
})

const Image = memo(({profilePic}: {profilePic: string}) => {
    return (
        <img src={profilePic} className="w-full h-full rounded-full" />
    )
})

const ImageNotExist = memo(({username, color}:{username: string, color: string}) => {
    return(
        <div className="w-full h-full text-lg sm:text-3xl text-white rounded-full flex justify-center items-center" style={{background: color}}>
                {username}
        </div>
    )
})

export default Profile;