import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import { Redirect } from 'react-router-dom'
import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexAsistencias extends Component {
  constructor(){
    super();
    this.state = {
      tb_asistencias:[],
      asistenciasTablaVer:[],
      valor:'',
      //modales
      verAsistencia:false,
      estadoModalVerAsistencias:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
  }

  cambiarModalVerAsistencias(){
        this.setState({
          estadoModalVerAsistencias: !this.state.estadoModalVerAsistencias
        })
  }

  clean(){
    this.setState({
      estadoModalVerAsistencias: false,
      nombreCrear:'',
      numeroCrear:'',
      cargoCrear:''
    },()=>this.fetchContactos())
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
      this.fetchAsistencias();
    })
  }

  eliminarAsistencias(id){

  }
  descargarExcel(){
    Files.exportToCSV(this.state.asistenciasTablaVer,"asistencias");
  }
  verAsistencia(id,nombre,apellido,correo,celular,sugerencia,fecha){
    this.setState({
      idVer: id,
      nombreVer:nombre,
      apellidoVer: apellido,
      correoVer: correo,
      celularVer: celular,
      sugerenciaVer: sugerencia,
      fechaVer: fecha
    },()=>this.cambiarModalVerAsistencias())
  }
  fetchAsistencias(boleano,numero){
      fetch(`${Config.api}asistencias/mostrar?buscar=${this.state.valor}`,
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
              tb_asistencias: data['datos']
            })
          }
      }).catch((error)=> {

    });
  }
  cambiarVerAsistencias(id){
      var array = this.state.tb_asistencias.data
      let asistencias
      array.map((data)=>{
        if(data.id==id){
           asistencias = data.asistencias
        }
      })

      this.setState({
        verAsistencia: true,
        asistenciasTablaVer: asistencias
      })
  }
  cambiarVerPrincipal(id){
      this.setState({
        verAsistencia: false,
      })
  }
  componentDidMount(){
      this.fetchAsistencias();
    }
    render() {
        return (
            <Aux>
            {

                this.state.verAsistencia?
                <Row>
                    <Col>
                        <Card title='Asistencias' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                    <th><button className="btn btn-sm btn-primary" type="button" onClick={()=>this.cambiarVerPrincipal()}>
                                      Regresar
                                    </button></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Correo</th>
                                    <th>Celular</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.asistenciasTablaVer ?
                                    this.state.asistenciasTablaVer.map((task,index) =>{
                                        return (
                                            <tr key={index}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.correo}</td>
                                                <td>{task.celular}</td>
                                            </tr>
                                        );
                                    } )   : null
                                }
                            </tbody>
                        </table>
                        </Card>
                    </Col>
                </Row>
                :
                <Row>
                  <Col>
                      <Card title='Cursos Activos' isOption>
                      <h4 className="card-title">Buscar </h4>
                      <span><input type="text" onChange={this.handleChangeBuscador} /></span>
                      <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                          <thead>
                              <tr>
                                  <th>Nombre</th>
                                  <th>Inicio</th>
                                  <th>Fin</th>
                                  <th>Total de asistencias</th>
                              </tr>
                            </thead>
                            <tbody>
                                 {
                                  this.state.tb_asistencias.data ?
                                  this.state.tb_asistencias.data.map(task =>{
                                      return (
                                          <tr key={task.id}>
                                              <td>{task.nombre}</td>
                                              <td>{task.inicio}</td>
                                              <td>{task.fin}</td>
                                              <td>{task.totalAsistencias}</td>
                                              <td>
                                                <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.cambiarVerAsistencias(task.id)}>
                                                  <i className="fa fa-eye" ></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarAsistencias(task.id)}>
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
            }

            </Aux>
        );
    }
}

export default IndexAsistencias;
