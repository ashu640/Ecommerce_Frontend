import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='w-[60%] m-auto flex flex-col justify-center items-center'><img src="/not found.jpeg" alt="" />
    <Link to={'/'}><Button variant="ghost">Go to home</Button></Link>
    
    </div>
  )
}

export default NotFound