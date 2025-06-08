import { memo } from "react";


const UserProfile = memo(({profilePic, username, aboutMe, color}: {profilePic: string | null, username: string | null, aboutMe: string | null, color: string}) => {      
    return (
        <div className="text-block">
            <div className="flex justify-center">
                {profilePic ? <Image profilePic={profilePic}/> : <ImageNotExist username={username ? username.trim()[0].toUpperCase() : ""} color={color} />}
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