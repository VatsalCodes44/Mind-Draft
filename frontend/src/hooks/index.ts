import axios from "axios";
import { useEffect } from "react"
import { SetterOrUpdater } from "recoil";





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
interface BlogsObject {
  [id: string]: Blog;
}

export function useClapDebounce(blogId:string, likes: number, firstRender: boolean, setFirstRender: React.Dispatch<React.SetStateAction<boolean>>, setBlogs:  SetterOrUpdater<BlogsObject>){
    useEffect(() => {
        if (firstRender){
            setFirstRender(false)
        } else{
            const timeout = setTimeout(async() => {
            axios.post("http://localhost:8787/api/v1/blog/likesUpdate",{
                    blogId,
                    likes
                }, {
                    headers: {
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                }).then(() => {
                    setBlogs(p => {
                    return {
                        ...p, [blogId]: {
                            ...p[blogId],
                            likes
                        }
                    }
            })
                })
                
            }, 1000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [likes])
}
