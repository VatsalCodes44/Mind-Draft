import { atom } from "recoil";

// id              String        @id @default(uuid()) // to make id a string,
//   email           String        @unique
//   name            String    
//   password        String    
//   posts           Post[]
//   aboutMe         String?
//   profileExist

interface user {
    id: string ;
    email: string;
    name: string;
    aboutMe: string;
    profilePicExist: boolean | null;
}

export const userInfo = atom<user>({
    key: "userInformation",
    default: {
        id: localStorage.getItem("userId") || "",
        email: localStorage.getItem("email") || "",
        name: localStorage.getItem("username") || "a",
        aboutMe: localStorage.getItem("aboutMe") || "",
        profilePicExist: localStorage.getItem("profilePicExist")  === "true" ? true : false || false,
    }
})

export const userProfilePic = atom<File | null | string>({
    key: "userProfilePicture",
    default: window.localStorage.getItem("profilePic") || null
})

export const userProfilePicFetched = atom<boolean>({
    key: "userProfilePicFetched123",
    default: false
})