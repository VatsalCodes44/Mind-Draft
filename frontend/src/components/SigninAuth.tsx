import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { memo, useCallback, useState } from "react";
import { signinBodySchemaType} from "common-medium-project"
import Button from "./Button";
import axios from "axios";


type Author = {
    id: string,
    name: string,
    email: string,
    aboutMe: string | undefined,
    profilePicExist: boolean,
}
const SigninAuth = memo(() => {   
    const [signinInput, setSigninInput] = useState<signinBodySchemaType>({
        email: "",
        password: ""
    })
    const [error, setError] = useState<string | null>(null)
    const [clicked, setClicked] = useState<boolean>(false)
    const navigate = useNavigate()
    return (
        <div className="shadow-2xl p-5 rounded-md shadow-gray-400 lg:shadow-none lg:p-0 lg:rounded-none">
            <div className=""> 
                <div className="text-center text-4xl font-bold w-76">
                    Sign in
                </div>
                <div className="mt-2 text-center text-lg text-gray-500 ">
                    Do not have an account? 
                    <Link className="underline" to="/signup"> Signup </Link>
                </div>
            </div>


            <form autoComplete="on" >
                <div>
                    <LabelledInput name="email" type="email" label="Email" placeholder="Enter your email" onChange={useCallback((e) => {
                                setSigninInput(prev => ({...prev , email: e.target.value}))
                        },[])} />
                </div>

                <div>
                    <LabelledInput name="password" type="password" label="Password" placeholder="" onChange={useCallback((e) => {
                            setSigninInput(prev => ({...prev , password: e.target.value}))
                    },[])} />
                </div>
            </form>
            
            <div className="">
                <Button clicked={clicked} type={"singin"} onClick={async () => {
                    try {
                        setClicked(true)
                        sessionStorage.clear()
                        const response: {
                        data: {
                            jwt: string,
                            user: Author
                        }
                        } = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/signin", signinInput)
                        if (response) {
                        window.sessionStorage.setItem("token",response.data.jwt)
                        window.sessionStorage.setItem("username",response.data.user.name)
                        window.sessionStorage.setItem("email",response.data.user.email)
                        window.sessionStorage.setItem("userId",response.data.user.id)
                        if (response.data.user.aboutMe){
                            window.sessionStorage.setItem("aboutMe",response.data.user.aboutMe)
                        }
                        if (response.data.user.profilePicExist){
                            window.sessionStorage.setItem("profilePicExist",response.data.user.profilePicExist.toString())
                        }
                    }
                    if (sessionStorage.getItem("profilePicExist")){
                        const response2 = await axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/user/userImage",{
                            userId: sessionStorage.getItem("userId")
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                            }
                        })
                        if (response2) {
                            window.sessionStorage.setItem("profilePic",response2.data.image)
                        }
                    }
                    navigate("/blogs")
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
export default SigninAuth;