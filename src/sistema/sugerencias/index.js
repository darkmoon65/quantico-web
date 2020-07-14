import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"

class IndexSugerencias extends Component {
  constructor(){
    super();
    this.state = {
      tb_sugerencias:[],
      //modales
      estadoModalVerSugerencias:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalVerSugerencias(){
        this.setState({
          estadoModalVerSugerencias: !this.state.estadoModalVerSugerencias
        })
  }

  clean(){
    this.setState({
      estadoModalVerSugerencias: false,
      nombreCrear:'',
      numeroCrear:'',
      cargoCrear:''
    },()=>this.fetchContactos())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
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
            'Content-type' : 'application/json'
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
  eliminarSugerencia(id){

  }
  verSugerencia(id,nombre,apellido,correo,celular,sugerencia,fecha){
    this.setState({
      idVer: id,
      nombreVer:nombre,
      apellidoVer: apellido,
      correoVer: correo,
      celularVer: celular,
      sugerenciaVer: sugerencia,
      fechaVer: fecha
    },()=>this.cambiarModalVerSugerencias())
  }
  fetchContactos(){
      fetch(`${Config.api}sugerencias/mostrar`,
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data.respuesta==true){
            this.setState({
              tb_sugerencias: data
            },()=>{console.log(this.state.tb_sugerencias)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }

  componentDidMount(){
      this.fetchContactos();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Sugerencias' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Celular</th>
                                    <th>Fecha</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_sugerencias.datos ?
                                    this.state.tb_sugerencias.datos.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.celular}</td>
                                                <td>{task.fecha}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.verSugerencia(
                                                    task.id,
                                                    task.nombres,
                                                    task.apellidos,
                                                    task.correo,
                                                    task.celular,
                                                    task.sugerencia,
                                                    task.fecha
                                                  )}>
                                                    <i className="fa fa-eye" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarSugerencia(task.id)}>
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
                    show={this.state.estadoModalVerSugerencias}
                    onHide={() => this.cambiarModalVerSugerencias()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Ver sugerencia
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div className="p-2">
                                            <label>Nombres:</label>
                                            <span>&nbsp;&nbsp;{this.state.nombreVer}</span><br/>
                                          </div>
                                          <div className="p-2">
                                            <label>Apellidos:</label>
                                            <span>&nbsp;&nbsp;{this.state.apellidoVer}</span><br/>
                                          </div>
                                          <div className="p-2">
                                            <label>Correo:</label>
                                            <span>&nbsp;&nbsp;{this.state.correoVer}</span><br/>
                                          </div>
                                          <div className="p-2">
                                            <label>Celular:</label>
                                            <span>&nbsp;&nbsp;{this.state.celularVer}</span><br/>
                                          </div>
                                          <div className="p-2">
                                            <label>Fecha:</label>
                                            <span>&nbsp;&nbsp;{this.state.fechaVer}</span><br/>
                                          </div>
                                          <div className="p-2">
                                            <label>Sugerencia:</label><br/>
                                            <span>{this.state.sugerenciaVer}</span><br/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalVerSugerencias()}>Aceptar</button>
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

export default IndexSugerencias;
