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
      tb_respuestas:[],
      arrayImagenes:[],
      var_texto_numeroPagina:1,
      buscarT:"nombres",
      valor:'',
      //modales
      estadoModalVerVerificaciones:false,

    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
    this.handleChangeComentario = this.handleChangeComentario.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_verificaciones.data,"verificaciones");
  }

  cambiarModalVerVerificaciones(ope){
        this.setState({
          estadoModalVerVerificaciones: !this.state.estadoModalVerVerificaciones
        })
        if(ope=="salir"){
            this.fetchVerificaciones(true,1)
        }
  }

  verVerificaciones(imagenes,nombres,apellidos,datosExtras){
    let fechaNacimiento;
    let direccion;
    let dni;
    let num;
    if(datosExtras){
      fechaNacimiento = datosExtras.fechaNacimiento;
      direccion = datosExtras.direccion;
      dni = datosExtras.documentoIdentidad
    }
    for (var i = 0; i < imagenes.length; i++) {
        if (imagenes[i].concepto == "Membresia") {
          num = i-1;
          break;
        }
    }

    this.setState({
      numerito : num,
      arrayImagenes: imagenes,
      nombresVer: nombres,
      apellidosVer: apellidos,
      fechaNacimientoVer: fechaNacimiento,
      direccionVer: direccion,
      documentoIdentidadVer: dni
    })
    this.cambiarModalVerVerificaciones();
  }

  imagenQuitar(index,id){
    let num = id +1
    let a = this.state.arrayImagenes
    if (a.length==1){
      this.cambiarModalVerVerificaciones("salir");
    }else{
      a.splice(index,1)
      this.setState({
        ['comentario'+num]:'',
        arrayImagenes: a
        },()=>{
        this.fetchVerificaciones(true,1)
      })
    }

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
                cogoToast.success("Imagen denegada");
                this.imagenQuitar(index,id);
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
  handleChangeComentario(e){
    const {name, value} = e.target;
    const selectedIndex = e.target.options.selectedIndex;
    const number = e.target.options[selectedIndex].getAttribute('kr');

    this.setState({
      ['comentario'+number]: value
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
  fetchRespuestas(){
      fetch(`${Config.api}comentarios/mostrar`,
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
              tb_respuestas: data['datos']
            })
          }
      }).catch((error)=> {

    });
  }
  componentDidMount(){
      this.fetchVerificaciones(true,1);
      this.fetchRespuestas();
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
                                <option key={5} value={"nroTarjeta"}>Tarjeta</option>
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
                                    <th>Tarjeta</th>
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
                                                <td>{task.nroTarjeta}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.verVerificaciones(
                                                      task.imagenes,
                                                      task.nombres,
                                                      task.apellidos,
                                                      task.datosPersonales
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
                          <div style={{position:'fixed', width:'20%'}}>

                            <p >Nombres:</p>
                            <h5>{this.state.nombresVer}</h5>
                            <p >Apellidos:</p>
                            <h5>{this.state.apellidosVer}</h5>
                            <p >DNI:</p>
                            <h5>{this.state.documentoIdentidadVer}</h5>
                            <p >Fecha Nacimiento:</p>
                            <h5>{this.state.fechaNacimientoVer}</h5>
                            <p >Direccion:</p>
                            <h6>{this.state.direccionVer}</h6>

                          </div>
                          </Col>
                          <Col md={8}>
                            <Table responsive>
                              <tbody>
                                  {
                                   this.state.arrayImagenes ?
                                   this.state.arrayImagenes.map((task,index) =>{
                                       return (
                                          <tr key={index}>
                                          <td  className="card w-80 bg-light ">
                                              <div>
                                                <label>Imagen:</label><br/>
                                                {
                                                  (task.concepto=="Membresia")?
                                                  <div>

                                                   <h4>Comprobante {index-(this.state.numerito)}</h4>
                                                  </div>
                                                  :<h4>{task.concepto}</h4>
                                                }

                                                <img src={task.imagen} width="400" height="500"/>
                                              </div>
                                              <div>
                                                <button className="btn btn-sm btn-danger" onClick={()=>this.sendDenegar(task.id,2,task.concepto,index,this.state['comentario'+task.id])} ><i className="fa fa-remove"></i></button>
                                                <button className="btn btn-sm btn-success" onClick={()=>this.sendAceptar(task.id,1,task.concepto,index)}><i className="fa fa-check"></i></button>
                                              </div>
                                              <div>
                                                  <select className="form-control" name={'respuestaSelect'+task.id} style={{width: '90%'}} onChange={this.handleChangeComentario} value={this.state['respuestaSelect'+task.id]} >
                                                      <option key={0} value={null}>-Elige una opcion-</option>
                                                      {
                                                      this.state.tb_respuestas?
                                                      this.state.tb_respuestas.map((data,index)=>{
                                                       return(
                                                          <option key={data.id} kr={task.id} value={data.comentario}>{data.comentario}</option>
                                                       )
                                                      }):null
                                                      }

                                                  </select>
                                              </div>
                                              <div className="p-2">
                                                  <label>Comentario:</label><br/>
                                                  <textarea name={'comentario'+task.id} cols="50" rows="6" maxLength="250" value={this.state['comentario'+task.id]}  onChange={this.handleChange}></textarea>
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
