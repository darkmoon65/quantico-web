import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";

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

  cambiarModalVerCompletos(){
        this.setState({
          estadoModalVerVerCompletos: !this.state.estadoModalVerVerCompletos
        })
  }

  verResultado(){
    this.cambiarModalVerCompletos();
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

  fetchCompletos(){
      fetch('http://107.23.50.10/verificaciones/mostrar',
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
              'estado': '3'
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
                                    this.state.tb_completos ?
                                    this.state.tb_completos.map(task =>{
                                        return (
                                            <tr key={task.id}>
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
                                            <label>Imagen:</label><br/>
                                            <img src={this.state.imagenEditar} width="400" height="500"/>
                                          </div>
                                          <div>
                                            <button className="btn btn-danger" ><i className="fa fa-remove"></i></button>
                                            <button className="btn btn-success" ><i className="fa fa-check"></i></button>
                                          </div>
                                          <div className="p-2">
                                              <label>Comentario:</label><br/>
                                              <textarea name="comentario" cols="50" rows="6" onChange={this.handleChange}></textarea>
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
