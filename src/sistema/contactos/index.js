import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexContactos extends Component {
  constructor(){
    super();
    this.state = {
      tb_contactos:[],
      //modales
      estadoModalCrearContactos:false,
      estadoModalEditarContactos:false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_contactos.datos,"contactos");
  }
  cambiarModalCrearContactos(){
        this.setState({
          estadoModalCrearContactos: !this.state.estadoModalCrearContactos
        })
  }
  cambiarModalEditarContactos(){
        this.setState({
          estadoModalEditarContactos: !this.state.estadoModalEditarContactos
        })
  }
  editarContacto(id,nombre,numero,cargo){
    this.setState({
      id: id,
      nombreEditar:nombre,
      numeroEditar:numero,
      cargoEditar:cargo
    },()=>this.cambiarModalEditarContactos())
  }



  clean(){
    this.setState({
      estadoModalCrearContactos: false,
      estadoModalEditarContactos: false,
      nombreCrear:'',
      numeroCrear:'',
      cargoCrear:''
    },()=>this.fetchContactos())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }
  crearContacto(){
    fetch(`${Config.api}contactos/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              nombre: this.state.nombreCrear,
              numero: this.state.numeroCrear,
              cargo: this.state.cargoCrear
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
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el contacto")
  });
}
  sendEditarContacto(){
    fetch(`${Config.api}contactos/editar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
              nombre: this.state.nombreEditar,
              numero: this.state.numeroEditar,
              cargo: this.state.cargoEditar
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
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al editar el contacto")
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
          cogoToast.error("Error al eliminar el contacto")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al eliminar el contacto")
  });
}
  fetchContactos(){
      fetch(`${Config.api}contactos/mostrar`,
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
              tb_contactos: data['datos']
            })
          }
      }).catch((error)=> {

    });
  }
  componentDidMount(){
      this.fetchContactos();
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Contactos' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><h4 className="card-title">Buscar </h4></th>
                                    <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearContactos()}>Crear contactos</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Numero</th>
                                    <th>Cargo</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_contactos.data ?
                                    this.state.tb_contactos.data.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>{task.numero}</td>
                                                <td>{task.cargo}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.editarContacto(task.id,task.nombre,task.numero,task.cargo)}>
                                                    <i className="fa fa-pencil" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarContacto(task.id)}>
                                                    <i className="fa fa-trash" ></i>
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
                    show={this.state.estadoModalCrearContactos}
                    onHide={() => this.cambiarModalCrearContactos()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Contactos
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Nombre:</label><br/>
                                            <input type="text" name="nombreCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Numero:</label><br/>
                                            <input type="number" name="numeroCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Cargo:</label><br/>
                                            <input type="text" name="cargoCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearContacto()} >Crear contacto</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarContactos}
                      onHide={() => this.cambiarModalEditarContactos()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Crear Contactos
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Nombre:</label><br/>
                                              <input type="text" name="nombreEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.nombreEditar}/>
                                            </div>
                                            <div>
                                              <label>Numero:</label><br/>
                                              <input type="number" name="numeroEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.numeroEditar}/>
                                            </div>
                                            <div>
                                              <label>Cargo:</label><br/>
                                              <input type="text" name="cargoEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.cargoEditar}/>
                                            </div>
                                            <div className="p-2">
                                              <button type="button" className="btn btn-primary" onClick={()=>this.sendEditarContacto()} >Guardar cambios</button>
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

export default IndexContactos;
