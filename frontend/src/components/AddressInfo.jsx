import { Plus } from "lucide-react";
import Addressbar from "./ui/Addressbar";
import AddressInput from "./ui/AddressInput";
import { useState , useEffect } from "react";

const AddressInfo = ({ user }) => {
const [addresses, setAddresses] = useState([
    {
        label: 'HOME',
        fullName: 'John Doe',
        phone: '+1 (555) 123-4567',
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        landmark: 'Central Park',
        isDefault: true,
    },
]);

const [showAddForm, setShowAddForm] = useState(false);

useEffect(() => {
    // In a real app, you'd fetch this from the server
}, []);

const handleAddAddress = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
    setShowAddForm(false);
};

const handleCancelForm = () => {
    setShowAddForm(false);
};
const handleDelete  =(e) =>{
    console.log('Delete address', e);
}
    return (
        <div className="p-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-emerald-100 dark:border-slate-700 pb-4 mb-6">Manage Addresses</h2>
            </div>

            {/* Show Form if showAddForm is true */}
            {showAddForm ? (
                <div className="mb-8">
                    <AddressInput 
                        onSave={handleAddAddress}
                        onCancel={handleCancelForm}
                    />
                </div>
            ) : (
                <div>
                    {/* Add Address Button */}
                    <div 
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center border text-sky-400 border-blue-500 border-dashed rounded-lg p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors mb-6"
                    >
                        <div>
                            <Plus size={16}  />
                        </div>
                        <div className="ml-2 text-sm font-medium">
                            Add New Address
                        </div>
                    </div>
                </div>
            )}

            {/* Display Existing Addresses */}
            <div className="space-y-4">
                {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                        <Addressbar
                            key={index}
                            label={address.label}
                            fullName={address.fullName}
                            phone={address.phone}
                            line1={address.line1}
                            city={address.city}
                            state={address.state}
                            postalCode={address.postalCode}
                            country={address.country}
                            landmark={address.landmark}
                            isDefault={address.isDefault}
                            className={'hover:-translate-y-1 transform duration-150'}
                            onDelete = {handleDelete}
                        />
                    ))
                ):(
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No address for the Given User
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddressInfo
