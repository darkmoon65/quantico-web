import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexCompletos extends Component {
  constructor(){
    super();
    this.state = {
      tb_completos:[],
      //modales
      estadoModalVerVerCompletos:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_completos,"completos");
  }

  cambiarModalVerCompletos(){
        this.setState({
          estadoModalVerVerCompletos: !this.state.estadoModalVerVerCompletos
        })
  }

  verResultado(id){
    this.fetchCompletosDetalle(id);
  }
  verDetalle(){

  }


  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }

  fetchCompletosDetalle(id){
      fetch(`${Config.api}verificaciones/detalles`,
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
              'estado': '3',
              'id': id,
              'api_token': localStorage.getItem('token')
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data){
            this.setState({
              tb_detalles: data
            },()=>{console.log(this.state.tb_detalles)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }

  fetchCompletos(){
      fetch(`${Config.api}verificaciones/mostrar`,
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
              'estado': '3',
              'api_token': localStorage.getItem('token')
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data){
            this.setState({
              tb_completos: data
            },()=>{console.log(this.state.tb_completos)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchCompletos();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Completos' isOption>
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
                                    <th>Total</th>
                                    <th>Concepto</th>
                                    <th>Descripcion</th>
                                    <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_completos.datos ?
                                    this.state.tb_completos.datos.data.map((task,index) =>{
                                        return (
                                            <tr key={index}>
                                                <td>{task.usuario.nombres}</td>
                                                <td>{task.usuario.apellidos}</td>
                                                <td>{task.total}</td>
                                                <td>{task.concepto}</td>
                                                <td>{task.descripcion}</td>
                                                <td>Completo</td>
                                                <td>
                                                  <button className="btn btn-sm btn-info"  type="button" onClick={()=>this.verResultado(task.id)}>
                                                    <i className="fa fa-eye" ></i>
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
                    show={this.state.estadoModalVerVerCompletos}
                    onHide={() => this.cambiarModalVerCompletos()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Ver registros completos
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body text-center">
                                          <div>
                                            <label>Nombre:</label><br/>
                                            <label>Apellidos:</label><br/>
                                            <label>Total:</label><br/>
                                            <label>Concepto:</label><br/>
                                            <label>Descripcion:</label><br/>
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

export default IndexCompletos;
