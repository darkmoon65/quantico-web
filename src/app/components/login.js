import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import { NavLink, Redirect} from 'react-router-dom'

class Login extends Component {

  constructor(){
    super();
    this.state = {
      redirect: false,
      correo: '',
      contraseña: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.ingresar = this.ingresar.bind(this);
  }
  handleChange(e){
      const {name, value} = e.target;

      this.setState({
        [name]: value
      },()=>{
        console.log(this.state.correo)
        console.log(this.state.contraseña)
      })

      //this.fetchQuery(value,name);
      //console.log(name);
      }

  ingresar(){
    fetch(`http://107.23.50.10/loginAdmin`,
          {
            mode:'cors',
            method: 'POST',
           body: JSON.stringify({
                correo: this.state.correo,
                contrasena: this.state.contraseña,
            }),
            headers: {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            }
          }
        )
          .then(res =>res.json())
          .then(data => {
            if(data.respuesta==true){
              console.log(data)
              this.setState({redirect:true })
            }
            else{
              console.log(data)
              console.log("pepe es huevonaso")
            }
        }).catch((error)=> {
          console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
  }

  render(){

    const { redirect } = this.state;

     if (redirect) {
       return <Redirect to='/dashboard'/>;
     }
    return(
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container">
            <Link to="/" className="navbar-brand" >Quantico </Link>
          </div>
        </nav>


        <div className="container p-5 ">
            <div className="row justify-content-md-center">
                <div className="col-md-4" >
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group">
                        <input type="text" className="form-control" name="correo" placeholder="Usuario" onChange={this.handleChange}/>
                      </div>
                      <div className="form-group">
                        <input type="password" className="form-control" name="contraseña" placeholder="Contraseña" onChange={this.handleChange} />
                      </div>
                      <input type="button" className="btn btn-success btn-block" onClick={()=>this.ingresar()} value="Ingresar" />
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
    )
  }
}
export default Login;
