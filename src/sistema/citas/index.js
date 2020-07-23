import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config";
import Files from "../../files"

class IndexCitas extends Component {
  constructor(){
    super();
    this.state = {
      tb_citas:[],
      estadoFechaEditar:'',
      linkEditar:'',
      //modales
      estadoModalEditarCitas:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_citas.datos.data,"citas");
  }

  cambiarModalEditarCitas(){
        this.setState({
          estadoModalEditarCitas: !this.state.estadoModalEditarCitas
        })
  }

  clean(){
    this.setState({
      estadoModalEditarCitas: false,
      id:'',
      estadoFechaEditar:''
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

  sendEditarCita(){

    if(this.state.estadoFecha && this.state.linkEditar==''){
      cogoToast.error("debe llenar el campo link");
    }
    else{
        fetch(`${Config.api}citas/editarEstado`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                  id: this.state.id,
                  usuario: this.state.usuarioId,
                  estadoFecha: this.state.estadoFechaEditar,
                  estadoCita: this.state.estadoCitaEditar,
                  link: this.state.linkEditar
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
              cogoToast.success("Cita editada");
              this.clean();
            }
            else{
              cogoToast.error("Error al editar")
              console.log("hubo un error con la peticion")
            }
        }).catch((error)=> {
          cogoToast.error("Hubo un error al editar")
          console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
    }

}

  editarCitas(id,estadoFecha,estadoCita,usuarioId){
    let fecha
    if (estadoFecha==3){
       fecha = true
    }else{
      fecha = false
    }

    this.setState({
        id: id,
        estadoFechaEditar: estadoFecha,
        estadoCitaEditar: estadoCita,
        opeEstadoEditarFecha: fecha,
        usuarioId: usuarioId
    },()=>this.cambiarModalEditarCitas())
  }
  fetchContactos(){
      fetch(`${Config.api}citas/mostrar`,
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
              tb_citas: data
            },()=>{console.log(this.state.tb_citas)})
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
                        <Card title='Citas' isOption>
                          <button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button>
                          <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_citas.datos ?
                                    this.state.tb_citas.datos.data.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.fecha}</td>
                                                <td>{task.estado}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.editarCitas(task.id,task.estadoFecha,task.estadoCita,task.usuario_id)}>
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
                    show={this.state.estadoModalEditarCitas}
                    onHide={() => this.cambiarModalEditarCitas()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Editar estado de citas
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Estado:</label><br/>
                                            {
                                            this.state.opeEstadoEditarFecha?

                                                <select className="form-control" name="estadoFechaEditar" style={{width: '50%'}} onChange={this.handleChange} defaultValue={this.state.estadoFechaEditar}>
                                                      <option key={1} value={1}>Aceptar</option>
                                                      <option key={2} value={2}>Rechazar</option>
                                                </select>
                                            :
                                                <select className="form-control" name="estadoCitaEditar" style={{width: '50%'}} onChange={this.handleChange} defaultValue={this.state.estadoCitaEditar}>
                                                      <option key={1} value={1}>Aceptar</option>
                                                      <option key={2} value={2}>Rechazar</option>
                                                </select>

                                          }

                                          </div>
                                          <div>
                                            <label>Link zoom:</label><br/>
                                            <input type="text" className="form-control" name="linkEditar" onChange={this.handleChange}  />
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.sendEditarCita()} >Guardar</button>
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

export default IndexCitas;
