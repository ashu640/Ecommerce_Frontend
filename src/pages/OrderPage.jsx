import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/context/UserContext";
import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderPage = () => {
  const { t, i18n } = useTranslation("orders");
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const { user } = UserData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          withCredentials: true,
        });
        setOrder(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm(t("confirmCancel"))) return;

    try {
      setCancelling(true);
      const { data } = await axios.post(
        `${server}/api/order/${id}/cancel`,
        { withCredentials: true }
      );
      setOrder(data.order); // update order state with cancelled order
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-600">{t("noOrder")}</h1>
        <Button onClick={() => navigate("/products")}>{t("shopNow")}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {user._id === order.user._id || user.role === "admin" ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  {t("orderDetails")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={() => window.print()}>{t("printOrder")}</Button>

                  {/* ✅ Cancel button shown only if order is not cancelled yet */}
                  {order.status !== "cancelled" &&
                    order.status !== "shipped" &&
                    order.status !== "delivered" && (
                      <Button
                        variant="destructive"
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                      >
                        {cancelling ? t("cancelling") : t("cancelOrder")}
                      </Button>
                    )}
                </div>
              </div>
            </CardHeader>

            {/* Order summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">{t("summary")}</h2>
                <p>
                  <strong>{t("orderId")}: </strong>
                  {order._id}
                </p>
                <p>
                  <strong>{t("status")}: </strong>
                  <span
                    className={`${
                      order.status === "Pending"
                        ? "text-yellow-500"
                        : order.status === "cancelled"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {t(order.status.toLowerCase())}
                  </span>
                </p>
                <p>
                  <strong>{t("totalItems")}: </strong>
                  {order.items.length}
                </p>
                <p>
                  <strong>{t("paymentMethod")}: </strong>
                  {order.method}
                </p>
                <p>
                  <strong>{t("subTotal")}: </strong>₹{order.subTotal}
                </p>
                <p>
                  <strong>{t("placedAt")}: </strong>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>{t("paidAt")}: </strong>
                  {order.paidAt || t("cod")}
                </p>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("shippingDetails")}
                </h2>
                <p>
                  <strong>{t("phone")}: </strong> {order.phone}
                </p>
                <p>
                  <strong>{t("address")}: </strong> {order.address}
                </p>
                <p>
                  <strong>{t("user")}: </strong>{" "}
                  {order.user?.email || t("guest")}
                </p>
              </div>
            </div>
          </Card>

          {/* Order items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {order.items.map((e, i) => {
              const lang = i18n.language || "en";
              const productTitle =
                typeof e.product.title === "object"
                  ? e.product.title[lang]
                  : e.product.title;

              return (
                <Card key={i}>
                  <Link to={`/product/${e.product._id}`}>
                    <img
                      src={e.product.images[0]?.url}
                      alt={productTitle}
                      className="max-w-full max-h-full object-contain"
                    />
                  </Link>
                  <CardContent>
                    <h3 className="text-lg font-semibold">{productTitle}</h3>
                    <p>
                      <strong>{t("quantity")}: </strong> {e.quantity}
                    </p>
                    <p>
                      <strong>{t("price")}: </strong> ₹{e.product.price}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-red-500 text-3xl text-center">
          {t("notYourOrder")}
          <br />
          <Link to="/" className="mt-4 underline text-blue-400">
            {t("goHome")}
          </Link>
        </p>
      )}
    </div>
  );
};

export default OrderPage;
