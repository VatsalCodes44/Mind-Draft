import axios from "axios";
import { useState, useEffect } from "react"
import { useSetRecoilState } from "recoil";
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


export function useMyClapDebounce(blogId:string, likes: number, firstRender: boolean, setFirstRender: React.Dispatch<React.SetStateAction<boolean>>, atomNumber: number){
    const setMyBlogs = useSetRecoilState(myBlogAtomFamily(atomNumber))
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
                    setMyBlogs(p => {
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