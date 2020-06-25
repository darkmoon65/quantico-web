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

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
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
              'Accept' : 'application/json',
              'Content-type' : 'application/json'
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data){
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
                        <Card title='Hello Card' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><h4 className="card-title">Buscar </h4></th>
                                    <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_verificaciones ?
                                    this.state.tb_verificaciones.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>{task.periodo}</td>
                                                <td>{task.oculto}</td>
                                                <td>{task.costo}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.verVerificaciones(
                                                      task.id,
                                                      task.nombre,
                                                      task.periodo,
                                                  )}><i className="feather icon-trending-up"/></button>
                                                  <button className="btn btn-sm btn-danger "  type="button" onClick={()=>this.eliminarVerificaciones(task.id)}>
                                                    <i className="fa fa-trash" ></i>
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
            </Aux>
        );
    }
}

export default IndexVerificaciones;
