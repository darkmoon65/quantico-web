import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

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
      //modales
      estadoModalVerVerificaciones:false,

    }
    this.handleChange = this.handleChange.bind(this);
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
    },()=>console.log(this.state.arrayImagenes))
    this.cambiarModalVerVerificaciones();
  }

  imagenQuitar(index){
    let a = this.state.arrayImagenes
        a.splice(index,1)

      this.setState({
        arrayImagenes: a,
      },()=>{
        this.fetchVerificaciones()
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
              console.log(data)
              if(concepto=="Membresia"){
                  cogoToast.warn(data.mensaje);
                  this.imagenQuitar(index);
              }
              else{
                  cogoToast.success("Imagen denegada");
                  this.imagenQuitar(index);
              }
            }
            else{
              console.log(data)
              console.log("No se puede denegar la membresia")
            }
        }).catch((error)=> {
          console.log('Hubo un problema con la petición Fetch:' + error.message);
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
          console.log(data)
          cogoToast.error(data.mensaje)
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}


  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
      console.log(name)
    })
  }

  fetchVerificaciones(boleano,numero){
      fetch(`${Config.api}verificaciones/mostrar?page=${numero}`,
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
            console.log(data)
            this.setState({
              tb_verificaciones: data['datos'],
              var_texto_numeroPagina: numero
            },()=>{console.log(this.state.tb_verificaciones)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchVerificaciones(true,1);
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Verificaciones' isOption>
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
                                                <td>{task.usuario.nombres}</td>
                                                <td>{task.usuario.apellidos}</td>
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
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body text-center">

                                    {
                                     this.state.arrayImagenes ?
                                     this.state.arrayImagenes.map((task,index) =>{
                                         return (
                                            <div>
                                                <div>
                                                  <label>Imagen:</label><br/>
                                                  <label>{task.concepto}</label><br/>
                                                  <img src={task.imagen} width="400" height="500"/>
                                                </div>
                                                <div>
                                                  <button className="btn btn-danger" onClick={()=>this.sendDenegar(task.id,2,task.concepto,index,this.state['comentario'+task.id])} ><i className="fa fa-remove"></i></button>
                                                  <button className="btn btn-success" onClick={()=>this.sendAceptar(task.id,1,task.concepto,index)}><i className="fa fa-check"></i></button>
                                                </div>
                                                <div className="p-2">
                                                    <label>Comentario:</label><br/>
                                                    <textarea name={'comentario'+task.id} cols="50" rows="6" value={this.state['comentario'+task.id]}  onChange={this.handleChange}></textarea>
                                                </div>
                                            </div>

                                          )
                                    }):null
                                  }
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
            </Aux>
        );
    }
}

export default IndexVerificaciones;
