import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";



class IndexUsuarios extends Component {
  constructor(){
    super();
    this.state = {
      tb_users:[],
      membresia_tb:[],
      rol_tb:[],
      id:'',
      nombre:'',
      apellido:'',
      membresia:'',
      membresiaId:'',
      rol:'',
      rolId:'',
      bloqueado:'',
      cambiarModalUsers:false

    }
    this.handleChange = this.handleChange.bind(this);
  }
  fetchTable(){
    fetch('http://107.23.50.10/usuarios/mostrar',
      {
        mode:'cors',
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data.data){
          this.setState({
            tb_users: data
          },()=>{console.log(this.state.tb_users)})
        }
        else{
          console.log(data)
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });  }

  cambiarModalUsers(){
     console.log("ok");
      this.setState({
          estadoModalUsers: !this.state.estadoModalUsers
      })
  }
  editarUsers(id,nombres,apellidos,membresia,membresiaId,rol,rolId,bloqueado){
    this.setState({
      id: id,
      nombre: nombres,
      apellido: apellidos,
      membresia: membresia,
      membresiaId: membresiaId,
      membresiaIdMod: membresiaId,
      rolId: rolId,
      rolIdMod: rolId,
      rol: rol,
      bloqueado: bloqueado
    },()=>{
      this.fetchRol();
      this.fetchMembresia();
      this.cambiarModalUsers();
    })
  }
  fetchRol(){
    fetch('http://107.23.50.10/usuarios/mostrarRoles')
      .then(res =>res.json())
      .then(data => {
        if(data){
          this.setState({
            rol_tb: data
          },()=>{console.log(this.state.rol_tb)})
        }
        else{
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  fetchMembresia(){
    fetch('http://107.23.50.10/usuarios/mostrarMembresias')
      .then(res =>res.json())
      .then(data => {
        if(data){
          this.setState({
            membresia_tb: data
          },()=>{console.log(this.state.membresia_tb)})
        }
        else{
          console.log(data)
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  async sendUsuariosMod(){

     let a = await this.exe();
     console.log("ok creo")
  }
  async exe(){
     if(this.state.membresiaId != this.state.membresiaIdMod){
      let a = await this.sendMembresiaMod();
     }
     if(this.state.rolId != this.state.rolIdMod){
      let b = await this.sendRolMod();
     }
  }

  sendRolMod(){
    fetch('http://107.23.50.10/usuarios/editarRol',
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
             rol: this.state.rolIdMod,
         }),
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data){
          console.log("rol cambiado")
          console.log(data)
        }
        else{
          console.log(data)
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
 }

  sendMembresiaMod(){
    fetch('http://107.23.50.10/usuarios/editarMembresias',
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
             membresia: this.state.membresiaIdMod
         }),
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data){
          console.log(data)
          console.log("membresia cambiada")
        }
        else{
          console.log(data)
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  handleChange(e){
      const {name, value} = e.target;
      this.setState({
        [name]: value
      },()=>{
        console.log(this.state.rolIdMod)
        console.log(this.state.membresiaIdMod)
      })
    }


  componentDidMount(){
    this.fetchTable();
    console.log(localStorage.getItem('token'));
  }


    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Registro de usuarios' isOption>
                              <table id="tb_users" className="table table-striped" style={{width:'100%'}}>
                                  <thead>
                                      <tr>
                                          <th><h4 className="card-title">Buscar</h4></th>
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
                                          this.state.tb_users.data ?
                                          this.state.tb_users.data.map(task =>{
                                              return (
                                                  <tr key={task.id}>
                                                      <td>{task.nombres}</td>
                                                      <td>{task.apellidos}</td>
                                                      <td>{task.membresia}</td>
                                                      <td>{task.rol}</td>
                                                      <td>{task.bloqueado}</td>
                                                      <th>
                                                      <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.editarUsers(
                                                          task.id,
                                                          task.nombres,
                                                          task.apellidos,
                                                          task.membresia,
                                                          task.membresiaId,
                                                          task.rol,
                                                          task.rolId,
                                                          task.bloqueado,

                                                      )}><i className="feather icon-trending-up"/></button>
                                                      </th>
                                                  </tr>
                                              );
                                          } )   : null
                                      }
                                  </tbody>
                                </table>

                        </Card>
                    </Col>
                </Row>
                <Modal
                    size="lg"
                    show={this.state.estadoModalUsers}
                    onHide={() => this.cambiarModalUsers()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Detalles del usuario
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                                <div className="card card-default">
                                        <div className="modal-body">
                                            <div className="card-body" >
                                            <label>Nombres:</label>
                                              <span id="proveedorEntradaDetalle">&nbsp;&nbsp;{this.state.nombre}</span><br/>
                                            <label>Apellidos:</label>
                                              <span id="numeroEntradaDetalle">&nbsp;&nbsp;{this.state.apellido}</span><br/>
                                            <label>Membresia: </label>
                                              <div className="input-group">
                                                  <select className="form-control" name="membresiaIdMod" id="tipoProducto" style={{width: '50%'}} onChange={this.handleChange} value={this.state.membresiaIdMod}>
                                                      {
                                                          this.state.membresia_tb ?
                                                          this.state.membresia_tb.map(element=>{
                                                          return (
                                                          <option value={element.id}>{element.nombre}</option>
                                                          );
                                                      })
                                                       : null
                                                      }
                                                  </select>
                                              </div>
                                            <label>Rol:</label><br/>
                                              <div className="input-group">
                                                  <select className="form-control" name="rolIdMod" id="tipoProducto" style={{width: '50%'}} onChange={this.handleChange} value={this.state.rolIdMod}>
                                                      {
                                                          this.state.rol_tb ?
                                                          this.state.rol_tb.map(element=>{
                                                          return (
                                                          <option value={element.id}>{element.nombre}</option>
                                                          );
                                                      })
                                                       : null
                                                      }
                                                  </select>
                                              </div><br/>
                                              <div className="input-group">
                                                <button className="btn btn-sm btn-primary ver" onClick={()=>this.sendUsuariosMod()}> Editar</button>
                                              </div>
                                          </div>
                                        </div>
                                  </div>

                    </Modal.Body>
                  </Modal>
            </Aux>
        );
    }
}

export default IndexUsuarios;
