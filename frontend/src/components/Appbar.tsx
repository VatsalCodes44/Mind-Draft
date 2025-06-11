import AppbarComponent from "./AppbarComponent"
import { memo, useEffect, useRef, useState } from "react"

const Appbar = memo(({searchBar, write, publish, edit}: {searchBar: boolean, write: boolean, publish: boolean, edit:boolean}) => {
    const [show, setShow] = useState <boolean> (true)
    const lastScrollY = useRef <number> (0)
    const controlAppbar = () => {
        if (window.scrollY > lastScrollY.current && window.scrollY > 10){
            setShow(false)
        } else {
            setShow(true)
        }
        lastScrollY.current = (window.scrollY)
    }

    useEffect(() => {
        window.addEventListener("scroll", controlAppbar)

        return () => {
            window.removeEventListener("scroll", controlAppbar)
        }
    },[])

    return (
        <div className={`${show ? "translate-y-0" : "-translate-y-full"} transition-transform duration-200 fixed z-50 w-full bg-white `}>
            <AppbarComponent searchBar={searchBar} write={write} edit={edit} publish={publish} />
        </div>
    )
})

export default Appbar
