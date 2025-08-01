import React from 'react'
import { Button } from './ui/button'
import bgImage from '@/assets/image.jpg';

const Hero = ({navigate}) => {
  return (
    <div className="relative h-[calc(100vh-100px)] bg-cover bg-center"
    style={{
        backgroundImage:`linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.2)),url(${bgImage})`,
        paddingTop:"100px"
    }}
    >
        <div className="flex items-center justify-center h-full text-center text white">

            <div>
                <h1 className='text-4xl sm:6xl font-bold mb-6'>Welcome to your dream shop</h1>
                <p className='text-lg sm:text-2xl mb-8'>
                    Discover amazing products and deals just for u
                </p>
                <Button onClick={()=>navigate("/products")} size='lg'>Shop Now</Button>
            </div>
        </div>




    </div>
  )
}

export default Hero