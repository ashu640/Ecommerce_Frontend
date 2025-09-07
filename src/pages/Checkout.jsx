import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { server } from "@/main";

const Checkout = () => {
  const { t } = useTranslation("checkout");
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    alternatePhone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
  });

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        withCredentials: true,
      });
      setAddress(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleAddAddress = async () => {
    try {
      const { data } = await axios.post(`${server}/api/address/new`, newAddress, {
        withCredentials: true,
      });

      if (data.message) {
        toast.success(data.message);
        fetchAddress();
        setNewAddress({
          fullName: "",
          phone: "",
          alternatePhone: "",
          addressLine1: "",
          addressLine2: "",
          landmark: "",
          city: "",
          state: "",
          country: "India",
          postalCode: "",
        });
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || t("errors.addFail"));
    }
  };

  const deleteHandler = async (id) => {
    if (confirm(t("confirmDelete"))) {
      try {
        const { data } = await axios.delete(`${server}/api/address/${id}`, {
          withCredentials: true,
        });

        if (data.message) {
          toast.success(data.message);
          fetchAddress();
        }
      } catch (error) {
        toast.error(error.response?.data?.error || t("errors.deleteFail"));
      }
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {address.length > 0 ? (
              address.map((e) => (
                <div className="p-4 border rounded-lg shadow-sm" key={e._id}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{e.fullName}</h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteHandler(e._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{e.addressLine1}, {e.addressLine2}</p>
                  <p className="text-sm">{e.landmark}</p>
                  <p className="text-sm">
                    {e.city}, {e.state}, {e.postalCode}, {e.country}
                  </p>
                  <p className="text-sm">{t("phone")}: {e.phone}</p>
                  {e.alternatePhone && (
                    <p className="text-sm">{t("altPhone")}: {e.alternatePhone}</p>
                  )}
                  <Link to={`/payment/${e._id}`}>
                    <Button variant="outline" className="mt-2 w-full">
                      {t("useAddress")}
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p>{t("noAddress")}</p>
            )}

            <div
              className="p-4 border rounded-lg shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100"
              onClick={() => setModalOpen(true)}
            >
              <span className="text-md font-semibold">{t("addNew")}</span>
            </div>
          </div>

          {/* Modal */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t("addNew")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                <Input
                  placeholder={t("name")}
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress,  fullName: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder={t("phone")}
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder={t("altPhone")}
                  value={newAddress.alternatePhone}
                  onChange={(e) => setNewAddress({ ...newAddress, alternatePhone: e.target.value })}
                />
                <Input
                  placeholder={t("addressLine1")}
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                />
                <Input
                  placeholder={t("addressLine2")}
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                />
                <Input
                  placeholder={t("landmark")}
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                />
                <Input
                  placeholder={t("city")}
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <Input
                  placeholder={t("state")}
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <Input
                  placeholder={t("postalCode")}
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                />
                <Input
                  placeholder={t("country")}
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  {t("close")}
                </Button>
                <Button variant="outline" onClick={handleAddAddress}>
                  {t("addBtn")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Checkout;
