import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexIntereses extends Component {
  constructor(){
    super();
    this.state = {
      tb_intereses:[],
      //modales
      estadoModalCrearIntereses:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_intereses.datos,"intereses");
  }
  cambiarModalCrearIntereses(){
        this.setState({
          estadoModalCrearIntereses: !this.state.estadoModalCrearIntereses
        })
  }
  cambiarModalEditarIntereses(){
        this.setState({
          estadoModalEditarIntereses: !this.state.estadoModalEditarIntereses
        })
  }

  clean(){
    this.setState({
      estadoModalCrearIntereses: false,
      estadoModalEditarIntereses:false,
      nombreCrear:'',
      numeroCrear:'',
      cargoCrear:''
    },()=>this.fetchIntereses())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }

  crearIntereses(){
    fetch(`${Config.api}intereses/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              nombre: this.state.nombreCrear,
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
          cogoToast.success("interes creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el interes")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el interes")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}


  edit(id){
      this.setState({
         idEditar: id
      },()=>this.cambiarModalEditarIntereses())
  }

  editarIntereses(){
    fetch(`${Config.api}intereses/editar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id:this.state.idEditar,
              nombre: this.state.nombreEditar
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
          cogoToast.success("interes editado");
          this.clean();
        }
        else{
          cogoToast.error("Error al editar el interes")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al editar el interes")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  fetchIntereses(){
      fetch(`${Config.api}intereses/mostrar`,
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
              tb_intereses: data
            },()=>{console.log(this.state.tb_intereses)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchIntereses();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Intereses' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearIntereses()}>Crear intereses</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_intereses.datos ?
                                    this.state.tb_intereses.datos.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.edit(task.id)}>
                                                    <i className="fa fa-pencil" ></i>
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
                    show={this.state.estadoModalCrearIntereses}
                    onHide={() => this.cambiarModalCrearIntereses()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Intereses
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
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearIntereses()} >Crear Intereses</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarIntereses}
                      onHide={() => this.cambiarModalEditarIntereses()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Editar Intereses
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Nombre:</label><br/>
                                              <input type="text" name="nombreEditar" className="form-control" onChange={this.handleChange}/>
                                            </div>
                                            <div className="p-2">
                                              <button type="button" className="btn btn-primary" onClick={()=>this.editarIntereses()} >Crear Intereses</button>
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

export default IndexIntereses;
