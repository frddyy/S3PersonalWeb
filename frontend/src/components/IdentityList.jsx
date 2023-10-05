import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const IdentityList = () => {
  const [identities, setIdentities] = useState([]);

  useEffect(() => {
    getIdentities();
  }, []);

  const getIdentities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/identities");
      setIdentities(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteIdentity = async (identityId) => {
    await axios.delete(`http://localhost:5000/identities/${identityId}`);
    getIdentities();
  };

  return (
    <div>
      <h1 className="title">Identities</h1>
      <h2 className="subtitle">List of Identities</h2>
      <Link to="/identities/add" className="button is-primary mb-2">
        Add New
      </Link>
      <div className="table-container">
        <table className="table is-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Image</th>
              <th>Place of Birth</th>
              <th>Date of Birth</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {identities.map((identity, index) => (
              <tr key={identity.id}>
                <td>{index + 1}</td>
                <td>{identity.name}</td>
                <td>{identity.image}</td>
                <td>{identity.place_of_birth}</td>
                <td>{identity.date_of_birth}</td>
                <td>{identity.address}</td>
                <td>{identity.phone_number}</td>
                <td>{identity.email}</td>
                <td>
                  <Link
                    to={`/identities/edit/${identity.id}`}
                    className="button is-small is-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteIdentity(identity.id)}
                    className="button is-small is-danger"
                  >
                    Delete
                  </button>
                  <button
                    onClick=""
                    className="button is-small is-primary"
                  >
                    Show Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IdentityList;
