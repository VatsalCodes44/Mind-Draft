import { BrowserRouter, Route, Routes } from "react-router-dom"
import React, { Suspense } from "react"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Blogs from "./pages/Blogs"
import Blog from "./pages/Blog"
import { RecoilRoot } from "recoil"
import Random from "./pages/Random"
import Me from "./pages/Me"
import MyBlog from "./pages/MyBlog"
import EditProfile from "./components/EditProfile"
import UpdateProfile from "./pages/UpdateProfile"

const Upload = React.lazy( () => {
  return import("./pages/Upload")
})
const Edit = React.lazy( () => {
  return import("./pages/Edit")
})

function App() {

  return (
    <div>
      <div>
        <RecoilRoot>
          <BrowserRouter>
              <Routes>
                <Route path= "/signup"  element = {<Signup/>} />
                <Route path= "/signin"  element = {<Signin/>} />
                <Route path= "/Blogs"   element = {<Blogs/>} />
                <Route path= "/Blog"    element = {<Blog/>} />
                <Route path= "/upload"  element = {<Upload/>} />
                <Route path= "/edit"    element = {<Suspense><Edit/></Suspense>} />
                <Route path= "/me"      element = {<Me/>} />
                <Route path= "/myBlog"  element = {<MyBlog/>} />
                <Route path= "/updateProfile"  element = {<UpdateProfile/>} />
                <Route path= "/random"  element = {<EditProfile/>} />
              </Routes>
          </BrowserRouter>
        </RecoilRoot>
      </div>
    </div>
  )
}

export default App
