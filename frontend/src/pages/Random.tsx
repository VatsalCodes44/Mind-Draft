// import { useRef, useState } from "react"




// const Random = ({x}: {x:number}) => {
    
//     const ref1 = useRef<HTMLInputElement[]>([]);

//     return (
//         <div className="w-max mx-auto grid grid-cols-12 my-1">
//             {Array(x).fill(0).map((_,index) => {
//                 return(
//                     <SubOTP key={index} reference={(element) => {
//                        if (element) ref1.current[index] = element
//                     }} onDone={() => {
//                         if (index == x-1){

//                         } else {
//                             ref1.current[index+1].focus()
//                         }
//                     }} onBackspace={() => {
//                         if (index == 0){

//                         } else {
//                             ref1.current[index-1].focus()
//                             ref1.current[index-1].value = ""
//                         }
//                     }} />
//                 )
//             })}
//         </div>
//     )
// }

// const SubOTP = ({reference, onDone, onBackspace}: {reference: (e: HTMLInputElement) => void, onDone: () => void, onBackspace: () => void}) => {
//     const [value, setValue] = useState("")
//     return (
//             <input type="text" value={value} placeholder="*" ref={reference} onChange={(e) => {
//                 console.log(e.target.value)
//                 if (["0","1","2","3","4","5","6","7","8","9"].includes(e.target.value.slice(0)) ){
//                     setValue(e.target.value.slice(0))
//                     onDone()
//                 } else if (e.target.value.length==2 && ["0","1","2","3","4","5","6","7","8","9"].includes(e.target.value.slice(1)) ) {
//                     setValue(e.target.value.slice(1))
//                     onDone()
//                 }
//             }} onKeyDown={(e) => {
//                 if (e.key == "Backspace") {
//                     setValue("")
//                     onBackspace()
//                 }
//             }} className="ml-1 w-5 h-5 my-1 bg-amber-200 text-center pt-0.5" />
//     )
// }













import { useRef, useState } from "react"


const Random = () => {
    
    const ref1 = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLInputElement>(null);
    const ref3 = useRef<HTMLInputElement>(null);
    const ref4 = useRef<HTMLInputElement>(null);
    const ref5 = useRef<HTMLInputElement>(null);
    const ref6 = useRef<HTMLInputElement>(null);

    return (
        <div className="w-full">
            <div className="w-max mx-auto">
                <SubOTP reference={ref1} onDone={() => {
                    ref2.current?.focus()
                }} onBackspace={() => {
                    
                }}/>
                <SubOTP reference={ref2} onDone={() => {
                    ref3.current?.focus()
                }} onBackspace={() => {
                    ref1.current?.focus()
                }}/>
                <SubOTP reference={ref3} onDone={() => {
                    ref4.current?.focus()
                }} onBackspace={() => {
                    ref2.current?.focus()
                }}/>
                <SubOTP reference={ref4} onDone={() => {
                    ref5.current?.focus()
                }} onBackspace={() => {
                    ref3.current?.focus()
                }}/>
                <SubOTP reference={ref5} onDone={() => {
                    ref6.current?.focus()
                }} onBackspace={() => {
                    ref4.current?.focus()
                }}/>
                <SubOTP reference={ref6} onDone={() => {
                }} onBackspace={() => {
                    ref5.current?.focus()
                }}/>
            </div>
        </div>
    )
}

const SubOTP = ({reference, onDone, onBackspace}: {reference: React.RefObject<HTMLInputElement | null>, onDone: () => void, onBackspace: () => void}) => {
    const [value, setValue] = useState(" ")
    return (
            <input type="text" placeholder="*" value={value} ref={reference} onChange={(e) => {
                console.log(e.target.value)
                if (["0","1","2","3","4","5","6","7","8","9"].includes(e.target.value.slice(1)) ){
                    setValue(e.target.value.slice(1))
                    onDone()
                } else {

                }
            }} onKeyDown={(e) => {
                console.log(e.key)
                if (e.key == "Backspace") {
                    setValue("*")
                    onBackspace()
                }
            }} className="ml-1 w-5 h-5 bg-amber-200 text-center pt-0.5" />
    )
}





export default Random;