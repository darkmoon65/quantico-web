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

  verResultado(id,concepto){
    this.fetchCompletosDetalle(id,concepto);
  }
  verDetalle(){
    this.setState({
      nombresVer:this.state.tb_detalles.nombres,
      apellidosVer:this.state.tb_detalles.apellidos,
      celularVer:this.state.tb_detalles.celular,
      correoVer:this.state.tb_detalles.correo,
      nombreMVer:this.state.tb_detalles.nombre,
      totalVer:this.state.tb_detalles.total,
      imagenComprobanteCompraVer:this.state.tb_detalles.comprobanteCompra
    },()=>this.cambiarModalVerCompletos())
  }


  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }

  fetchCompletosDetalle(id,concepto){
      console.log(id)
      fetch(`${Config.api}verificaciones/detalles?concepto=${concepto}&id=${id}`,
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
              tb_detalles: data['datos']
            },()=>{
              console.log(this.state.tb_detalles);
              this.verDetalle()
            })
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
                                                  <button className="btn btn-sm btn-info"  type="button" onClick={()=>this.verResultado(task.id,task.concepto)}>
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
                                            <div>
                                              <label>Nombres:</label><br/>
                                              <h4>{this.state.nombresVer}</h4>
                                            </div>
                                            <div>
                                              <label>Apellidos:</label><br/>
                                              <h4>{this.state.apellidosVer}</h4>
                                            </div>
                                            <div>
                                              <label>Celular:</label><br/>
                                              <h4>{this.state.celularVer}</h4>
                                            </div>
                                            <div>
                                              <label>Correo:</label><br/>
                                              <h4>{this.state.correoVer}</h4>
                                            </div>
                                            <div>
                                              <label>Nombre de Membresia:</label><br/>
                                              <h4>{this.state.nombreMVer}</h4>
                                            </div>
                                            <div>
                                              <label>Total:</label><br/>
                                              <h4>{this.state.totalVer}</h4>
                                            </div>
                                            <div>
                                              <label>Comprobante de la compra:</label><br/>
                                              <img src={this.state.imagenComprobanteCompraVer} width="400" height="400" />
                                            </div>
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
