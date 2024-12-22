import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'; // Optional: Use if React Router is set up
import Header from './components/Header';
import Hero from './components/Hero';
import Tools from './components/Tools';

function App() {
  return (
    <body className="min-h-screen bg-slate-50 dark:bg-black dark:text-white">
      <main className="max-w-4xl mx-auto">
        <Header />
        <hr className="mx-auto bg-black dark:bg-white w-1/2" />
        <Hero />
        <Tools />
      </main>
    </body>
  )
}

export default App
