import React from 'react'
import "./contact.css"

const Contact = () => {
  return (
    <section className="contact container section" id='content'>
      <h2 className="section__title"> Get In Touch</h2>

      <div className="contact__container grid">
        <div className="contact__info">
          <h3 className="contact__title">Let's talk about Everything</h3>
          <p className="contact__details">Dont like forms?</p>
        </div>

        <form action="" className="contact__form">
          <div className="contact__form-group">
            <div className="contact__form-div">
              <input type="text" className="contact__form-input" placeholder='insert your name'/>
            </div>

            <div className="contact__form-div">
              <input type="email" className="contact__form-input" placeholder='insert your email'/>
            </div>

            <div className="contact__form-div">
              <input type="text" className="contact__form-input" placeholder='insert your subject'/>
            </div>

            <div className="contact__form-div contact__form-area">
              <textarea name="" id="" cols="30" rows="10" className='contact__form-input' placeholder='write your message'>
              </textarea>
            </div>

            <button className="btn">Send Message</button>

          </div>
        </form>
      </div>
    </section>
)

}

export default Contact