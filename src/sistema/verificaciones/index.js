import React, {Component} from 'react';
import {Row, Col,Modal,Pagination,Table} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files";
import Paginar from "../../paginate"

class IndexVerificaciones extends Component {
  constructor(){
    super();
    this.state = {
      tb_verificaciones:[],
      arrayImagenes:[],
      var_texto_numeroPagina:1,
      buscarT:"nombres",
      valor:'',
      //modales
      estadoModalVerVerificaciones:false,

    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_verificaciones.data,"verificaciones");
  }
  cambiarModalVerVerificaciones(){
        this.setState({
          estadoModalVerVerificaciones: !this.state.estadoModalVerVerificaciones
        })
  }

  verVerificaciones(imagenes){
    this.setState({
      arrayImagenes: imagenes
    })
    this.cambiarModalVerVerificaciones();
  }

  imagenQuitar(index,id){
    let num = id +1
    let a = this.state.arrayImagenes
        a.splice(index,1)

      this.setState({
        ['comentario'+num]:'',
        arrayImagenes: a
      },()=>{
        this.fetchVerificaciones(true,1)
      })
  }

  sendDenegar(id,estado,concepto,index,msg){
    if(msg==null || msg==''){
      cogoToast.warn("Debe introducir algún mensaje primero");
    }else{
        fetch(`${Config.api}verificaciones/verificarCompra`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                id: id,
                estado : estado,
                concepto : concepto,
                mensaje: msg
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

              if(concepto=="Membresia"){
                  cogoToast.warn(data.mensaje);
                  this.imagenQuitar(index,id);
              }
              else{
                  cogoToast.success("Imagen denegada");
                  this.imagenQuitar(index,id);
              }
            }
            else{
              cogoToast.error("No se puede denegar la membresia")
            }
        }).catch((error)=> {
          cogoToast.error("No se pudo denegar la membresia");
      });}
  }
  sendAceptar(id,estado,concepto,index){
    fetch(`${Config.api}verificaciones/verificarCompra`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
            id: id,
            estado : estado,
            concepto : concepto,
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
            cogoToast.success("Imagen aceptada");
            this.imagenQuitar(index);
          }
        else{
          cogoToast.error(data.mensaje)
        }
    }).catch((error)=> {
      cogoToast.error("No se pudo aceptar")
  });
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
      this.fetchVerificaciones(true,1);
    })
  }

  fetchVerificaciones(boleano,numero){
      fetch(`${Config.api}verificaciones/mostrar?page=${numero}&columna=${this.state.buscarT}&buscar=${this.state.valor}`,
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'estado' : '1',
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
                tb_verificaciones: data['datos'],
                var_texto_numeroPagina: numero
              })
          }
      }).catch((error)=> {

    });
  }
  componentDidMount(){
      this.fetchVerificaciones(true,1);
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Verificaciones' isOption>
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
                        <table id="tb_membresia" className="table table-striped table-responsive" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Correo</th>
                                    <th>Concepto</th>
                                    <th>Descripcion</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_verificaciones.data ?
                                    this.state.tb_verificaciones.data.map((task,index) =>{
                                        return (
                                            <tr key={index}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.correo}</td>
                                                <td>{task.concepto}</td>
                                                <td>{task.descripcion}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.verVerificaciones(
                                                      task.imagenes
                                                  )}><i className="fa fa-pencil"/></button>
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
                                      this.fetchVerificaciones(
                                        true,
                                        this.state.var_texto_numeroPagina-1,
                                    )
                                  }}
                                />
                                    {
                                        <Paginar data={this.state.tb_verificaciones} fetch={(bolean,numero)=>this.fetchVerificaciones(bolean,numero)} ></Paginar>
                                    }
                                <Pagination.Next
                                    onClick={() => {
                                      this.fetchVerificaciones(
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
                    show={this.state.estadoModalVerVerificaciones}
                    onHide={() => this.cambiarModalVerVerificaciones()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Ver verificaciones
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                        <Col md={4}>
                          <div style={{position:'fixed'}}>
                            <p >NOMBRE COMPLETO</p>
                            <p >DNI</p>
                            <p >TELEFONO</p>
                            <p >OTROS</p>
                            <p >CAMPO EXTRA</p>
                          </div>
                          </Col>
                          <Col md={8}>
                            <Table responsive>
                              <tbody>
                                  {
                                   this.state.arrayImagenes ?
                                   this.state.arrayImagenes.map((task,index) =>{
                                       return (
                                          <tr>
                                          <td key={index} className="card w-80 bg-light ">
                                              <div>
                                                <label>Imagen:</label><br/>
                                                <h4>{task.concepto}</h4><br/>
                                                <img src={task.imagen} width="400" height="500"/>
                                              </div>
                                              <div>
                                                <button className="btn btn-sm btn-danger" onClick={()=>this.sendDenegar(task.id,2,task.concepto,index,this.state['comentario'+task.id])} ><i className="fa fa-remove"></i></button>
                                                <button className="btn btn-sm btn-success" onClick={()=>this.sendAceptar(task.id,1,task.concepto,index)}><i className="fa fa-check"></i></button>
                                              </div>
                                              <div className="p-2">
                                                  <label>Comentario:</label><br/>
                                                  <textarea name={'comentario'+task.id} cols="50" rows="6" value={this.state['comentario'+task.id]}  onChange={this.handleChange}></textarea>
                                              </div>
                                          </td>
                                        </tr>
                                        )
                                  }):null
                                }
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                    </Modal.Body>
                  </Modal>
            </Aux>
        );
    }
}

export default IndexVerificaciones;
