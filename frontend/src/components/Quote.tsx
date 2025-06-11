import { memo } from "react"


const Quote = memo(() => {

    return (
        <div className=" min-h-screen flex flex-col justify-center " style={{ backgroundColor: 'rgb(243, 245, 247)' }}>
            <img className="h-screen" src = "public\mindDraft.jpg" alt = "..." />
        </div>
    )
})
export default Quote;