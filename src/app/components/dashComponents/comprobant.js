import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import Sidebar from '../sidebar/sidebar'

class Comprobantes extends Component {

  constructor(){
    super();
    this.state = {
      entrada_tb: [],
      estadoBoton: []
    }
  }

  goHome(){
    console.log("ok")
  }

  render(){
    return(
      <div>
          <nav className="navbar navbar-dark bg-dark">
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
                    Hola dashboard
                  </div>
              </div>
          </div>
      </div>

    )

  }
}
export default Comprobantes
