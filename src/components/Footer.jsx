import { Facebook, X, Youtube } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
<footer className="w-full mt-8">
  <hr  className="border border-gray-300 dark:border-gray-700"/>

  <div className="container mx-auto px-4 py-6">

    <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 flex-col md:flex-rpw justify-between items-center">
            <h1 className="text-xl font-bold">QuickCart</h1>
            <p className="text-sm">Your one-stop shop for everything</p>
        </div>
        <div className='flex flex-wrap justify-center md:justify-end gap-4'>
            <a href="" className='text-sm hover:text-underline'>About Us</a>
            <a href="" className='text-sm hover:text-underline'>Contact</a>
            <a href="" className='text-sm hover:text-underline'>Privacy Policy</a>
            <a href="" className='text-sm hover:text-underline'>Terms and conditions</a>

        </div>
    </div>
    <div className='mt-6 text-center'>

        <p className='text-sm'>Follow Us</p>
        <div className='flex justify-center gap-4 mt-2'>

        <a href="#" className='hover:opacity-75'><Facebook></Facebook></a>
        <a href="#" className='hover:opacity-75'><X></X></a>
        <a href="#" className='hover:opacity-75'><Youtube></Youtube></a>
        </div>
    </div>
  </div>
</footer>
  )
}

export default Footer