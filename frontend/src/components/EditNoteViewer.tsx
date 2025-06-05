import { memo } from "react";
import NoteViewer from "./NoteViewer";
import { useRecoilValue } from "recoil";
import { editBlog as eBlog } from "../store/blogUploadEdit/atom";


const EditNoteViewer = memo(() => {
    const editBlog = useRecoilValue(eBlog)
    return (
        <NoteViewer editorStateEdit={editBlog?.editorState} />
    )
})

export default EditNoteViewer;