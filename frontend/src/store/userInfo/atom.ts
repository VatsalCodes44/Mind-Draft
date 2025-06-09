import { atom } from "recoil";
import randomColor from "../../components/randomColor";

export const userProfileColor = atom<string>({
    key: "userProfileColor",
    default: randomColor()
})

export const searchedUserProfilePic = atom<string | null>({
    key: "serchedUserProfilePic123",
    default: null
})

export const searchedUserUsername = atom<string | null>({
    key: "searchedUserUsername123",
    default: null
})

export const searchedUserAboutMe = atom<string | null>({
    key: "searchedUserAboutMe123",
    default: null
})
