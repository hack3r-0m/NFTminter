import React, { useState } from 'react'
import axios from 'axios';

export default function Admin({ item }) {
  const [approved, setApproved] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState('');

  const approve = async (e, _id) => {
    try {
      const res = await axios.post("http://127.0.0.1:8080/approve", {
        id: _id,
        withCredentials: true,
        credentials: "include",
      });
      console.log(res.data)
      setApproved(true);
    } catch (e) {
      console.error(e);
      setError('Something went wrong...');
    }
  }
  const decline = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8080/decline", {
        id: _id,
        withCredentials: true,
        credentials: "include",
      });
      console.log(res.data)
      setDeclined(true);
    } catch (e) {
      console.error(e);
      setError('Something went wrong...');
    }
  }
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <p>-------------------------------</p>
      </div>
    )
  }
  if (approved) {
    return (
      <div>
        <p>Approved Successfully!</p>
        <p>-------------------------------</p>
      </div>
    )
  }

  if (declined) {
    return (
      <div>
        <p>Declined Successfully!</p>
        <p>-------------------------------</p>
      </div>
    )
  }

  return (
    <div>
      <p>ObjectId: {item._id}</p>
      <p>Name: {item.name}</p>
      <p>Description: {item.description}</p>
      <p>Image URL: ${item.image}</p>
      <p>External URL: ${item.externam_url}</p>
      <p>Timestamp: ${item.timestamp}</p>
      <button value={item._id} onClick={(e) => approve(e, item._id)}>Approve</button>
      <button value={item._id} onClick={(e) => decline(e, item._id)}>Decline</button>
      <p>-------------------------------</p>
    </div>
  )
}
