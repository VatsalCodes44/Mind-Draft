import { memo } from "react"


const Quote = memo(() => {

    return (
        <div className=" min-h-screen flex flex-col justify-center " style={{ backgroundColor: 'rgb(243, 245, 247)' }}>
            <div className=" flex justify-center ">
                <div className="max-w-lg text-2xl ">
                    <div className="font-bold">
                        "The customer support I recieved was exceptional. The support 
                        team went above and beyond to address my concerns."
                    </div>
                    <div className="text-lg mt-4 font-bold ">
                        Jules Winnfield
                    </div>
                    <div className="text-lg font-medium text-gray-600 ">
                        CEO, Acme Inc
                    </div>
                </div>
            </div>
        </div>
    )
})
export default Quote;