import { BrowserRouter, Route, Routes } from "react-router-dom"
import React, { Suspense } from "react"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Blogs from "./pages/Blogs"
import Blog from "./pages/Blog"
import { RecoilRoot } from "recoil"
import BlogsLoader from "./components/BlogsLoader"
import Random from "./pages/Random"
import Edit from "./pages/Edit"

const Upload = React.lazy( () => {
  return import("./pages/Upload")
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
                <Route path= "/Blogs"   element = {<Suspense fallback={<div><BlogsLoader /></div>}><Blogs /></Suspense>} />
                <Route path= "/Blog"    element = {<Blog/>} />
                <Route path= "/upload"  element = {<Upload/>} />
                <Route path= "/edit"    element = {<Edit/>} />
                <Route path= "/random"  element = {<Random />} />
              </Routes>
          </BrowserRouter>
        </RecoilRoot>
      </div>
    </div>
  )
}

export default App
