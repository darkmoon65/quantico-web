import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import Paginar from "../../paginate"

class IndexSugerencias extends Component {
  constructor(){
    super();
    this.state = {
      tb_sugerencias:[],
      valor:'',
      buscarT:'nombres',
      //modales
      estadoModalVerSugerencias:false,
      valor:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_sugerencias.datos,"sugerencias");
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
    },()=>this.fetchSugerencias())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }
  handleChangeBuscador(e){
    const value = e.target.value;
    this.setState({
      valor: value
    },()=>{
      console.log(value);
      this.fetchSugerencias();
    })
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
  fetchSugerencias(boleano,numero){
      fetch(`${Config.api}sugerencias/mostrar?page=${numero}&columna=${this.state.buscarT}&buscar=${this.state.valor}`,
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
              tb_sugerencias: data['datos'],
              var_texto_numeroPagina: numero
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
      this.fetchSugerencias(true,1);
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Sugerencias' isOption>
                        <h4 className="card-title">Buscar</h4>
                        <input type="text" onChange={this.handleChangeBuscador} />
                        <span className="p-5">
                          <select  name="buscarT" id="tipoProducto" style={{width: '15%'}} onChange={this.handleChange} value={this.state.buscarT}>
                                <option key={1} value={"nombres"}>Nombres</option>
                                <option key={2} value={"apellidos"}>Apellidos</option>
                                <option key={3} value={"celular"}>Celular</option>
                                <option key={4} value={"fecha"}>Fecha</option>
                          </select>
                        </span>
                        <span className="p-5"><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></span>
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
                                    this.state.tb_sugerencias.data ?
                                    this.state.tb_sugerencias.data.map(task =>{
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
                        <div className="float-right">
                                <Pagination  >
                                  <Pagination.Prev
                                      onClick={() => {
                                        this.fetchSugerencias(
                                          true,
                                          this.state.var_texto_numeroPagina-1,
                                      )

                                    }}
                                  />
                                      {
                                         <Paginar data={this.state.tb_sugerencias} fetch={(bolean,numero)=>this.fetchSugerencias(bolean,numero)} ></Paginar>
                                      }
                                  <Pagination.Next
                                      onClick={() => {
                                        this.fetchSugerencias(
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
