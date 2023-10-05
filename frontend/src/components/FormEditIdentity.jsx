import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditIdentity = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [place_of_birth, setPlaceOfBirth] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");

  const [msg, setMsg] = useState("");
  const navigate = useNavigate("");
  const { id } = useParams();

  useEffect(() => {
    const getIdentityById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/identities/${id}`
        );
        setName(response.data.name);
        setImage(response.data.image);
        setPlaceOfBirth(response.data.place_of_birth);
        setDateOfBirth(response.data.date_of_birth);
        setAddress(response.data.address);
        setPhoneNumber(response.data.phone_number);
        setEmail(response.data.email);
        setDescription(response.data.description);
        setInstagram(response.data.instagram);
        setLinkedin(response.data.linkedin);
        setTwitter(response.data.twitter);
        setGithub(response.data.github);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getIdentityById();
  }, [id]);

  const updateIdentity = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/identities/${id}`, {
        name: name,
        image: image,
        place_of_birth: place_of_birth,
        date_of_birth: date_of_birth,
        address: address,
        phone_number: phone_number,
        email: email,
        description: description,
        instagram: instagram,
        linkedin: linkedin,
        twitter: twitter,
        github: github,
      });
      navigate("/identities");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Identities</h1>
      <h2 className="subtitle">Edit Identities</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateIdentity}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Image</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Place of Birth</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={place_of_birth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    placeholder="Place of Birth"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Date of Birth</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={date_of_birth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="Date of Birth"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Address</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Phone</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Instagram</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Linkedin</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="Linkedin"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Twitter</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="Twitter"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Github</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="Github"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditIdentity;
