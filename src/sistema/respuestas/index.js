import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexRespuestas extends Component {
  constructor(){
    super();
    this.state = {
      tb_respuestas:[],
      //modales
      estadoModalCrearRespuestas:false,
      estadoModalEditarRespuestas:false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_respuestas.data,"Respuestas");
  }
  cambiarModalCrearRespuestas(){
        this.setState({
          estadoModalCrearRespuestas: !this.state.estadoModalCrearRespuestas
        })
  }
  cambiarModalEditarRespuestas(){
        this.setState({
          estadoModalEditarRespuestas: !this.state.estadoModalEditarRespuestas
        })
  }
  editarRespuesta(id,respuesta){
    this.setState({
      id: id,
      respuestaEditar:respuesta
    },()=>this.cambiarModalEditarRespuestas())
  }



  clean(){
    this.setState({
      estadoModalCrearRespuestas: false,
      estadoModalEditarRespuestas: false,
      respuestaCrear:'',

    },()=>this.fetchRespuestas())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }
  crearRespuesta(){
    fetch(`${Config.api}comentarios/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              comentario: this.state.respuestaCrear,
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
          cogoToast.success("Respuesta creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear respuesta")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear respuesta")
  });
}
  sendEditarRespuesta(){
    fetch(`${Config.api}comentarios/editar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
              comentario: this.state.respuestaEditar,
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
          cogoToast.success("Respuesta editada");
          this.clean();
        }
        else{
          cogoToast.error("Error al editar ")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al editar")
    });
}
  eliminarRespuesta(id){
    fetch(`${Config.api}comentarios/eliminar`,
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
          cogoToast.success("Respuesta eliminada");
          this.clean();
        }
        else{
          cogoToast.error("Error al eliminar")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al eliminar")
  });
}
  fetchRespuestas(){
      fetch(`${Config.api}comentarios/tabla`,
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
              tb_respuestas: data['datos']
            })
          }
      }).catch((error)=> {

    });
  }
  componentDidMount(){
      this.fetchRespuestas();
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Respuestas' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearRespuestas()}>Crear Respuesta</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_respuestas.data ?
                                    this.state.tb_respuestas.data.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.comentario}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.editarRespuesta(task.id,task.comentario)}>
                                                    <i className="fa fa-pencil" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarRespuesta(task.id)}>
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
                    show={this.state.estadoModalCrearRespuestas}
                    onHide={() => this.cambiarModalCrearRespuestas()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Respuestas
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Comentario:</label><br/>
                                            <input type="text" name="respuestaCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearRespuesta()} >Crear respuesta</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarRespuestas}
                      onHide={() => this.cambiarModalEditarRespuestas()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Crear Respuestas
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">
                                          <div>
                                            <label>Comentario:</label><br/>
                                            <input type="text" name="respuestaEditar" className="form-control" defaultValue={this.state.respuestaEditar} onChange={this.handleChange}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.sendEditarRespuesta()} >Guardar respuesta</button>
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

export default IndexRespuestas;
