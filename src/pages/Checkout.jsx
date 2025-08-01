import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';

import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { server } from '@/main';

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    phone: '',
  });

  // Fetch all addresses
  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          token: Cookies.get('token'),
        },
      });
      setAddress(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // Handle new address submission
  const handleAddAddress = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        {
          address: newAddress.address,
          phone: newAddress.phone,
        },
        {
          headers: {
            token: Cookies.get('token'),
          },
        }
      );

      if (data.message) {
        toast.success(data.message);
        fetchAddress();
        setNewAddress({ address: '', phone: '' });
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add address');
    }
  };

  // Handle address deletion
  const deleteHandler = async (id) => {
   if(confirm("Are you sure you want to delete")){
    try {
        const { data } = await axios.delete(`${server}/api/address/${id}`, {
          headers: {
            token: Cookies.get('token'),
          },
        });
  
        if (data.message) {
          toast.success(data.message);
          fetchAddress();
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete address');
      }
   }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {address && address.length > 0 ? (
              address.map((e) => (
                <div className="p-4 border rounded-lg shadow-sm" key={e._id}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Address - {e.address}</h3>
                    <Button variant="destructive" size="icon" onClick={() => deleteHandler(e._id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm">Phone - {e.phone}</p>
                  <Link to={`/payment/${e._id}`}>
                    <Button variant="outline" className="mt-2 w-full">
                      Use Address
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p>No address found</p>
            )}

            {/* Add New Address Card */}
            <div
              className="p-4 border rounded-lg shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100"
              onClick={() => setModalOpen(true)}
            >
              <span className="text-md font-semibold">Add New Address</span>
            </div>
          </div>

          {/* Add Address Modal */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" onClick={handleAddAddress}>
                  Add Address
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
