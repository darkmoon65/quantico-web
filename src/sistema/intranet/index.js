import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexIntranet extends Component {
  constructor(){
    super();
    this.state = {
      tb_intranet:[],
      //modales
      estadoModalCrearIntranet:false,
      estadoModalEditarIntranet:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_intranet.datos,"contactos");
  }
  cambiarModalCrearIntranet(){
        this.setState({
          estadoModalCrearIntranet: !this.state.estadoModalCrearIntranet
        })
  }
  cambiarModalEditarIntranet(){
        this.setState({
          estadoModalEditarIntranet: !this.state.estadoModalEditarIntranet
        })
  }
  crearIntranet(id){
    this.setState({
       id: id
    },()=>this.cambiarModalCrearIntranet())
  }
  editarIntranet(id){
    this.setState({
       id: id
    },()=>this.cambiarModalEditarIntranet())
  }
  clean(){
    this.setState({
      estadoModalCrearIntranet: false,
      nombreCrear:'',
      numeroCrear:'',
      cargoCrear:''
    },()=>this.fetchIntranet())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }

  crearCuenta(){
    fetch(`${Config.api}inversiones/crearCuenta`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
              correo: this.state.correoCrear,
              usuario: this.state.usuarioCrear
          }
        ),
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
          cogoToast.success("Contacto creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el contacto")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el contacto")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  editarCuenta(){
    fetch(`${Config.api}inversiones/crearCuenta`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
              correo: this.state.correoEditar,
              usuario: this.state.usuarioEditar
          }
        ),
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
          cogoToast.success("Contacto editado");
          this.clean();
        }
        else{
          cogoToast.error("Error al editar el contacto")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al editar el contacto")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  eliminarContacto(id){
    fetch(`${Config.api}contactos/eliminar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id:id
          }
        ),
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
          cogoToast.success("Contacto eliminado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el contacto")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el contacto")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  fetchIntranet(){
      fetch(`${Config.api}inversiones/mostrarCuentas`,
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
            this.setState({
              tb_intranet: data
            },()=>{console.log(this.state.tb_intranet)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchIntranet();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Intranet' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><h4 className="card-title">Buscar </h4></th>
                                    <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Correos</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_intranet.datos ?
                                    this.state.tb_intranet.datos.data.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.correo}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary"  type="button" onClick={()=>this.editarIntranet(task.id)}>
                                                    <i className="fa fa-pencil"/>
                                                  </button>
                                                  <button className="btn btn-sm btn-success"  type="button" onClick={()=>this.crearIntranet(task.id)}>
                                                    Crear cuenta
                                                  </button>
                                                </td>
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
                    show={this.state.estadoModalCrearIntranet}
                    onHide={() => this.cambiarModalCrearIntranet()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Cuenta
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Correo:</label><br/>
                                            <input type="text" name="correoCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Usuario:</label><br/>
                                            <input type="text" name="usuarioCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>

                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearCuenta()} >Crear cuenta</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarIntranet}
                      onHide={() => this.cambiarModalEditarIntranet()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Editar Cuenta
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Correo:</label><br/>
                                              <input type="text" name="correoEditar" className="form-control" onChange={this.handleChange}/>
                                            </div>
                                            <div>
                                              <label>Usuario:</label><br/>
                                              <input type="text" name="usuarioEditar" className="form-control" onChange={this.handleChange}/>
                                            </div>

                                            <div className="p-2">
                                              <button type="button" className="btn btn-primary" onClick={()=>this.editarCuenta()} >Editar cuenta</button>
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

export default IndexIntranet;
