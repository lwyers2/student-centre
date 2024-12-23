import React from 'react'

const Hero = () => {
  return (
    <section id="hero" className="flex flex-col-reverse justify-center sm:flex-row p-6 items-center gap-8 mb-12 scroll-mt-40">
      <article className="sm:w-1/2">
        <h2 className="max-w-md text-6xl font-bold text-center text-slate-900 dark:text-white">
          Admin Centre
        </h2>
      </article>
    </section>
  )
}

export default Hero