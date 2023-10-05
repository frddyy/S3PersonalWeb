import React from 'react'

const FormEditIdentity = () => {
  return (
    <div>
    <h1 className="title">Identities</h1>
      <h2 className="subtitle">Edit Identities</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form>
              <div className="field">
                <label className="label">Identity Name</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Identity name" />
                </div>
              </div>
              <div className="field">
                <label className="label">Image</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Image" />
                </div>
              </div>
              <div className="field">
                <label className="label">Place of Birth</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Place of Birth" />
                </div>
              </div>
              <div className="field">
                <label className="label">Date of Birth</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Date of Birth" />
                </div>
              </div>
              <div className="field">
                <label className="label">Address</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Address" />
                </div>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Email" />
                </div>
              </div>
              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Description" />
                </div>
              </div>
              <div className="field">
                <label className="label">Instagram</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Instagram" />
                </div>
              </div>
              <div className="field">
                <label className="label">Linkedin</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Linkedin" />
                </div>
              </div>
              <div className="field">
                <label className="label">Twitter</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Twitter" />
                </div>
              </div>
              <div className="field">
                <label className="label">Github</label>
                <div className="control">
                  <input type="text" className="input" placeholder="Github" />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-success">Update</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormEditIdentity;