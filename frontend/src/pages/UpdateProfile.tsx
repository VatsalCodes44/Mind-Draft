import { memo } from "react";
import EditProfile from "../components/EditProfile";


const UpdateProfile = memo(() => {
    return (
        <div className="mt-20">
            <div className="max-w-lg w-auto mx-auto p-10 sm:shadow-md sm:shadow-gray-300">
                <EditProfile />
            </div>
        </div>
    )
})

export default UpdateProfile;