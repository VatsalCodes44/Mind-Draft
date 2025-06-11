import AppbarComponent from "./AppbarComponent"
import PreviewButton from "./PreviewButton"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { editBlog as eBlog, editImage, preview, } from "../store/blogUploadEdit/atom"
import { memo, useEffect, useState } from "react"
import TitleEditPageComponent from "./TitleEditPageComponent"
import NoteViewer from "./NoteViewer"
import { getMyBlogsObjectAtom, getMyImagesObjectAtom, myImageAtomFamily } from "../store/blogs/atom"
import MyBlogsImage from "./MyBlogsImage"



const EditBlog = memo(({myBlogId}:{myBlogId:string}) => {
    const [imageName, setImageName] = useState<string | null>()
    const [editBlog,setEditBlog]= useRecoilState(eBlog);
    const setEditImage = useSetRecoilState(editImage)
    const myBlogsImage = useRecoilValue(getMyImagesObjectAtom)
    const myBlogs = useRecoilValue(getMyBlogsObjectAtom)
    return (
        <div className="">

            <div className=" mb-20 ">
                <div className="fixed top-0 bg-white w-full z-50 ">
                    <AppbarComponent searchBar={false} write= {false} publish={true} edit={false} />
                </div>
            </div>

            <div className=" mb-8 ">
                <div className=" mx-2 lg:mx-20 xl:mx-70">
                    <TitleEditPageComponent />
                </div>
            </div>

            <div className="flex justify-center mx-2 lg:mx-20 xl:mx-70">
                <div className="border-1 w-full rounded-2xl border-slate-300">
                    <NoteViewer editorStateEdit={editBlog.editorState} />
                </div>
            </div>

            <div className=" sm:flex sm:justify-center mt-5 not-even: mx-2 lg:mx-20 xl:mx-64">
                    <div className="flex justify-center items-center ">
                        <div>
                            <label htmlFor="uploadImage" className="w-fit mt-2 sm:mt-0 mx-2 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer p-1 rounded-sm text-white flex text-center">{editBlog?.imageExist ? "Change image" : "Upload an image"} </label>
                            <input id="uploadImage" type="file" accept="image/*" className="hidden" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setImageName(e.target.files?.[0].name.toString() || null)
                                if(e.target.files){
                                    setEditImage(URL.createObjectURL(e.target.files[0]))
                                    setEditBlog(p=>({...p, imageExist: true}))
                                }
                            }}/>
                        </div>
                        {imageName && (
                        <div className="flex items-center ml-2 space-x-2">
                            <div className="text-gray-600 text-md truncate max-w-[100px]" title={imageName}>
                            {imageName}
                            </div>
                            <svg
                            onClick={() => {
                                setImageName(null);
                                if (myBlogs[myBlogId].imageExist){
                                    setEditImage(myBlogsImage[myBlogId].image)
                                    setEditBlog(p => ({...p, imageExist: true}))
                                } else {
                                    setEditImage(null)
                                    setEditBlog(p => ({...p, imageExist: false}))
                                }
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="w-5 h-5 text-red-600 cursor-pointer"
                            >
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </div>
                        )}

                    </div>
            </div>

            <div className="h-20"></div>

            <div className=" fixed bottom-15 right-15 flex justify-center mt-8">
                <PreviewButton />
            </div>
        </div>
    )
})

export default EditBlog;