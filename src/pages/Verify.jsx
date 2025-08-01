import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/context/UserContext";
import { CartData } from "@/context/cartContext";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const { btnLoading,LoginUser,verifyUser } = UserData();
  const {fetchCart} =CartData()
  const navigate = useNavigate();

  const submitHandler = () => {
    verifyUser(Number(otp),navigate,fetchCart)
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
const handleResendOtp=async()=>{
const email=localStorage.getItem("email")
await LoginUser(email,navigate)
setTimer(10)
setCanResend(false);


}
  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Verify using OTP</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            If you didn’t receive the OTP, please check your spam folder.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button
            className="w-full"
            disabled={btnLoading}
            onClick={submitHandler}
          >
            {btnLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={16} />
              </span>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm font-medium">
            {canResend
              ? "You can now resend the OTP"
              : `Time remaining: ${formatTime(timer)}`}
          </p>
          <Button
            variant="secondary"
            disabled={!canResend}
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Verify;
