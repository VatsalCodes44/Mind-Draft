import { memo } from "react";
import EditProfile from "../components/EditProfile";
import { Navigate } from "react-router-dom";


const UpdateProfile = memo(() => {
    if (!sessionStorage.getItem("token")){
        return <Navigate to={"/signin"} />
    }
    return (
        <div className="mt-20">
            <div className="max-w-lg w-auto mx-auto p-10 sm:shadow-md sm:shadow-gray-300">
                <EditProfile />
            </div>
        </div>
    )
})

export default UpdateProfile;