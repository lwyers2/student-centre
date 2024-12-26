import React from 'react'
import { useSelector } from 'react-redux'

const Hero = () => {
  const user = useSelector(state => state.user)
  console.log(user)
  return (
    <>
      <section id="hero" className="flex flex-col-reverse justify-center sm:flex-row p-6 items-center gap-8 mb-12 scroll-mt-40">
        <article className="sm:w-1/2">
          <h2 className="max-w-md text-6xl font-bold text-center text-slate-900 dark:text-white">
          Admin Centre
          </h2>
        </article>
      </section>
      <br></br>
      {user ? (
        <div className="flex flex-col-reverse justify-center sm:flex-row p-6 items-center gap-8 mb-12 scroll-mt-40">
          <h3 className ="max-w-md text-2xl font-bold text-center text-slate-900 dark:text-white">Welcome {user.forename} {user.surname}</h3>
        </div>
      )
        :
        (
          <div className="flex flex-col-reverse justify-center sm:flex-row p-6 items-center gap-8 mb-12 scroll-mt-40">
            <h3 className="max-w-md text-2xl font-bold text-center text-slate-900 dark:text-white">Log in below to use admin Centre</h3>
          </div>
        )
      }
    </>
  )

}

export default Hero