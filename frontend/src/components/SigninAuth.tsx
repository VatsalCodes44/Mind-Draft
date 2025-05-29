import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { memo, useCallback, useState } from "react";
import { signinBodySchemaType} from "common-medium-project"
import Button from "./Button";
import axios from "axios";


interface Author {
    id: string,
    name: string,
    email: string,
    posts: Blog[]
}
interface Blog {
    id: string;
    title: string;
    summary: string;
    content: string;
    editorState: string;
    imageExist: boolean;
    published: boolean;
    date: string;
    likes: number;
    numberOfComments: number;
    author: {
      name: string
    }
    authorId: string;
}
const SigninAuth = memo(() => {   
    const [signinInput, setSigninInput] = useState<signinBodySchemaType>({
        email: "",
        password: ""
    })
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
                <Button type={"singin"} onClick={async () => {
                     const response: {
                        data: {
                            jwt: string,
                            user: Author
                        }
                     } = await axios.post("http://localhost:8787/api/v1/user/signin", signinInput)
                     if (response) {
                        window.localStorage.setItem("token",response.data.jwt)
                        window.localStorage.setItem("username",response.data.user.name)
                        window.localStorage.setItem("email",response.data.user.email)
                        window.localStorage.setItem("userId",response.data.user.id)
                        navigate("/blogs")
                     }
                }} />
            </div>
        </div>
    )
})
export default SigninAuth;