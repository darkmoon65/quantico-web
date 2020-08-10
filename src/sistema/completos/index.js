import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import Paginar from "../../paginate"

class IndexCompletos extends Component {
  constructor(){
    super();
    this.state = {
      tb_completos:[],
      buscarT:"nombres",
      valor:'',
      var_texto_numeroPagina:1,
      //modales
      estadoModalVerVerCompletos:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
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
  verDetalle(concepto){
    let mostrar
    if(concepto=="Membresia Gratuita"){
      mostrar = false
    }else{
      mostrar = true
    }

    this.setState({
      nombresVer:this.state.tb_detalles.nombres,
      apellidosVer:this.state.tb_detalles.apellidos,
      celularVer:this.state.tb_detalles.celular,
      correoVer:this.state.tb_detalles.correo,
      nombreMVer:this.state.tb_detalles.nombre,
      totalVer:this.state.tb_detalles.total,
      mostrarImg: mostrar,
      imagenComprobanteCompraVer:this.state.tb_detalles.comprobanteCompra
    },()=>this.cambiarModalVerCompletos())
  }


  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }
  handleChangeBuscador(e){
    const value = e.target.value;
    this.setState({
      valor: value
    },()=>{
      this.fetchCompletos(true,1);
    })
  }

  fetchCompletosDetalle(id,concepto){
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
              this.verDetalle(concepto)
            })
          }
      }).catch((error)=> {

    });
  }

  fetchCompletos(boleano,numero){
      fetch(`${Config.api}verificaciones/mostrar?page=${numero}&columna=${this.state.buscarT}&buscar=${this.state.valor}`,
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
          if(data.respuesta==true){
            this.setState({
              tb_completos: data['datos'],
              var_texto_numeroPagina: numero
            })
          }
      }).catch((error)=> {

    });
  }
  componentDidMount(){
      this.fetchCompletos(true,1);
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Completos' isOption>
                        <h4 className="card-title">Buscar</h4>
                        <input type="text" onChange={this.handleChangeBuscador} />
                        <span className="p-5">

                            <select  name="buscarT" id="tipoProducto" style={{width: '15%'}} onChange={this.handleChange} value={this.state.buscarT}>
                                <option key={1} value={"nombres"}>Nombres</option>
                                <option key={2} value={"apellidos"}>Apellidos</option>
                                <option key={3} value={"correo"}>Correo</option>
                                <option key={4} value={"descripcion"}>Descripcion</option>
                            </select>
                        </span>
                        <span className="p-5"><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></span>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
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
                                    this.state.tb_completos.data ?
                                    this.state.tb_completos.data.map((task,index) =>{
                                        return (
                                            <tr key={index}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
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
                        <div className="float-right">
                              <Pagination  >
                                <Pagination.Prev
                                    onClick={() => {
                                      this.fetchCompletos(
                                        true,
                                        this.state.var_texto_numeroPagina-1,
                                    )
                                  }}
                                />
                                    {
                                        <Paginar data={this.state.tb_completos} fetch={(bolean,numero)=>this.fetchCompletos(bolean,numero)} ></Paginar>
                                    }
                                <Pagination.Next
                                    onClick={() => {
                                      this.fetchCompletos(
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
                                            {
                                              this.state.mostrarImg?
                                              <div>
                                                <label>Comprobante de la compra:</label><br/>
                                                <img src={this.state.imagenComprobanteCompraVer} width="400" height="400" />
                                              </div>
                                              :null
                                            }
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
