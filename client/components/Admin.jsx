import React, { useState } from 'react'
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

const Admin = ({ item, token, signerAddress, setIsAuth }) => {
  const [approved, setApproved] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const approve = async (e, _id) => {
    try {
      setLoading(true);
      // console.log("Approving id", _id)
      const res = await axios.post(`/api/approve`, {
        id: _id,
        withCredentials: true,
        credentials: "include",
      }, {
        headers: {
          address: signerAddress,
          token: token
        }
      });
      console.log(res.data)
      setApproved(true);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
      setIsAuth(false);
      localStorage.removeItem('token');
      setError('Something went wrong...');
    }
  }
  const decline = async (e, _id) => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/decline`, {
        id: _id,
        withCredentials: true,
        credentials: "include",
      }, {
        headers: {
          address: signerAddress,
          token: token
        }
      });
      // console.log(res.data)
      setDeclined(true);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
      setIsAuth(false);
      localStorage.removeItem('token');
      setError('Something went wrong...');
    }
  }

  if (loading) {
    return (
      <CircularProgress color="secondary" />
    )
  }
  if (error) {
    return (
      <div style={{ width: 'max-content', border: '2px dashed black', margin: '5px 0' }}>
        <p>{error}</p>
      </div>
    )
  }
  if (approved) {
    return (
      <div style={{ width: 'max-content', border: '2px dashed black', margin: '5px 0' }}>
        <p>Approved Successfully!</p>
      </div>
    )
  }

  if (declined) {
    return (
      <div style={{ width: 'max-content', border: '2px dashed black', margin: '5px 0' }}>
        <p>Declined Successfully!</p>
      </div>
    )
  }

  return (
    <div style={{ width: 'max-content', border: '2px dashed black', margin: '5px 0' }}>
      <p>ObjectId: {item._id}</p>
      <p>Name: {item.name}</p>
      <p>Description: {item.description}</p>
      <p>Image URL: ${item.image}</p>
      <p>External URL: ${item.externam_url}</p>
      <p>Timestamp: ${item.timestamp}</p>
      <button value={item._id} onClick={(e) => approve(e, item._id)}>Approve</button>
      <button value={item._id} onClick={(e) => decline(e, item._id)}>Decline</button>
    </div>
  )
}

export default Admin;
