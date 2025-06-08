import { memo, useCallback, useState } from "react";
import EditAbout from "../components/EditAbout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userProfileColor } from "../store/userInfo/atom";


const EditProfile = memo(() => {
    const navigate = useNavigate()
    const [imageName,setImageName] = useState<string | null>()
    const [profilePic, setProfilePic] = useState<string | null | File>(sessionStorage.getItem("profilePic"))
    const [username,setUsername] = useState<string>(sessionStorage.getItem("username") || "")
    const [aboutMe, setAboutMe] = useState<string | undefined>(sessionStorage.getItem("aboutMe") || undefined)
    const [ring, setRing ] = useState <boolean> (false)
    const [clicked,setClicked] = useState <boolean>(false)

    const handleApi = useCallback(() => {
        const formData = new FormData()
        
        if (profilePic instanceof(File)){
            formData.append("image", profilePic)
        }
        
        formData.append("name", username)
        formData.append("aboutMe", aboutMe || "")
        
        axios.put("http://localhost:8787/api/v1/user/updateUser",formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
        }).then( async () => {
            setRing(false)
            setClicked(false)
            navigate("/me")

            window.sessionStorage.setItem("username", username)
            window.sessionStorage.setItem("aboutMe", aboutMe || "")
            if (profilePic instanceof(File)){
                window.sessionStorage.setItem("profilePicExist", "true")
                window.sessionStorage.setItem("profilePic", URL.createObjectURL(profilePic))
            }
        }).catch(() => {
            setRing(false)
            setClicked(false)
            alert("Failed! try again")
        })
      },[username, imageName, profilePic, aboutMe])
      
    return (
        <div className="text-block ">
            <div className="flex justify-center">
                {profilePic ? <Image profilePic={profilePic}/> : <ImageNotExist username={username ? username.trim()[0].toUpperCase() : ""}/>}
            </div>
            <div className="flex justify-center items-center space-x-2 mt-4">
                <label htmlFor="uploadImage" className="w-fit text-sm bg-green-600 hover:bg-green-700 hover:cursor-pointer p-1 rounded-sm text-white flex text-center">Change Profile Photo </label>
                <input id="uploadImage" type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files){
                        setProfilePic(e.target.files[0])
                        setImageName(e.target.files[0].name)
                    }
                }}/>
                <div className="text-gray-600 text-md truncate max-w-[100px]" >
                    {imageName}
                </div>
                <svg
                onClick={() => {
                    setImageName(null)
                    setProfilePic(sessionStorage.getItem("profilePic"))
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className={` ${profilePic instanceof(File) ? "" : "hidden" } hiddenw-5 h-5 text-red-600 hover:text-red-700 cursor-pointer `}
                >
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
            </div>
            <div className="flex gap-2 mt-4 text-lg font-semibold">
                <div className="text-gray-600">Username:</div>
                <div className="w-full">
                    <input type="text" className="w-full border-b-1 border-gray-300 focus:outline-none" value={username} onChange={(e) => {
                        setUsername(e.target.value)
                    }}/>
                </div>
            </div>
            <div className={` mt-4`}>
                <EditAbout aboutMe={aboutMe} setAboutMe={setAboutMe} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => {
                    navigate("/me")
                }} className="text-gray-700 hover:cursor-pointer hover:underline hover:underline-offset-2 hover:decoration-gray-700"> Cancel </button>
                <button onClick={clicked ? () => {
                } : () => {
                    setRing(true)
                    setClicked(true)
                    handleApi()
                }} className={`${clicked? "bg-green-300" : "bg-green-600 hover:bg-green-700 hover:cursor-pointer"} flex text-white rounded-full mx-2 py-1 px-2`} >
                    <div className=" text-white text-sm">Save Changes</div>
                    <div className={`${ring ? "block" : "hidden"}`}>
                        <svg className="inline w-4 h-4 ml-2 text-white animate-spin duration-100 fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                </button>
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

const ImageNotExist = memo(({username}:{username: string}) => {
    const color = useRecoilValue(userProfileColor)
    return(
        <div className="h-40 w-40 rounded-full text-white text-4xl flex justify-center items-center" style={{background: color}}>
                {username}
        </div>
    )
})

export default EditProfile;