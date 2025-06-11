import { memo } from "react";

interface buttonInputs {
    type: string,
    onClick: () => void,
    clicked: boolean
}
const Button = memo(({type, onClick, clicked}: buttonInputs) => {
    return (
        <div className="">
            <button onClick={onClick} className={`${clicked ? "bg-gray-700 pointer-events-none" : "bg-gray-950" } mt-4 w-full text-white p-2 rounded-lg hover:cursor-pointer`} > {type === "signup" ? "Sign up" : "Sign in" } </button>
        </div>
    )
})

export default Button;