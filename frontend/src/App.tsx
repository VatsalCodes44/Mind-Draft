import { BrowserRouter, Route, Routes } from "react-router-dom"
import React, { Suspense } from "react"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Blogs from "./pages/Blogs"
import Blog from "./pages/Blog"
import { RecoilRoot } from "recoil"
import MyBlog from "./pages/MyBlog"
import UpdateProfile from "./pages/UpdateProfile"
import Random from "./pages/Random"
import SearchedBlog from "./pages/SingleSearchedBlog"
import SearchUser from "./pages/SearchUser"
import UserBlog from "./pages/UserBlog"
import SingleSearchedBlog from "./pages/SingleSearchedBlog"
import { RefreshRoute } from "./pages/RefreshRoute"

const Upload = React.lazy( () => {
  return import("./pages/Upload")
})
const Edit = React.lazy( () => {
  return import("./pages/Edit")
})
const Me = React.lazy( () => {
  return import("./pages/Me")
})

// function App() {

//   return (
//     <div>
//       <div>
//         <RecoilRoot>
//           <BrowserRouter>
//               <Routes>
//                 <Route path= "/signup"  element = {<Signup/>} />
//                 <Route path= "/signin"  element = {<Signin/>} />
//                 <Route path= "/Blogs"   element = {<Blogs/>} />
//                 <Route path= "/Blog"    element = {<Blog/>} />
//                 <Route path= "/upload"  element = {<Suspense><Upload/></Suspense>}/>
//                 <Route path= "/edit"    element = {<Suspense><Edit/></Suspense>} />
//                 <Route path= "/me"      element = {<Me/>} />
//                 <Route path= "/myBlog"  element = {<MyBlog/>} />
//                 <Route path= "/userBlog"  element = {<UserBlog/>} />
//                 <Route path= "/updateProfile"  element = {<UpdateProfile/>} />
//                 <Route path= "/searchUser"  element = {<SearchUser/>} />
//                 <Route path= "/searchedBlog"  element = {<SearchedBlog/>} />
//                 <Route path= "/SingleSearchedBlog"  element = {<SingleSearchedBlog/>} />
//                 <Route path= "/random"  element = {<Random/>} />
//               </Routes>
//           </BrowserRouter>
//         </RecoilRoot>
//       </div>
//     </div>
//   )
// }

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
                <Route path= "/Blog"    element = {<RefreshRoute component={<Blog/>} redirectionPath="/blogs" showPopup={false} />} />
                <Route path= "/upload"  element = {<RefreshRoute component={<Suspense><Upload/></Suspense>} redirectionPath="/blogs" showPopup={true} />} />
                <Route path= "/edit"    element = {<RefreshRoute component={<Suspense><Edit/></Suspense>} redirectionPath="/me" showPopup={true} />} />
                <Route path= "/me"      element = {<Me/>} />
                <Route path= "/myBlog"  element = {<RefreshRoute component={<MyBlog/>} redirectionPath="/me" showPopup={false} />} />
                <Route path= "/userBlog"  element = {<UserBlog/>} />
                <Route path= "/updateProfile"  element = {<UpdateProfile/>} />
                <Route path= "/searchUser"  element = {<SearchUser/>} />
                <Route path= "/searchedBlog"  element = {<SearchedBlog/>} />
                <Route path= "/SingleSearchedBlog"  element = {<SingleSearchedBlog/>} />
              </Routes>
          </BrowserRouter>
        </RecoilRoot>
      </div>
    </div>
  )
}

export default App
