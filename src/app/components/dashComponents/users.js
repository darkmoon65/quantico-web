import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import Sidebar from '../sidebar/sidebar'

class Users extends Component {

  constructor(){
    super();
    this.state = {
      entrada_tb: [],
      estadoBoton: []
    }
  }

  fetchGetUsers(){
    fetch('http://107.23.50.10/usuarios',{
            method: 'GET',
            body: JSON.stringify({
                '_token': csrf_token,
                id: id
            }),
            headers: {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            }
          }).then(res =>res.json())
          .then(data => {
            if(data.response==true){
              //this.fetchTasks();
            }
            else{
            }
        }).catch((error)=> {
          console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
  }

  componentDidMount(){
     //this.fetchGetUsers();
     //localStorage.setItem('token',"abcdni123456789")
     let hola = localStorage.getItem('token')
     console.log(hola);
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
                  <div className="col-lg-12 grid-margin stretch-card">
                      <div className="card">
                          <div className="card-body">

                              <table id="tb_entradas" className="table table-striped" style={{width:'100%'}}>
                                  <thead>
                                      <tr>
                                          <th><h4 className="card-title">Registro de usuarios</h4></th>
                                          <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                      </tr>
                                      <tr>
                                          <th>Nombres</th>
                                          <th>Apellidos</th>
                                          <th>Membresia</th>
                                          <th>Rol</th>
                                          <th>Bloqueado</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                         {
                                          this.state.entrada_tb.data ?
                                          this.state.entrada_tb.data.map(dat =>{
                                              return (
                                                  <tr key={dat.id}>
                                                      <td>{dat.nombres}</td>
                                                      <td>{dat.apellidos}</td>
                                                      <td>{dat.membresia}</td>
                                                      <td>{dat.rol}</td>
                                                      <td>{dat.bloqueado}</td>
                                                      <th>
                                                      <button className="btn btn-sm btn-primary ver" type="button"><i className="mdi mdi-delete"></i></button>
                                                      </th>
                                                  </tr>
                                              );
                                          } )   : null
                                        }
                                   </tbody>
                                  </table>
                                  <div className="container">
                                      <div className="row justify-content-end">
                                        <div className="col-4">

                                          {
                                            this.state.estadoBoton?
                                            this.state.estadoBoton.map(num =>{
                                                return (
                                                    <button key={num}
                                                        className="btn btn-sm btn-secondary editar" type="button" onClick={()=>this.cambiarPaginate(num)}>{num}</button>
                                                );
                                             } )   : null
                                           }
                                       </div>
                                     </div>
                                   </div>


                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>



        )
  }
}
export default Users
