import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form p-5 shadow-sm bg-white">
              <h2 className="text-center mb-4">Get in Touch</h2>
              <form
                action="https://api.web3forms.com/submit"
                method="POST"
              >
                <input
                  type="hidden"
                  name="access_key"
                  value="e0630778-a382-4f61-93cd-649c0c7d1ae7"
                />
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="first_name"
                      className="form-control custom-input"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">+91</span>
                      <input
                        type="tel"
                        className="form-control custom-input"
                        placeholder="Phone Number"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        required
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      className="form-control custom-input"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control custom-input"
                      rows="5"
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
