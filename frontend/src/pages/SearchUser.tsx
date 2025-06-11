import { memo, Suspense, useEffect, useRef, useState } from "react";
import Profile from "../components/Profile";
import Appbar from "../components/Appbar";
import BlogsLoader from "../components/BlogsLoader";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { searchedUserAboutMe, searchedUserProfilePic, searchedUserUsername, userProfileColor } from "../store/userInfo/atom";
import UserProfile from "../components/UserProfile";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SearchedUserBlogsComponent from "../components/SearchedUserBlogsComponent";
import SearchedUserLoader from "../components/SearchedUserLoader";
import { isSearchedUserFirstBlogsBundleSet, searchedUserId } from "../store/blogs/atom";

interface User {
    id: string,
    name: string,
    email: string,
    aboutMe: string,
    profilePicExist: boolean,
}
const SearchUser = memo(() => {
    const color = useRecoilValue(userProfileColor)
    const homeDraftsLibrary = useRef<"home" | "drafts">("home")
    const [param] = useSearchParams()
    const navigate = useNavigate()
    const userId = param.get("userId") || ""
    if (!sessionStorage.getItem("token")){
        return <Navigate to={"/signin"} />
    }
    if (!userId){
        return <Navigate to={"/signin"} />
    }
    const setSearchedUserId = useSetRecoilState(searchedUserId)
    const [profilePic, setProfilePic] = useRecoilState(searchedUserProfilePic)
    const [username, setUsername] = useRecoilState(searchedUserUsername)
    const [aboutMe, setAboutMe] = useRecoilState(searchedUserAboutMe)
    const [loading, setLoading] = useState<boolean>(true)
    const setIsSearchedUserFirstBlogsBundleSet = useSetRecoilState(isSearchedUserFirstBlogsBundleSet)
    const fetchUserDetails = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/getUser?userId=${userId}`,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            })
            if (response){
                const user: User = response.data
                setUsername(user.name)
                setAboutMe(user.aboutMe)
                if (user.profilePicExist){
                    const response2 = await axios.post(`https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/userImage`,{
                        userId
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                        }
                    })
                    if (response2){
                        setProfilePic(response2.data.image)
                    }
                }
            }
        } catch {
            navigate("/blogs")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        setIsSearchedUserFirstBlogsBundleSet(false)
        setSearchedUserId(userId)
        fetchUserDetails()

        return () => {
        }
    }, [userId])

    
    return (
        <div className="w-full min-h-180">
            <Appbar searchBar={true} edit={false} write={true} publish={false}  />
            {loading ? <SearchedUserLoader/> : 
            <div className="w-full px-5 lg:grid lg:grid-cols-12 lg:gap-8 pt-25 lg:mr-7.5">
                <div className="hidden lg:block lg:col-span-1"></div>
                <div className=" lg:col-span-6">
                    <div className="lg:flex-none sm:mx-16 md:mx-16 lg:mx-0 ">
                        <Profile color={color} edit={false} profilePic={profilePic} username={username} aboutMe={aboutMe} />
                    </div>
                    <div className="min-w-auto sm:mx-16 md:mx-16 lg:mx-0">
                        <div className="flex gap-6 border-b-1 mt-6 border-b-gray-200 pb-3 text-gray-600 ">
                        </div>
                    </div>
                    <div className="">
                        <Suspense fallback={<div className=" sm:mx-16 md:mx-16 lg:mx-0"><BlogsLoader /></div>}>
                            <SearchedUserBlogsComponent homeDraftsLibrary={homeDraftsLibrary.current} userId={userId} />
                        </Suspense>

                    </div>
                </div>
                

                <div className="hidden w-full text-black lg:block lg:col-span-4 ">
                    <div className="flex justify-between">
                        <div className=" w-1 h-100 mt-17 ml-7.5 border-l-1 border-gray-300 right-130" />
                        <div className="w-full ml-7.5">
                            <UserProfile profilePic={profilePic} username={username} aboutMe={aboutMe} color={color}/>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-1"></div>
            </div>
            }
        </div>
    )
})

export default SearchUser;
