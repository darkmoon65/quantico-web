import React from 'react';
import {NavLink, Redirect} from 'react-router-dom';

import './../../assets/scss/style.scss';
import Aux from "../../hoc/_Aux";
import Breadcrumb from "../../App/layout/AdminLayout/Breadcrumb";
import DEMO from "../../store/constant";
import Config from "../../config"

class IndexLogin extends React.Component {

  constructor(){
    super();
    this.state = {
      redirect: false,
      email: '',
      password: '',
      logged:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.LoginSend = this.LoginSend.bind(this);
  }
  handleChange(e){
      const {name, value} = e.target;

      this.setState({
        [name]: value
      })
    }

  LoginSend(){
      fetch(`${Config.api}loginAdmin`,
            {

             method: 'POST',
             body: JSON.stringify({
                  correo: this.state.email,
                  contrasena: this.state.password,
              }),
              headers: {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
              }
            }
          )
            .then(res =>res.json())
            .then(data => {
              if(data.respuesta == true){
                let g = data.api_token
                localStorage.setItem('token',data.api_token);
                window.location.href="/"
              }
          }).catch((error)=> {
  
        });
    }

    render () {
        return(
            <Aux>
                <Breadcrumb/>
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r"/>
                            <span className="r s"/>
                            <span className="r s"/>
                            <span className="r"/>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-unlock auth-icon"/>
                                </div>
                                <h3 className="mb-4">Login</h3>
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" placeholder="Email" onChange={this.handleChange} name="email"/>
                                </div>
                                <div className="input-group mb-4">
                                    <input type="password" className="form-control" placeholder="password" onChange={this.handleChange} name="password"/>
                                </div>
                                {/* <div className="form-group text-left">
                                    <div className="checkbox checkbox-fill d-inline">
                                        <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
                                            <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                                    </div>
                                </div> */}
                                <input type="button" style={{"color": 'white'}}  onClick={()=>this.LoginSend()} className="btn btn-primary shadow-2 mb-4" value="Login"/>                                {/* <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p>
                                <p className="mb-0 text-muted">Don’t have an account? <NavLink to="/auth/signup-1">Signup</NavLink></p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default IndexLogin;
