import { memo } from "react"
import "../index.css"

const SearchBar = memo(() => {
    return (
        <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-black " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div> 
            <input type="text" className="bg-gray-100 custom-caret py-2 px-10 rounded-full focus:outline-0" placeholder="Search" />
        </div>
    )
})

export default SearchBar