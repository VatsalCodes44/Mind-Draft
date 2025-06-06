// import { atom } from "recoil";

// // id              String        @id @default(uuid()) // to make id a string,
// //   email           String        @unique
// //   name            String    
// //   password        String    
// //   posts           Post[]
// //   aboutMe         String?
// //   profileExist

// interface user {
//     id: string ;
//     email: string;
//     name: string;
//     aboutMe: string;
//     profilePicExist: boolean | null;
// }

// export const userInfo = atom<user>({
//     key: "userInformation",
//     default: {
//         id: sessionStorage.getItem("userId") || "",
//         email: sessionStorage.getItem("email") || "",
//         name: sessionStorage.getItem("username") || "a",
//         aboutMe: sessionStorage.getItem("aboutMe") || "",
//         profilePicExist: sessionStorage.getItem("profilePicExist")  === "true" ? true : false || false,
//     }
// })

// export const userProfilePic = atom<File | null | string>({
//     key: "userProfilePicture",
//     default: window.sessionStorage.getItem("profilePic") || null
// })

// export const userProfilePicFetched = atom<boolean>({
//     key: "userProfilePicFetched123",
//     default: false
// })