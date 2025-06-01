import AppbarComponent from "./AppbarComponent"
import PreviewButton from "./PreviewButton"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { editBlog as eBlog, imageExist, getImage as img } from "../store/blogUploadEdit/atom"
import { memo } from "react"
import TitleEditPageComponent from "./TitleEditPageComponent"
import NoteViewer from "./NoteViewer"



const EditBlog = memo(() => {
    const [image, setImage] = useRecoilState(img)
    const setImageExist = useSetRecoilState(imageExist)
    const editBlog = useRecoilValue(eBlog)

    return (
        <div className="">

            <div className=" mb-20 ">
                <div className="fixed top-0 bg-white w-full z-50 ">
                        <AppbarComponent searchBar={false} write= {false} publish={true} notifications={false} edit={false} />
                </div>
            </div>

            <div className=" mb-8 ">
                <div className=" mx-2 lg:mx-20 xl:mx-70">
                    <TitleEditPageComponent editTitle={editBlog?.title || ""} />
                </div>
            </div>

            <div className="flex justify-center mx-2 lg:mx-20 xl:mx-70">
                <div className="border-1 w-full rounded-2xl border-slate-300">
                    <NoteViewer editorStateEdit={editBlog?.editorState} />
                </div>
            </div>

            <div className="flex justify-center mt-5 not-even: mx-2 lg:mx-20 xl:mx-70">
                    <label htmlFor="uploadImage" className="mx-2 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer p-1 rounded-sm text-white">Add an image  </label>
                    <div className="flex">
                        <div className="text-gray-600 text-lg">
                            {image?.name}
                        </div>
                        <div onClick={() => {
                            setImage(null)
                            setImageExist("false")
                        }} className={` ${image ? "" : "hidden"} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-7 text-red-600 hover:cursor-pointer mt-0.5 ml-2 ">
                                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </div>
                    </div>
                    <input id="uploadImage" type="file" accept="image/*" className="hidden" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setImage(e.target.files?.[0] || null)
                        setImageExist(e.target.files?.[0] ? "true" : "false")
                    }}/>
            </div>

            <div className="h-20"></div>

            <div className=" fixed bottom-15 right-15 flex justify-center mt-8">
                <PreviewButton />
            </div>
        </div>
    )
})

export default EditBlog;