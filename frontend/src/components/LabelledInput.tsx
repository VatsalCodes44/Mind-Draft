import { memo } from "react"

interface Input {
    label?: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    name: string,
    autocomplete?: string
}
const LabelledInput = memo(({label, placeholder, onChange, type, name, autocomplete}: Input) => {
    return(
        <div className="">
            <div className="mt-6 text-lg font-medium mb-2">
                {label}
            </div>
            <div>
                <input name={name} autoComplete={autocomplete} type={type || "text"} placeholder={placeholder} onChange={onChange} className=" w-full border-1 placeholder:text-lg border-gray-300 text-md text-gray-900 focus:outline-gray-500 rounded-md p-2"/>
            </div>
        </div>
    )
})
export default LabelledInput