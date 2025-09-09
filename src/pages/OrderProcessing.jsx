import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "@/main";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { CartData } from "@/context/cartContext";
import { Loader } from "lucide-react";

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { fetchCart } = CartData();
  const { t } = useTranslation("orders");

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error(t("missingSession"));
        return navigate("/cart");
      }

      if (paymentVerified) {
        return;
      }

      setLoading(true);

      try {
        const { data } = await axios.post(
          `${server}/api/order/verify/payment`,
          { sessionId },
          { withCredentials: true }
        );

        if (data.success) {
          toast.success(t("orderSuccessToast"));
          setPaymentVerified(true);
          fetchCart();
          setLoading(false);
          setTimeout(() => {
            navigate("/orders");
          }, 10000);
        }
      } catch (error) {
        toast.error(t("paymentFailedToast"));
        navigate("/cart");
        console.log(error);
      }
    };

    if (sessionId && !paymentVerified) {
      verifyPayment();
    }
  }, [sessionId, paymentVerified, navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-500">
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-clip max-w-lg text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            {t("processingTitle")}
          </h1>
          <p className="text-lg text-gray-700 mb-6">{t("processingMessage")}</p>
          <Loader className="mx-auto animate-spin text-blue-600 w-8 h-8" />
          <div className="text-xl text-gray-500 mt-2">{t("processingStatus")}</div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-4xl font-bold text-green-500 mb-4">
            {t("successTitle")}
          </h1>
          <p className="text-gray-600 text-lg mb-6">{t("successMessage")}</p>
          <Button onClick={() => navigate("/orders")}>
            {t("goToOrders")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderProcessing;
