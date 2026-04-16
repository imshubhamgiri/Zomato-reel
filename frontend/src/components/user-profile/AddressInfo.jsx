import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Addressbar from '../ui/Addressbar';
import AddressInput from '../ui/AddressInput';
import { profileAPI } from '../../services/api';

const AddressInfo = () => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const getaddress = async () => {
    const response = await profileAPI.getAddress();
    console.log('address response', response);
    setAddresses(response.data);
  };

  useEffect(() => {
    getaddress();
  }, []);

  const handleAddAddress = async (newAddress) => {
    try {
      const response = await profileAPI.addAddress(newAddress);
      setAddresses((prev) => [...prev, response.data]);
      toast.success('Address added successfully');
      setShowAddForm(false);
    } catch (error) {
      console.log('error adding address', error);
      toast.error('Failed to add address');
    }
  };

  const handleUpdateAddress = async (updatedData) => {
    try {
      const response = await profileAPI.updateAddress(editingAddress.id, updatedData);
      setAddresses((prev) => prev.map((addr) => (addr._id === editingAddress.id ? response.data : addr)));
      toast.success('Address updated successfully');
      setEditingAddress(null);
      setShowAddForm(false);
    } catch (error) {
      console.log('error updating address', error);
      toast.error('Failed to update address');
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleDelete = async (addressId) => {
    try {
      await profileAPI.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error) {
      console.log('error deleting address', error);
      toast.error('Failed to delete address');
    }
  };

  const handleEditAddress = (addressData) => {
    setEditingAddress(addressData);
    setShowAddForm(true);
  };

  return (
    <div className="p-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-emerald-100 dark:border-slate-700 pb-4 mb-6">Manage Addresses</h2>
      </div>

      {showAddForm ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <AddressInput
            initialData={editingAddress}
            onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <div>
          <div
            onClick={() => setShowAddForm(true)}
            className="flex items-center border text-sky-400 border-blue-500 border-dashed rounded-lg p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors mb-6"
          >
            <div>
              <Plus size={16} />
            </div>
            <div className="ml-2 text-sm font-medium">
              Add New Address
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <Addressbar
              key={index}
              id={address._id}
              label={address.label}
              fullName={address.fullName}
              address={address.address}
              phone={address.phone}
              locality={address.locality}
              city={address.city}
              state={address.state}
              postalCode={address.postalCode}
              country={address.country}
              landmark={address.landmark}
              isDefault={address.isDefault}
              className={'hover:-translate-y-1 transform duration-150'}
              onDelete={handleDelete}
              onEdit={handleEditAddress}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No address for the Given User
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressInfo;
