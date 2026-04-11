import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config/Api';

export default function usePartnerFoodItems(partnerId) {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const fetchFoodItems = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/foods/getfood/${partnerId}`, {
        withCredentials: true
      });
      setFoodItems(response.data.fooditems || response.data.foodItems || []);
      setError('');
    } catch (err) {
      console.error('Error fetching food items:', err);
      setError(err.message || 'Failed to fetch food items.');
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

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
    foodItems,
    loading,
    error,
    editLoading,
    deleteFoodItem,
    updateFoodItem,
    refreshFoodItems: fetchFoodItems
  };
}