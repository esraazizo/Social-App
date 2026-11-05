import { Outlet } from "react-router"
import AuthIntro from "../Components/AuthIntro/AuthIntro"

function Authlayout() {
  return (
    <>
      <main className="min-h-screen bg-sec lg:p-25">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 ">

            <section className="order-2 lg:order-1">
              <AuthIntro />
            </section>

            <section className="order-1 lg:order-2">
              <Outlet />
            </section>

          </div>
        </div>



      </main>
    </>
  )
}

export default Authlayout