import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';

const SAMPLE_ADDRESSES = [
  {
    id: 'addr_home',
    label: 'Home',
    fullName: 'Shubham Giri',
    phone: '9876543210',
    locality: 'Dal Dali Bazar',
    address: 'PD House, Mouna Banganj',
    city: 'Chapra',
    state: 'Bihar',
    postalCode: '841301',
    country: 'India',
    landmark: 'Near Main Road',
  },
  {
    id: 'addr_work',
    label: 'Work',
    fullName: 'Shubham Giri',
    phone: '9876543210',
    locality: 'Civil Lines',
    address: '2nd Floor, Skyline Tower',
    city: 'Chapra',
    state: 'Bihar',
    postalCode: '841302',
    country: 'India',
    landmark: 'Opp. SBI Bank',
  },
];

const formatMoney = (amount) => `Rs ${Number(amount || 0).toFixed(2)}`;

const CheckoutPage = () => {
  const location = useLocation();
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();
  const food = location.state?.food;

  const [selectedAddressId, setSelectedAddressId] = useState();
  const [quantity, setQuantity] = useState(1);

  const getAddres = async() =>{
      await profileAPI.getAddress().then((response)=>{
      console.log('address response', response);
      setAddresses(response.data);
      setSelectedAddressId(response.data[0]?._id);
    }).catch((error)=>{

    })
  }

  useEffect(()=>{
  getAddres();
  },[])

  const selectedAddress = useMemo(
    () => addresses.find((addr) => addr._id === selectedAddressId),
    [selectedAddressId]
  );

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">No item selected</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Go back to reels and click Order Now on a food item.
          </p>
          <div className="mt-6">
            <Link
              to="/reel"
              className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Back To Reel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unitPrice = Number(food.price || 0);
  const itemTotal = unitPrice * quantity;
  const deliveryFee = itemTotal > 399 ? 0 : 35;
  const discount = itemTotal > 499 ? 40 : 0;
  const finalTotal = itemTotal + deliveryFee - discount;

  const orderPreview = {
    user: 'current-user-id',
    foodPartner: food.partnerId || 'partner-id',
    userAddressId: selectedAddress?.id,
    deliveryAddressSnapshot: selectedAddress,
    items: [
      {
        food: food._id,
        nameSnapshot: food.name,
        quantity,
        priceSnapshot: unitPrice,
      },
    ],
    price: finalTotal,
    status: 'placed',
    paymentStatus: 'pending',
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-950 dark:text-white">
      <header className="border-b border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Checkout</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">Preview Mode</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-2">
        <section className="space-y-6">
          <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delivery Address</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose an available address for this order.</p>

            <div className="mt-4 space-y-3 overflow-y-auto max-h-56 " style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(100, 100, 100, 0.5) transparent',
            }} >
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address._id;
                return (
                  <label
                    key={address._id}
                    className={`block cursor-pointer rounded-lg border p-4 transition ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
                        : 'border-gray-300 bg-white hover:border-blue-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(address._id)}
                        className="mt-1 h-4 w-4 accent-blue-700"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {address.label} - {address.fullName}
                        </p>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {address.address}, {address.locality}, {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Phone: {address.phone}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span>Item Total</span>
                <span>{formatMoney(itemTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatMoney(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between text-green-700 dark:text-green-400">
                <span>Discount</span>
                <span>- {formatMoney(discount)}</span>
              </div>
              <div className="my-2 border-t border-gray-300 dark:border-gray-700" />
              <div className="flex items-center justify-between text-base font-semibold text-gray-900 dark:text-gray-100">
                <span>Total Payable</span>
                <span>{formatMoney(finalTotal)}</span>
              </div>
            </div>

            <button className="mt-5 w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">
              Place Order
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Food</h2>

            <div className="mt-4 grid grid-cols-[110px_1fr] gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <img
                src={food.image || 'https://via.placeholder.com/180x180?text=Food'}
                alt={food.name}
                className="h-28 w-28 rounded-md object-cover"
              />
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{food.name}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {food.description || 'Freshly prepared item from your selected partner.'}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Partner: {food.partnerName || 'Restaurant Partner'}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{formatMoney(unitPrice)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">Quantity</span>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-8 w-8 rounded-md border border-gray-300 text-lg dark:border-gray-700"
              >
                -
              </button>
              <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="h-8 w-8 rounded-md border border-gray-300 text-lg dark:border-gray-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-300 bg-gray-50 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Order Schema Preview</h3>
            <pre className="mt-3 max-h-72 overflow-auto rounded-md bg-black p-3 text-xs text-blue-200">
             {JSON.stringify(orderPreview, null, 2)}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CheckoutPage;
