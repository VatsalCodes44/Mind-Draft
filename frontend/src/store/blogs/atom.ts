

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
            const response = await axios.get("http://127.0.0.1:8787/api/v1/blog/bulk",{
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`
                }, "responseType": "json"
            })
            const blogs = response.data
            return blogs
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
            const blogs = get(getBlogsObjectAtom)
            const blogIds = Object.keys(blogs).filter((id) => {
                if (blogs[id].imageExist){
                    return true;
                } else {
                    return false;
                }
            })
            const response = await axios.post("http://127.0.0.1:8787/api/v1/blog/image",{
                blogIds,
            },{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`
                }
            })
            return response.data
        }
    })
})


const blogAtomFamily = atomFamily({
    key: "blogAtomFamily123",
    default: selectorFamily({
        key: "blogAtomSelectorFamily456",
        get: (id: string) => ({get}: {get: GetRecoilValue}) => {
            const blogsObject = get(getBlogsObjectAtom)
            return blogsObject[id]          
        }
    })
})

const imageAtomFamily = atomFamily({
    key: "imageAtomFamily",
    default: selectorFamily({
        key: "imageAtomSelectorFamily",
        get: (id: string) => ({get}: {get: GetRecoilValue}) => {
            const imagesObject = get(getImagesObjectAtom)
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

export { getBlogsObjectAtom, blogAtomFamily, getImagesObjectAtom, imageAtomFamily, commentsDataAtom}

