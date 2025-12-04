import React,{useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PartnerProfileUser = () => {
  const { id } = useParams();
  const [partnerProfile, setPartnerProfile] = useState(null);

  useEffect(() => {
    const fetchPartnerProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/profile/foodpartner/${id}`);
        setPartnerProfile(response.data);
        console.log('Partner Profile:', response.data);
      } catch (error) {
        console.error('Error fetching partner profile:', error);
      }
    };

    fetchPartnerProfile();
  }, [id]);
  return (
    <div>
      {partnerProfile ? (
        <div>
          <h1>{partnerProfile.restaurantName || 'No Restaurant Name'}</h1>
          <p>Name: {partnerProfile.name}</p>
          <p>Email: {partnerProfile.email}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>Loading partner profile...</p>
      )}
      {/* Debugging output */}
      {partnerProfile && <pre>{JSON.stringify(partnerProfile, null, 2)}</pre>}
      {!partnerProfile && <p>No profile data available.</p>}
    </div>
  )
}

export default PartnerProfileUser
