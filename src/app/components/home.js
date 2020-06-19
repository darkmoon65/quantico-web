import React,{Component} from 'react'
import {Link} from 'react-router-dom'

class Home extends Component {

  render(){
    return(
      <div>
        <nav className="navbar fixed-top navbar-dark bg-dark ">
          <div className="container">
            <Link to="/" className="navbar-brand" >Quantico </Link>
            <form class="form-inline">
              <Link to="/login" className="navbar-brand" >Login</Link>
            </form>
          </div>
        </nav>
      </div>
    )
  }
}
export default Home;
