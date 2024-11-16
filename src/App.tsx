import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import HomePage from "./screens/HomePage"
import "./App.css"

function App() {


  return (
    <BrowserRouter>
      <HelmetProvider>
        <Routes>
            <Route index element={<HomePage />} />
        </Routes>
      </HelmetProvider>
      <ToastContainer />
      {
        (() => (<></>))()
      }
    </BrowserRouter>
  )
}

export default App
