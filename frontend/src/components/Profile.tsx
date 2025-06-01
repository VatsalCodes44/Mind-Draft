import { memo, useEffect, useRef, useState } from "react";


const Profile = memo(({color}: {color:string}) => {
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

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-between">

            <div className="flex gap-4">
                <div className={`hover:cursor-pointer w-10 h-10 sm:w-13 sm:h-13 rounded-full flex justify-center items-center text-lg sm:text-3xl text-white lg:hidden`} style={{background: color}} >
                    {/* {oneBlog.author.name[0].toUpperCase()} */}
                    V
                </div>

                <div>
                    <div className="w-full text-lg sm:text-2xl flex justify-center items-center font-semibold text-slate-900 lg:text-4xl lg:font-semibold">
                        {"Vatsal mahajan"}
                    </div>
                    <div className="text-gray-700 lg:hidden text-sm sm:text-md">
                        {2} followers
                    </div>
                </div>
            </div>

            <div ref={buttonRef} className="lg:hidden" onClick={() => {
                            setDropDown(p => !p);
                }}>
                <div className="flex justify-center items-center hover:cursor-pointer ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-7 text-gray-600">
                        <path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
            </div>
            <div ref={dropDownElement}
            className={`
                hover:cursor-pointer
                absolute right-2 z-10 mt-4 w-60 rounded-xs bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden 
                transform transition-all duration-300 ease-out text-gray-700
                // ${dropDown ? "opacity-100 translate-y-2" : "opacity-0 -translate-y-2 pointer-events-none"}
            `}
            role="menu">
                <div className="flex justify-start pl-5 py-3 gap-4 items-center ">
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

                <div className="flex justify-start pl-5 py-3 gap-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="w-5 h-5 rounded"
                    aria-label="Stories">
                    <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span>
                        Change profile photo
                    </span>
                </div>

            </div>
    </div>
    )
})

export default Profile;