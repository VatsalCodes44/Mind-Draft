import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { memo, useCallback, useState } from "react";
import {signupBodySchemaType, } from "common-medium-project"
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
const SignupAuth = memo(() => {
    const [signupInput, setSignupInput] = useState<signupBodySchemaType>({
        name: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    return (
        <div> 
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
                <Button type={"signup"} onClick={ async () => {
                    const response: {
                        data: {
                            jwt: string,
                            user: Author
                        }
                    } = await axios.post("http://127.0.0.1:8787/api/v1/user/signup", signupInput)
                    if (response) {
                        window.localStorage.setItem("token",response.data.jwt)
                        window.localStorage.setItem("username", response.data.user.name)
                        window.localStorage.setItem("email", response.data.user.email)
                        window.localStorage.setItem("userId",response.data.user.id)
                        navigate("/blogs")
                     }
                }} />
            </div>
        </div>
    )
})
export default SignupAuth;