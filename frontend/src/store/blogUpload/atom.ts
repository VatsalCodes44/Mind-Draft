import {atom} from "recoil"


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



export {getImage, imageExist, title, htmlContent, preview, summary, editorState};