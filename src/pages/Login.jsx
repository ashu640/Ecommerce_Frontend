import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/context/UserContext";
import { CartData } from "@/context/cartContext";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthDialog = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("login"); // "login" | "verify"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);

  const { btnLoading, LoginUser, verifyUser } = UserData();
  const { fetchCart } = CartData();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  // Handle login submission (send OTP)
  const handleLogin = async () => {
    await LoginUser(email);
    localStorage.setItem("email", email);
    setStep("verify");
    setTimer(10);
    setCanResend(false);
  };

  // Handle OTP verification
  const handleVerify = async () => {
    await verifyUser(Number(otp), navigate, fetchCart);
    setOpen(false); // close dialog after successful verify
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
    const email = localStorage.getItem("email");
    await LoginUser(email, navigate);
    setTimer(10);
    setCanResend(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button (could be login in navbar) */}
      <DialogTrigger asChild>
        <Button variant="outline">{t("login.title")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {step === "login" ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("login.title")}</DialogTitle>
              <DialogDescription>{t("login.description")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              <Label>{t("login.emailLabel")}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
              />

              <Button
                disabled={btnLoading}
                onClick={handleLogin}
                className="w-full mt-4"
              >
                {btnLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  t("login.submitBtn")
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("verify.title")}</DialogTitle>
              <DialogDescription>{t("verify.subtitle")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              <Label htmlFor="otp">{t("verify.label")}</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t("verify.placeholder")}
              />

              <Button
                disabled={btnLoading}
                onClick={handleVerify}
                className="w-full mt-4"
              >
                {btnLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  t("verify.submit")
                )}
              </Button>
            </div>

            <div className="mt-4 text-center space-y-2">
              <p className="text-sm font-medium">
                {canResend
                  ? t("verify.canResend")
                  : `${t("verify.timeRemaining")}: ${String(
                      Math.floor(timer / 60)
                    ).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
              </p>
              <Button
                variant="secondary"
                disabled={!canResend}
                onClick={handleResendOtp}
              >
                {t("verify.resend")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
