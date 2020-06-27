import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";

class IndexVerificaciones extends Component {
  constructor(){
    super();
    this.state = {
      tb_verificaciones:[],
      arrayImagenes:[],
      //modales
      estadoModalVerVerificaciones:false,

    }
    this.handleChange = this.handleChange.bind(this);
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
      arrayImagenes: a
    })
    this.fetchVerificaciones()
  }

  sendDenegar(id,estado,concepto,index){
        fetch('http://107.23.50.10/verificaciones/verificarCompra',
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                id: id,
                estado : estado,
                concepto : concepto,
                mensaje: this.state.comentario
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
              cogoToast.success("Imagen Denegada");
              this.imagenQuitar(index);
            }
            else{
              console.log(data)
              console.log("hubo un error con la peticion")
            }
        }).catch((error)=> {
          console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
  }
  sendAceptar(id,estado,concepto,index){
    fetch('http://107.23.50.10/verificaciones/verificarCompra',
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
            'Content-type' : 'application/json'
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
          console.log("hubo un error con la peticion")
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
  handleChangeFile (e){
        var file = e.target.files[0];
        var fileData = new FileReader();
        if(file){
          fileData.readAsDataURL(file);
        }
        else{
          cogoToast.warn("Se quito la imagen");
        }
        if(e.target.name == "imgTarjeta"){
          fileData.onload = (event)=> {
            this.setState({imagenTarjeta: fileData.result},
              ()=>{
                  cogoToast.success("Imagen de tarjeta lista")
                }
              );
            }
        }
        else if (e.target.name == "imgCurso") {
          fileData.onload = (event)=> {
            this.setState({imagenCurso: fileData.result},
              ()=>{
                  cogoToast.success("Imagen de curso lista")
                }
              );
            }
        }
    }

  fetchVerificaciones(){
      fetch('http://107.23.50.10/verificaciones/mostrar',
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'estado' : '1',
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data){
            console.log(data)
            this.setState({
              tb_verificaciones: data
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
      this.fetchVerificaciones();
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
                                    this.state.tb_verificaciones ?
                                    this.state.tb_verificaciones.map((task,index) =>{
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
                                                  <img src={task.dato} width="400" height="500"/>
                                                </div>
                                                <div>
                                                  <button className="btn btn-danger" onClick={()=>this.sendDenegar(task.id,2,task.concepto,index)} ><i className="fa fa-remove"></i></button>
                                                  <button className="btn btn-success" onClick={()=>this.sendAceptar(task.id,1,task.concepto,index)}><i className="fa fa-check"></i></button>
                                                </div>
                                                <div className="p-2">
                                                    <label>Comentario:</label><br/>
                                                    <textarea name={'comentario'+task.id} cols="50" rows="6" onChange={this.handleChange}></textarea>
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
