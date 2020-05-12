import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

let sendEmailMutation = gql`
mutation($emailInput: EmailInput!) {
  sendEmailMessage(data: $emailInput)
}
`

const Contact = (props) => (
  <div className='contactus-1 section-image' style={{backgroundImage: `url()`}}>
    <div className='container'>
      <div className='row'>
        <div className='col-md-5'>
          <h2 className='title'>Get in Touch</h2>
          <h4 className='description'>We'd love to hear from you! <br /><br />

Get in touch to ask questions, get help, or start advertising with The Daily Leaf!<br /><br />

Our team is always looking to meet new people and help you navigate the cannabis industry.</h4>
          <div className='info info-horizontal'>
            <div className='icon icon-primary'>
              <i className='now-ui-icons location_pin' />
            </div>
            <div className='description'>
              <h4 className='info-title'>TDL Headquarters</h4>
              <p className='description'> 534 SW 3rd Ave.
                  <br /> Portland, Oregon,
                  <br /> 97204
              </p>
            </div>
          </div>
          <div className='info info-horizontal'>
            <div className='icon icon-primary'>
              <i className='now-ui-icons tech_mobile' />
            </div>
            <div className='description'>
              <h4 className='info-title'>Looking To Advertise With TDL?</h4>
              <p className='description'>Contact Us Today
                  <br /> (503) 468-6228
                  <br /> Monday - Friday 9:00AM - 5:00PM
              </p>
            </div>
          </div>
        </div>
        <div className='col-md-5 ml-auto mr-auto'>
          <div className='card card-contact card-raised'>
            <form onSubmit={props.handleSubmit(props.onSubmit)}>
              <div className='card-header text-center'>
                <h4 className='card-title'>Contact Us</h4>
              </div>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-6 pr-2'>
                    <label>First name</label>
                    <div className='input-group'>
                      <span className='input-group-addon'>
                        <i className='now-ui-icons users_circle-08' />
                      </span>
                      <Field type='text' component='input' className='form-control' name='first' placeholder='First Name' required />
                    </div>
                  </div>
                  <div className='col-md-6 pl-2'>
                    <div className='form-group'>
                      <label>Last name</label>
                      <div className='input-group'>
                        <span className='input-group-addon'>
                          <i className='now-ui-icons text_caps-small' />
                        </span>
                        <Field type='text' component='input' className='form-control' name='last' placeholder='Last Name' required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='form-group'>
                  <label>Email address</label>
                  <div className='input-group'>
                    <span className='input-group-addon'>
                      <i className='now-ui-icons ui-1_email-85' />
                    </span>
                    <Field type='email' component='input' className='form-control' name='email' placeholder='Email' required />
                  </div>
                </div>
                <div className='form-group'>
                  <label>Your message</label>
                  <Field component='textarea' className='form-control' name='message' rows='6' required />
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='checkbox'>
                      <input id='checkbox1' type='checkbox' />
                      <label for='checkbox1'> I'm not a robot</label>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <button type='submit' className='btn btn-primary btn-round pull-right'>Send Message</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
)

let InitContactForm = reduxForm({
  form: 'contact-form',
  enableReinitialize: true
})(Contact)

class ContactForm extends Component {
  submitForm (values) {
    this.props.mutate({
      variables: {
        emailInput: {
          email: values.email,
          first: values.first,
          last: values.last,
          message: values.message
        }
      }
    }).then(({ data }) => {
      window.swal('Success', `Your message was sent, we'll get back to you shortly`, 'success')
    }).catch((error) => {
      console.log(error)
      window.swal('Error', 'There was an error sending your message, please try again', 'error')
    })
  }

  render () {
    return (
      <InitContactForm onSubmit={this.submitForm.bind(this)} />
    )
  }
}
export default graphql(sendEmailMutation)(ContactForm)
