import axios from "axios";
import { useState, useEffect } from "react"
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { blogAtomFamily, myBlogAtomFamily } from "../store/blogs/atom";

type blogs = {
        id: string,
        title: string,
        content: string,
        published: boolean,
        authorId: string,
        author: {
            name: string
        }
}[] | null;

export function useBlogs(): blogs {
    const [blogs,setBlogs] = useState<blogs>(null)

    useEffect(() => {
        async function fetchBlogs () {
            const res = await axios.get("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/bulk",{
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            })
            setBlogs(res.data.response)
        }
        fetchBlogs()
    }, [])
    return blogs
}



type blog = {
    id: string,
    title: string,
    content: string,
    published: boolean,
    authorId: string,
    imageExist: boolean
    author: {
        name: string
    }
} | null

export function useBlog( blogId: string ) {
    if (!blogId) {
        return null
    }
    const [blog, setBlog] = useState < blog >(null)
    console.log("---------------------")
    useEffect(() => {
        async function fetchBlog () {
            const res = await axios.get(`https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/get/${blogId}`,{
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            })
            setBlog(res.data)
            console.log(res.data, "---------------------")
        }
        fetchBlog()
        console.log("hi")
    },[])
    return blog
}


export function useImage(blogId: string){
    const [imageUrl, setImageUrl] = useState <string | null> (null)
    useEffect(()=>{
            axios.post("https://backend-medium.mahajanvatsal44.workers.dev/api/v1/blog/image",{
                blogId,
            }, {
            headers: {
                "Authorization": `Bearer ${window.sessionStorage.getItem("token")}`,
            },
            "responseType": 'blob'
            }).then( async (res) => {
                const imageUrl = URL.createObjectURL(res.data)
                setImageUrl(imageUrl)
            })
    }, [])
    return imageUrl;
}

export function useClapDebounce(blogId:string, likes: number, firstRender: boolean, setFirstRender: React.Dispatch<React.SetStateAction<boolean>>, atomNumber: number){
    const setBlogs = useSetRecoilState(blogAtomFamily(atomNumber))
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
                    setBlogs((previous) => {
                        return {...previous, [blogId]:{
                                ...previous[blogId],
                                likes
                            }
                        }
                    })
                }).catch(() => {
                })

            }, 1000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [likes, setBlogs])
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
interface BlogsObject {
  [id: string]: Blog;
}

export function useMyClapDebounce(blogId:string, likes: number, firstRender: boolean, setFirstRender: React.Dispatch<React.SetStateAction<boolean>>, setBlogs:  SetterOrUpdater<BlogsObject>){
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
export function useSearchedClapDebounce(blogId:string, likes: number, firstRender: boolean, setFirstRender: React.Dispatch<React.SetStateAction<boolean>>, setBlog: React.Dispatch<React.SetStateAction<Blog | null>>){
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
                    setBlog((previous) => {
                        if(previous){
                            return {...previous, likes}
                        } else {
                            return null
                        }
                    })
                }).catch(() => {
                })

            }, 1000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [likes, setBlog])
}