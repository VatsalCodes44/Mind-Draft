import { memo } from "react";

interface buttonInputs {
    type: string,
    onClick: () => void
}
const Button = memo(({type, onClick}: buttonInputs) => {
    return (
        <div className="">
            <button onClick={onClick} className="mt-4 w-full bg-stone-900 text-white p-2 rounded-lg hover:cursor-pointer hover:bg-black"> {type === "signup" ? "Sign up" : "Sign in" } </button>
        </div>
    )
})

export default Button;