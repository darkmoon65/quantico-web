import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import Paginar from "../../paginate"

class IndexUsuarios extends Component {
  constructor(){
    super();
    this.state = {
      //fetch arrays
      tb_users:[],
      membresia_tb:[],
      rol_tb:[],
      var_texto_numeroPagina:1,
      valor:'',
      buscarT:'apellidos',

      id:'',
      nombre:'',
      apellido:'',
      membresia:'',
      membresiaId:'',
      membresiaIdMod:'',
      rol:'',
      rolId:'',
      rolIdMod:'',
      blackList:'',
      blackListId:'',
      blackListIdMod:'',
      estadoModalUsers:false,
      // operaciones post comprobantes
      opeRol:'',
      opeMembre:'',
      opeBlackList:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_users.data,"usuarios");
  }
  handleChangeBuscador(e){
    const value = e.target.value;
    this.setState({
      valor: value
    },()=>{
      this.fetchTable();
    })
  }
  fetchTable(bolean,numero){
    fetch(`${Config.api}usuarios/mostrar?page=${numero}&columna=${this.state.buscarT}&buscar=${this.state.valor}`,
      {
        mode:'cors',
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json',
            'api_token': localStorage.getItem('token')
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data.respuesta==true){
           console.log(data)
            this.setState({
              tb_users: data['datos'],
              var_texto_numeroPagina: numero
            })
        }
    }).catch((error)=> {

    });
}

  cambiarModalUsers(){
      this.setState({
          estadoModalUsers: !this.state.estadoModalUsers
      })
  }
  editarUsers(id,nombres,apellidos,membresia,membresiaId,rol,rolId,bloqueado,bloqueadoId){

    if (bloqueado){
      bloqueado = "si";
      bloqueadoId = 1;
    }
    else {
      bloqueado = "no";
      bloqueadoId = 2;
    }
    if(membresiaId !=2 && membresiaId != 6 && membresiaId != 7){
      membresiaId = 0;
    }

    this.setState({
      id: id,
      nombre: nombres,
      apellido: apellidos,
      membresia: membresia,
      membresiaId: membresiaId,
      membresiaIdMod: membresiaId,
      rol: rol,
      rolId: rolId,
      rolIdMod: rolId,
      blackList: bloqueado,
      blackListId: bloqueadoId,
      blackListIdMod: bloqueadoId,
    },()=>{
      this.fetchRol();
      this.fetchMembresia();
      this.cambiarModalUsers();
    })
  }
  fetchRol(){
    fetch(`${Config.api}usuarios/mostrarRoles`,
      {
        mode:'cors',
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json',
            'api_token': localStorage.getItem('token')
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data){
          this.setState({
            rol_tb: data
          })
        }
    }).catch((error)=> {

  });
}

  fetchMembresia(){
    fetch(`${Config.api}usuarios/mostrarMembresias`,
      {
        mode:'cors',
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json',
            'api_token': localStorage.getItem('token')
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data){
          this.setState({
            membresia_tb: data
          })
        }
    }).catch((error)=> {

  });
}

  clean(){
    this.setState({
      estadoModalUsers: false,
    },()=>this.fetchTable())
  }
  async sendUsuariosMod(){

     let a = await this.exe();
     let count = 0;
     await a.map((op)=>{
       if (op == "a"){
         if(this.state.opeMembre){
           cogoToast.success("Membresia cambiada");
         }
         else{
           cogoToast.error("Error no se cambio la membresia")
           count++
         }
       }
       if(op == "b"){
         if(this.state.opeRol){
           cogoToast.success("Rol cambiado")
         }
         else{
           cogoToast.error("Error no se cambio el rol")
           count++
         }
       }
       if(op == "c"){
         if(this.state.opeBlackList){
           cogoToast.success("BlackList modificada")
         }
         else{
           cogoToast.error("Error en la blacklist")
           count++
         }
       }
       return count;
     })
      if(count <= 3){
        this.clean();
      }
  }

  async exe(){
    let op = [];
    let a
    let b

     if(this.state.membresiaId != this.state.membresiaIdMod){
       a = await this.sendMembresiaMod();
       op.push("a");
     }
     if(this.state.rolId != this.state.rolIdMod){
       b = await this.sendRolMod();
       op.push("b");
     }
     if(this.state.blackListId != this.state.blackListIdMod){
       if(this.state.blackListIdMod == 1){
         await this.sendBlackListBan();
       }else{
         await this.sendBlackListUnBan();
       }
       op.push("c")
     }
     return op;
  }

  async sendBlackListBan(){
    await fetch(`${Config.api}usuarios/bloquear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
         }),
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json',
            'api_token': localStorage.getItem('token')
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data){
          this.setState({opeBlackList:true});
        }
        else{
          this.setState({opeBlackList:false});
        }
    }).catch((error)=> {
      this.setState({opeBlackList:false})
  });
  return true;
 }

  async sendBlackListUnBan(){
   await fetch(`${Config.api}usuarios/desbloquear`,
     {
       mode:'cors',
       method: 'POST',
       body: JSON.stringify({
             id: this.state.id,
        }),
       headers: {
           'Accept' : 'application/json',
           'Content-type' : 'application/json',
           'api_token': localStorage.getItem('token')
       }
     }
   )
     .then(res =>res.json())
     .then(data => {
       if(data.respuesta==true){
         this.setState({opeBlackList:true})
       }
       else{
         this.setState({opeBlackList:false})
       }
   }).catch((error)=> {
     this.setState({opeBlackList:false})
 });
 return true;
}

  async sendRolMod(){
    await fetch(`${Config.api}usuarios/editarRol`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
             rol: this.state.rolIdMod,
         }),
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json',
            'api_token': localStorage.getItem('token')
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data.respuesta==true){
          this.setState({opeRol: true})
        }
        else{
          this.setState({opeRol: false})
        }
    }).catch((error)=> {
      this.setState({opeRol: false})
  });
  return true;
 }

  async sendMembresiaMod(){
     await fetch(`${Config.api}usuarios/editarMembresia`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
             id: this.state.id,
             membresia: this.state.membresiaIdMod
         }),
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json',
            'api_token': localStorage.getItem('token')
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data.respuesta==true){
          this.setState({opeMembre: true})
        }
        else{
          this.setState({opeMembre: false})
        }
    }).catch((error)=> {
      this.setState({opeMembre: false})
  });
   return true;
}

  handleChange(e){
      const {name, value} = e.target;
      this.setState({
        [name]: value
      })
    }


  componentDidMount(){
    this.fetchTable(true,1);
  }


    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Registro de usuarios' isOption>
                            <h4 className="card-title">Buscar</h4>
                            <input type="text" onChange={this.handleChangeBuscador} />
                            <span className="p-5">

                                <select  name="buscarT" id="tipoProducto" style={{width: '15%'}} onChange={this.handleChange} value={this.state.buscarT}>
                                    <option key={1} value={"nombres"}>Nombres</option>
                                    <option key={2} value={"apellidos"}>Apellidos</option>
                                    <option key={3} value={"membresia"}>Membresia</option>
                                    <option key={4} value={"rol"}>Rol</option>
                                    <option key={5} value={"correo"}>Correo</option>
                                    <option key={6} value={"nroTarjeta"}>Tarjeta</option>
                                </select>
                            </span>
                            <span className="p-5"><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></span>
                              <table id="tb_users" className="table table-striped table-responsive" >
                                  <thead>
                                      <tr>
                                          <th>Nombres</th>
                                          <th>Apellidos</th>
                                          <th>Membresia</th>
                                          <th>Rol</th>
                                          <th>Correo</th>
                                          <th>Tarjeta</th>
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
                                                      <td>{task.correo}</td>
                                                      <td>{task.nroTarjeta}</td>
                                                      {task.bloqueado ?
                                                         <td>si</td>
                                                       : <td>No</td>}

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
                                                      )}><i className="fa fa-pencil"/></button>
                                                      </th>
                                                  </tr>
                                              );
                                          } )   : null
                                      }
                                  </tbody>
                                </table>
                                <div className="float-right">
                                <Pagination  >
                                  <Pagination.Prev
                                      onClick={() => {
                                        this.fetchTable(
                                          true,
                                          this.state.var_texto_numeroPagina-1,
                                      )
                                    }}
                                  />
                                      {
                                            <Paginar data={this.state.tb_users} fetch={(bolean,numero)=>this.fetchTable(bolean,numero)} ></Paginar>
                                      }
                                  <Pagination.Next
                                      onClick={() => {
                                        this.fetchTable(
                                          true,
                                          this.state.var_texto_numeroPagina+1,

                                        )
                                      }}
                                  />
                              </Pagination>
                              </div>
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
                                                      <option key={0} value={0}> Escoge una opcion</option>
                                                      {
                                                          this.state.membresia_tb ?
                                                          this.state.membresia_tb.map(element=>{
                                                          return (
                                                          <option key={element.id} value={element.id}>{element.nombre}</option>
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
                                                          <option key={element.id} value={element.id}>{element.nombre}</option>
                                                          );
                                                      })
                                                       : null
                                                      }
                                                  </select>
                                              </div><br/>
                                              <label>Blacklist:</label><br/>
                                                <div className="input-group">
                                                    <select className="form-control" name="blackListIdMod" id="tipoProducto" style={{width: '50%'}} onChange={this.handleChange} value={this.state.blackListIdMod}>
                                                          <option key={1} value="1">Si</option>
                                                          <option key={2} value="2">No</option>
                                                    </select>
                                                </div><br/>
                                              <div className="input-group">
                                                <button className="btn btn-sm btn-primary ver" onClick={()=>this.sendUsuariosMod()}> Guardar</button>
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
