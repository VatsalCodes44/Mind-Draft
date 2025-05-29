import { memo } from "react";
import Quote from "../components/Quote";
import SignupAuth from "../components/SignupAuth";


const Signup = memo (() => {
    return (
        <div className="grid grid-cols-2">
            <div className="col-span-2 lg:col-span-1 flex flex-col justify-center">
                <div className=" h-screen flex flex-col justify-center">
                    <div className="flex justify-center"><SignupAuth /></div>
                </div>
            </div>
            <div className="hidden lg:block lg:col-span-1"><Quote/></div>
        </div>
    )
})
export default Signup;