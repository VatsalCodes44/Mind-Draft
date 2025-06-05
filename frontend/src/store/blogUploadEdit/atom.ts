import {atom, selector, GetRecoilValue} from "recoil"
import { getMyImagesObjectAtom, myImageAtomFamily } from "../blogs/atom"


const getImage = atom <File | null> ({
    key: "hasImage",
    default: null
})
const imageExist = atom <string> ({
    key: "imageExist",
    default: "false"
})

const title = atom <string> ({
    key: "title",
    default: ""
})

const summary = atom <string> ({
    key: "summary",
    default: ""
})

const htmlContent = atom <string> ({
    key: "htmlContent",
    default: ""
})

const editorState = atom <string> ({
    key: "editorState",
    default: ""
})

const preview = atom <string> ({
    key: "preview",
    default: "edit"
})

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
const editBlog = atom<Blog>({
    key: "editBlog123",
})

const editImage = atom<string | null>({
  key: "editImage123",
  default: selector({
    key: "editBlogSelector123",
    get: ({ get }: {get: GetRecoilValue}) => {
        const blog = get(editBlog)
        let image = null;
        if (blog.imageExist){
            const imageObject = get(getMyImagesObjectAtom);
            image= imageObject[blog.id].image
        }
        return image;
  }
  })
});


export {getImage, imageExist, title, htmlContent, preview, summary, editorState, editBlog, editImage};