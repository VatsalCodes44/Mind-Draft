import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { memo, useCallback, useEffect, useState } from "react";
import {signupBodySchemaType, } from "common-medium-project"
import Button from "./Button";
import axios from "axios";


type Author = {
    id: string,
    name: string,
    email: string,
    aboutMe: string | undefined,
    profilePicExist: boolean | undefined,
}
const SignupAuth = memo(() => {
    const [signupInput, setSignupInput] = useState<signupBodySchemaType>({
        name: "",
        email: "",
        password: ""
    })
    useEffect(() => {
        sessionStorage.clear();
    },[])
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [clicked, setClicked] = useState<boolean>(false)
    return (
        <div className="shadow-2xl p-5 rounded-md shadow-gray-400 lg:shadow-none lg:p-0 lg:rounded-none"> 
            <div className=""> 
                <div className="text-center text-4xl font-bold w-76">
                    Create an account
                </div>
                <div className="mt-2 text-center text-lg text-gray-500 ">
                    Already have an account? 
                    <Link className="underline" to="/signin"> Login </Link>
                </div> 
                <div>
                    <LabelledInput name="name" type="text" label="Username" placeholder="Enter your username" onChange={useCallback((e) => {
                        setSignupInput(prev => ({...prev , name: e.target.value}))
                    },[])} />
                </div>
            </div>


            <form autoComplete="on"  >
                <div>
                    <LabelledInput name="email" autocomplete="email" type="email" label="Email" placeholder="Enter your email" onChange={useCallback((e) => {
                            setSignupInput(prev => ({...prev , email: e.target.value}))
                        },[])} />
                </div>

                <div>
                    <LabelledInput autocomplete={"new-password"} name="password" type="password"  label="Password" placeholder="" onChange={useCallback((e) => {
                        setSignupInput(prev => ({...prev , password: e.target.value}))
                    },[])} />
                </div>
            </form>
            
            <div>
                <Button type={"signup"} clicked={clicked} onClick={ async () => {
                    try {
                        setClicked(true)
                        const response: {
                            data: {
                                jwt: string,
                                user: Author
                            }
                        } = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/signup", signupInput)
                        if (response) {
                            window.sessionStorage.setItem("token",response.data.jwt)
                            window.sessionStorage.setItem("username", response.data.user.name)
                            window.sessionStorage.setItem("email", response.data.user.email)
                            window.sessionStorage.setItem("userId",response.data.user.id)
                            console.log(response.data.jwt)
                            if (response.data.user.aboutMe){
                                window.sessionStorage.setItem("aboutMe",response.data.user.aboutMe)
                            }
                            if (response.data.user.profilePicExist){
                                window.sessionStorage.setItem("userId",response.data.user.id)
                            }
                            navigate("/blogs")
                            }
                     } catch (error) {
                        if (axios.isAxiosError(error)) {
                            const message = error.response?.data?.message || "Something went wrong.";
                            setError(message.toString());
                        }
                     } finally {
                        setClicked(false)
                     }
                }} />
            </div>
            <div className="text-red-500 text-center mt-2">
                {error}
            </div>
        </div>
    )
})
export default SignupAuth;