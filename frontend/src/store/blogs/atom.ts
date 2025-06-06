import axios from "axios";
import { atom, atomFamily, GetRecoilValue, selector, selectorFamily } from "recoil";


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

const getBlogsObjectAtom = atom <BlogsObject> ({
    key: "getBlogsAtom",
    default: selector({
        key: "getBlogsSelectorAtom",
        get: async () => {
            try{
                const response = await axios.get("http://127.0.0.1:8787/api/v1/blog/firstBulk",{
                    headers: {
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }, "responseType": "json"
                })
                const blogs = response.data
                return blogs
            } catch {
                return {}
            }
        }
    })
})


interface ImagesObject {
    [id: string]: {
        id: string,
        image: string
    }
}

const getImagesObjectAtom = atom <ImagesObject> ({
    key: "getImagesObjectAtom",
    default: selector({
        key: "getImagesObjectAtomSelector",
        get: async ({get}: {get: GetRecoilValue}) => {
            try {
                const blogs = get(getBlogsObjectAtom)
                const blogIds = Object.keys(blogs).filter((id) => {
                    if (blogs[id].imageExist){
                        return true;
                    } else {
                        return false;
                    }
                })
                const response = await axios.post("http://127.0.0.1:8787/api/v1/blog/images",{
                    blogIds,
                },{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                })
                return response.data
            } catch {
                return {}
            }
        }
    })
})
const getAuthorImagesObjectAtom = atom <ImagesObject> ({
    key: "getAuthorImagesObjectAtom",
    default: selector({
        key: "getAuthorImagesObjectAtomSelector",
        get: async ({get}: {get: GetRecoilValue}) => {
            try {
                const blogs = get(getBlogsObjectAtom)
                const authorIds = Object.values(blogs).map(blog => {
                    return blog.authorId
                })
                const response = await axios.post("http://127.0.0.1:8787/api/v1/blog/images",{
                    blogIds: authorIds,
                },{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }
                })
                return response.data
            } catch {
                return {}
            }
        }
    })
})


const blogAtomFamily = atomFamily<BlogsObject, number>({
    key: "blogAtomFamily123",
    default: {}
})

const isFirstBlogsBundleSet = atom<boolean>({
    key: "isFirstBlogsBundleSet",
    default: false
})

const imageAtomFamily = atomFamily<ImagesObject, number>({
    key: "imageAtomFamily",
    default: {}
})

const authorImageAtomFamily = atomFamily<ImagesObject, number>({
    key: "authorImageAtomFamily",
    default: {}
})







const getMyBlogsObjectAtom = atom <BlogsObject> ({
    key: "getMyBlogsBbjectAtom123",
    default: selector({
        key: "getMyBlogsSelectorAtom123",
        get: async () => {
            console.log("here i am")
            const response = await axios.get("http://127.0.0.1:8787/api/v1/blog/myBlogs",{
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }, "responseType": "json"
            })
            const blogs = response.data
            return blogs
        }
    })
})

// const getMyImagesObjectAtom = atom <ImagesObject> ({
//     key: "getMyImagesObjectAtom123",
//     default: {
//         "abc": {
//             id: "",
//             image: ""
//         }
//     }
// })


const imagesFetch = atom({
    key: "imagesFetched123",
    default: false
})

const getMyImagesObjectAtom = atom <ImagesObject> ({
    key: "getMyImagesObjectAtom123",
    default: selector({
        key: "getMyImagesObjectAtomSelector123",
        get: async ({get}: {get:GetRecoilValue})=> {
            const blogs = get(getMyBlogsObjectAtom)
            const blogIds = Object.keys(blogs).filter((id) => {
                if (blogs[id].imageExist){
                    return true;
                } else {
                    return false;
                }
            })
            const response = await axios.post("http://127.0.0.1:8787/api/v1/blog/images",{
                blogIds,
            },{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                }
            })
            return response.data 
        } 
    })
})

const myBlogAtomFamily = atomFamily({
    key: "myBlogAtomFamily123",
    default: selectorFamily({
        key: "myBlogAtomSelectorFamily456",
        get: (id: string) => ({get}: {get: GetRecoilValue}) => {
            const blogsObject = get(getMyBlogsObjectAtom)
            return blogsObject[id]          
        }
    })
})


const myImageAtomFamily = atomFamily({
    key: "myImageAtomFamily123",
    default: selectorFamily({
        key: "myImageAtomSelectorFamily123",
        get: (id: string) => ({get}: {get: GetRecoilValue}) => {
            const imagesObject = get(getMyImagesObjectAtom)
            return imagesObject[id]          
        }
    })
})

type Comments = {
    authorId: string;
    date: string;
    comment: string;
    Commentor: {
        name: string;
    }
}[] | null
const commentsDataAtom = atom <Comments>({
    key: "commentsDataAtom",
    default: null
})

// const CommentorimageAtom = atom({
//     key: "imageAtomFamily",
//     default: selector({
//         key: "imageAtomSelectorFamily",
//         get: async ({get}: {get: GetRecoilValue}) => {
//             const comments = get(commentsDataAtom)
//             const authorIds = comments?.map((comment) => {
//                 return comment.authorId
//             })

                      
//         }
//     })
// })

export { getBlogsObjectAtom, blogAtomFamily, getImagesObjectAtom, imageAtomFamily, commentsDataAtom, getMyBlogsObjectAtom, getMyImagesObjectAtom, myBlogAtomFamily, myImageAtomFamily, imagesFetch, isFirstBlogsBundleSet, getAuthorImagesObjectAtom, authorImageAtomFamily}

