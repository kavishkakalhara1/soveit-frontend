import React from 'react'
import NotFoundGif from '../assets/404.png'; // Import the GIF file

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      
      <img src={NotFoundGif} alt="404 Error" className="h-auto mb-4 w-80" />
      <h1 className="mt-4 text-4xl ">The Page You're Looking for does not Exist.</h1>
    </div>
  )
}
