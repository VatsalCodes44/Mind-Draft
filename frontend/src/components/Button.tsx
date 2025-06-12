import { memo } from "react";

interface buttonInputs {
    type: string,
    onClick: () => void,
    clicked: boolean
}
const Button = memo(({type, onClick, clicked}: buttonInputs) => {
    return (
        <div className="">
           <button
  onClick={onClick}
  disabled={clicked}
  className={`
    bg-gray-800 text-white
    hover:bg-gray-900
    disabled:bg-gray-500 disabled:opacity-70 disabled:cursor-not-allowed
    mt-4 w-full p-2 rounded-lg transition duration-200
  `}
>
  {type === "signup" ? "Sign up" : "Sign in"}
</button>
        </div>
    )
})

export default Button;