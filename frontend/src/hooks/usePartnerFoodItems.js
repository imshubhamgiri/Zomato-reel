import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config/Api';
import { partnerAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';
const mapProfile = (profile = {}) => ({
  name: profile?.name || '',
  email: profile?.email || '',
  phone: profile?.phone || '',
  gender: profile?.gender || '',
});

export default function usePartnerFoodItems(partnerId, autoFetchFood = true) {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const{ user ,setUser } = useAppContext();


    const fetchProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setError('');
    try { 
      const result = await partnerAPI.getProfile();
      const profile = result?.data;
      if (!profile || typeof profile !== 'object') {
        throw new Error('Invalid profile response');
      }
      const mapped = mapProfile(profile);
      setUser({...user, ...mapped});
      return mapped;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Failed to fetch profile.');
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
    },[]);


  const fetchFoodItems = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/foods`, {
        withCredentials: true
      });
      setFoodItems(response.data.data || response.data.foodItems || []);
      setError('');
    } catch (err) {
      console.error('Error fetching food items:', err);
      setError(err.message || 'Failed to fetch food items.');
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    if (autoFetchFood) {
      fetchFoodItems();
    }
  }, [fetchFoodItems, autoFetchFood]);

  const deleteFoodItem = async (foodId) => {
    try {
      await axios.delete(`${API_URL}/api/foods/delete`, {
        data: { foodId },
        withCredentials: true
      });
      setFoodItems(prev => prev.filter(item => item._id !== foodId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting food item:', err);
      return { success: false, error: err };
    }
  };

  const updateFoodItem = async (formData) => {
    setEditLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/foods/update`, formData, {
        withCredentials: true
      });
      
      setFoodItems(prev => 
        prev.map(item => 
          item._id === formData.foodId 
            ? { ...item, name: formData.name, description: formData.description, price: formData.price }
            : item
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error updating food item:', err);
      return { success: false, error: err };
    } finally {
      setEditLoading(false);
    }
  };

  return {
    fetchProfile,
    foodItems,
    loading,
    error,
    editLoading,
    deleteFoodItem,
    updateFoodItem,
    refreshFoodItems: fetchFoodItems
  };
}