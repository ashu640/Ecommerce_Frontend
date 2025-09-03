import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/context/UserContext";
import { CartData } from "@/context/cartContext";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthLogin = ({ step, setStep, onSuccess }) => {
   // "login" | "verify"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);

  const { btnLoading, LoginUser, verifyUser } = UserData();
  const { fetchCart } = CartData();
  const navigate = useNavigate();
  const { t } = useTranslation("auth"); // i18n namespace: "auth"

  // Handle login submission (send OTP)
  const handleLogin = async () => {
    if (!email) return;
    await LoginUser(email, navigate); // send OTP
    localStorage.setItem("email", email);
    setStep("verify");
    setTimer(10);
    setCanResend(false);
  };

  // Handle OTP verification
  const handleVerify = async () => {
    if (!otp) return;
    await verifyUser(Number(otp), navigate, fetchCart);
    if (onSuccess) onSuccess(); // notify parent (Navbar) to close Dialog
  };

  // Timer logic for resend
  useEffect(() => {
    if (step === "verify" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (step === "verify" && timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  // Resend OTP
  const handleResendOtp = async () => {
    const emailStored = localStorage.getItem("email");
    if (!emailStored) return;
    await LoginUser(emailStored, navigate);
    setTimer(10);
    setCanResend(false);
  };

  return (
    <>
      {step === "login" ? (
        <>
          {/* Login Step */}
          <div className="space-y-3">
            <Label>{t("login.emailLabel", { defaultValue: "Email Address" })}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login.emailPlaceholder", { defaultValue: "Enter your email" })}
            />

            <Button
              disabled={btnLoading}
              onClick={handleLogin}
              className="w-full mt-4"
            >
              {btnLoading ? (
                <Loader className="animate-spin" />
              ) : (
                t("login.submitBtn", { defaultValue: "Send OTP" })
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Verify OTP Step */}
          <div className="space-y-3">
            <Label htmlFor="otp">{t("verify.label", { defaultValue: "OTP" })}</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={t("verify.placeholder", { defaultValue: "Enter OTP" })}
            />

            <Button
              disabled={btnLoading}
              onClick={handleVerify}
              className="w-full mt-4"
            >
              {btnLoading ? (
                <Loader className="animate-spin" />
              ) : (
                t("verify.submit", { defaultValue: "Verify" })
              )}
            </Button>
          </div>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm font-medium">
              {canResend
                ? t("verify.canResend", { defaultValue: "Didn't get the OTP? You can resend." })
                : `${t("verify.timeRemaining", { defaultValue: "Time remaining" })}: ${String(
                    Math.floor(timer / 60)
                  ).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
            </p>
            <Button
              variant="secondary"
              disabled={!canResend}
              onClick={handleResendOtp}
            >
              {t("verify.resend", { defaultValue: "Resend OTP" })}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default AuthLogin;
