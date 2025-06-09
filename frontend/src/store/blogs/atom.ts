import axios from "axios";
import { atom, atomFamily, GetRecoilValue, selector } from "recoil";
console.log("atom families loaded")

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
                if (blogs){
                    return blogs
                } else {
                    return {}
                }
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
                const images = response.data
                if (images){
                    return images
                } else {
                    return {}
                }
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
    key: "getMyBlogsObjectAtom123",
    default: selector({
        key: "getMyBlogsSelectorAtom123",
        get: async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8787/api/v1/blog/myFirstBulk",{
                    headers: {
                        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                    }, "responseType": "json"
                })
                const blogs = response.data
                if (blogs) {
                    return blogs
                } else {
                    return {}
                }
            } catch {
                return {}
            }
        }
    })
})

const getMyImagesObjectAtom = atom <ImagesObject> ({
    key: "getMyImagesObjectAtom123",
    default: selector({
        key: "getMyImagesObjectAtomSelector123",
        get: async ({get}: {get:GetRecoilValue})=> {
            try {
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
                const images = response.data
                if (images){
                    return images
                } else {
                    return {}
                }
            } catch {
                return {}
            }
        } 
    })
})

const myBlogAtomFamily = atomFamily<BlogsObject, number>({
    key: "myBlogAtomFamily123",
    default: {}
})

const myImageAtomFamily = atomFamily<ImagesObject, number>({
    key: "myImageAtomFamily123",
    default: {}
})

const isMyFirstBlogsBundleSet = atom<boolean>({
    key: "isMyFirstBlogsBundleSet123",
    default: false
})





const searchedUserId = atom<string | null>({
    key: "searchedUserId123",
    default: null
})
const searchedUserBlogsObjectAtom = atom <BlogsObject> ({
    key: "searchedUserObjectAtom123",
    default: selector({
        key: "searchedUserSelectorAtom123",
        get: async ({get}) => {
            const userId = get(searchedUserId)
            console.log("searchedUserBlogsObjectAtom")
            try {
                if (userId){
                    const response = await axios.get(`http://127.0.0.1:8787/api/v1/blog/myFirstBulk?userId=${userId}`,{
                        headers: {
                            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                        }, "responseType": "json"
                    })
                    const blogs = response.data
                    if (blogs) {
                        return blogs
                    } else {
                        return {}
                    }
                } else {
                    return {}
                }
            } catch {
                return {}
            }
        }
    })
})

const searchedUserImagesObjectAtom = atom <ImagesObject> ({
    key: "searchedUserImagesObjectAtom123",
    default: selector({
        key: "searchedUserImagesObjectAtomSelector123",
        get: async ({get}: {get:GetRecoilValue})=> {
            try {
                const blogs = get(searchedUserBlogsObjectAtom)
                const userId = get(searchedUserId)
                if (userId){
                    const blogIds = Object.keys(blogs).filter((id) => {
                        if (blogs[id].imageExist){
                            return true;
                        } else {
                            return false;
                        }
                    })
                    const response = await axios.post(`http://127.0.0.1:8787/api/v1/blog/images?userId=${userId}`,{
                        blogIds,
                    },{
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`
                        }
                    })
                    const images = response.data
                    if (images){
                        return images
                    } else {
                        return {}
                    }
                } else {
                    return {};
                }
            } catch {
                return {}
            }
        } 
    })
})

const searchedUserAtomFamily = atomFamily<BlogsObject, number>({
    key: "searchedUserAtomFamily123",
    default: {}
})

const searchedUserImageAtomFamily = atomFamily<ImagesObject, number>({
    key: "searchedUserImageAtomFamily123",
    default: {}
})

const isSearchedUserFirstBlogsBundleSet = atom<boolean>({
    key: "isSearchedUserFirstBlogsBundleSet123",
    default: false
})






type Comment = {
    id: number,
    authorId: string;
    date: string;
    comment: string;
    Commentor: {
        name: string;
    }
}

const commentorImagesAtom = atom<ImagesObject>({
    key: "commentorImages",
    default: {}
})

const commentAtomFamily = atomFamily<Comment[], number>({
    key: "commentAtomFamily123",
    default: []
})

const commentImageAtomFamily = atomFamily<ImagesObject, number>({
    key: "commentImageAtomFamily234",
    default: {}
})

const numberOfCommentsFetched = atom<number>({
    key: "numberOfCommentsFetched",
    default: 0
})

const searchBlogLoading = atom<boolean>({
    key: "searchBlogLoading123",
    default: true
})

export { getBlogsObjectAtom, blogAtomFamily, getImagesObjectAtom, imageAtomFamily, commentorImagesAtom, commentAtomFamily, commentImageAtomFamily, 
    numberOfCommentsFetched, getMyBlogsObjectAtom, getMyImagesObjectAtom, myBlogAtomFamily, myImageAtomFamily, isFirstBlogsBundleSet, getAuthorImagesObjectAtom, 
    authorImageAtomFamily, isMyFirstBlogsBundleSet, searchedUserId, searchedUserBlogsObjectAtom, searchedUserImagesObjectAtom, searchedUserAtomFamily, 
    searchedUserImageAtomFamily, isSearchedUserFirstBlogsBundleSet, searchBlogLoading}

