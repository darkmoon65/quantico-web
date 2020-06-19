import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import Sidebar from './sidebar/sidebar'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      entrada_tb: [],
      estadoBoton: []
    }
  }

  goHome(){
    consol
  }

  render(){
    return(
      <div>
            <nav className="navbar fixed-top navbar-dark bg-dark ">
              <div className="container">
                <Link to="/" className="navbar-brand" >Quantico </Link>
              </div>
            </nav>
          <div className="container-fluid p-0">
              <div className="row no-gutters">
                  <div className="col-lg-2 ">
                      <Sidebar/>
                  </div>
                  <div className="col-lg-10 p-2">
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                    <h1>Hola Esta sera la pagina principal</h1>
                  </div>
              </div>
          </div>
      </div>
    )

  }
}
export default Dashboard;
