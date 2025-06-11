import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { editBlog, preview as p, summary, htmlContent, title, editImage, editorState, } from "../store/blogUploadEdit/atom";
import { memo, useEffect } from "react";
import EditBlog from "../components/EditBlog";
import EditPreview from "../components/EditPreview";
import EditPublish from "../components/EditPublish";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMyBlogsObjectAtom } from "../store/blogs/atom";

const atomsToReset = [p, summary, htmlContent, title, editorState, editImage, editBlog]
const Edit = memo(() => {
    const myBlogs = useRecoilValue(getMyBlogsObjectAtom)
    const setEditBlog = useSetRecoilState(editBlog)
    const navigate = useNavigate()
    const [preview, setPreview] = useRecoilState(p)
    const setHtmlContent = useSetRecoilState(htmlContent)
    const [param] = useSearchParams()
    const myBlogId = param.get("myBlogId")
    const number = param.get("number")
    if (!myBlogId || !number){
        navigate("/me");
        return;
    }
    const atomNumber = parseInt(number)
    if (!atomNumber){
        navigate("/me");
        return;
    }
    const resetAllAtoms = useRecoilCallback(({ reset }) => () => {
            atomsToReset.forEach(atom => reset(atom));
    }, []);

    useEffect(() => {
        setEditBlog(myBlogs[myBlogId]);

    return () => {
        resetAllAtoms();
    };
    }, []);
    
    useEffect(() => {
        setEditBlog(myBlogs[myBlogId])
        return () => {
            resetAllAtoms();
        }
    },[])
    


    return(
         <div>
            <div className={` ${preview  ===  "edit" ? "block" : "hidden"} `}>
                <div className=" max-h-screen ">
                    <EditBlog myBlogId={myBlogId}/>
                </div>
            </div>


            <div>
                <div className={` ${preview === "preview" ? "block" : "hidden "} flex justify-center`}>
                    <div className="fixed z-50 top-0 w-full p-5 bg-white border-b-2 border-gray-200">
                        <div className="flex flex-col justify-center">
                            <div className="flex justify-center ">
                                <div onClick={() => {setPreview("edit")}} 
                                className="text-2xl font-bold hover:cursor-pointer" >
                                    Preview
                                </div>
                            </div>
                        </div>
                        <div onClick={() => {setPreview("edit")}} className="fixed right-5 top-6 hover:cursor-pointer ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-7 text-gray-500">
                                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>
                        </div>
                    </div>
                    <div onClick={() => {
                                const editorValue = document.querySelector(".ContentEditable__root")
                                const htmlString = editorValue?.innerHTML ?? "";
                                setHtmlContent(htmlString)
                            }} className=" mt-15 sm:w-xl md:w-2xl lg:min-w-3xl mx-10 mb-10">
                        <EditPreview  />
                    </div>
                </div>
            </div>


            <div className={` ${preview === "publish" ? "block" : "hidden "} w-full px-5`}>
               <EditPublish myBlogId={myBlogId} atomNumber={atomNumber}  />
                
            </div>
             
            
        </div>
    )
})

export default Edit;