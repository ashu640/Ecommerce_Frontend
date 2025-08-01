import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserData } from '@/context/UserContext'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email,setEmail]=useState("");
    const {LoginUser,btnLoading}=UserData()
    const navigate=useNavigate()

    const submitHandler=()=>{
       LoginUser(email,navigate);

    }
  return (
    <div className='min-h-[60vh]'>
        <Card className="md:w-[400px] sm:w-[300px] m-auto mt-5">
            <CardHeader>
                <CardTitle>Enter email to get Otp</CardTitle>
                <CardDescription>
                    if you have already got on mail then you can directly go to otp
                </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-2">
                <div className="space-y-1">
                <Label>Enter Email</Label>
                <Input type="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                </div>
            </CardContent>
            <CardFooter>
                <Button disabled={btnLoading} onClick={submitHandler}>{btnLoading?<Loader/>:"Submit"}</Button>
            </CardFooter>
        </Card>
    </div>
  )
}

export default Login