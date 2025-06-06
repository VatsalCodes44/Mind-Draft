import { memo, useRef } from "react";
import randomColor from "./randomColor";


const UserProfile = memo(() => {
    const color = useRef<string>(randomColor())
    const profilePic = sessionStorage.getItem("profilePic")
    const username = sessionStorage.getItem("username")
    const aboutMe = sessionStorage.getItem("aboutMe")
      
    return (
        <div className="text-block">
            <div className="flex justify-center">
                {profilePic ? <Image profilePic={profilePic}/> : <ImageNotExist username={username ? username.trim()[0].toUpperCase() : ""} color={color.current} />}
            </div>
            <div className="flex gap-2 mt-4 text-lg font-semibold font-mono">
                {username}
            </div>
            <div className={` mt-4 `}>
                {aboutMe}
            </div>
            
        </div>
    )
})

const Image = memo(({profilePic}: {profilePic: File | string }) => {
    if (profilePic instanceof(File)){
        profilePic = URL.createObjectURL(profilePic);
    }
    return (
        <img src={profilePic} className="h-40 w-40 rounded-full" />
    )
})

const ImageNotExist = memo(({username, color}:{username: string, color: string}) => {
    return(
        <div className="h-30 w-30 rounded-full text-white text-4xl flex justify-center items-center" style={{background: color}}>
                {username}
        </div>
    )
})

export default UserProfile;