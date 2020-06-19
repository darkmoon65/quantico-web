import React,{Component} from 'react'
import {Link} from 'react-router-dom'

class Sidebar extends Component {

  render(){
    return(
          <aside className="aside">
              <div className="sidebar left ">
                <div className="user-panel">
                  <div className="pull-left image">
                    <img src="" className="rounded-circle" alt="User Image"/>
                  </div>
                  <div className="pull-left info">
                    <Link to="/dashboard/perfil" ><i className="fa fa-circle text-success"></i>Administrador</Link>
                  </div>
                </div>
                <ul className="list-sidebar bg-defoult">
                  <li> <Link data-toggle="collapse" data-target="#dashboard" className="collapsed active" > <i className="fa fa-th-large"></i> <span className="nav-label">Usuarios</span> <span className="fa fa-chevron-left pull-right"></span> </Link>
                  <ul className="sub-menu collapse" id="dashboard">
                    <li className="active"><Link to="/dashboard/users">Usuarios-editar</Link></li>
                    <li><Link to="/dashboard">General</Link></li>
                  </ul>
                </li>
                <li> <Link data-toggle="collapse" data-target="#products" className="collapsed active" > <i className="fa fa-bar-chart-o"></i><span className="nav-label">Otros</span><span className="fa fa-chevron-left pull-right"></span> </Link>
                <ul className="sub-menu collapse" id="products">
                  <li className="active"><Link to="/dashboard">Submenu1</Link></li>
                  <li><Link to="/dashboard">Submenu2</Link></li>
                </ul>
              </li>
          <li> <Link to="/dashboard/comprobantes"><i className="fa fa-pie-chart"></i> <span className="nav-label">Comprobantes</span> </Link></li>
          <li> <Link to="/dashboard/configuracion"><i className="fa fa-files-o"></i> <span className="nav-label">Configuracion</span></Link> </li>
        </ul>
        </div>
        </aside>


    )

  }
}
export default Sidebar
