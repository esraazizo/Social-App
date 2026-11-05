import { Outlet } from "react-router"
import Navbar from "../Components/Navbar/Navbar"

function Mainlayout() {
  return (<>
  <main className="bg-sec">
    <Navbar/>
    <Outlet/>
  </main>
    </>
  )
}

export default Mainlayout