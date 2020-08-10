import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexTipoProductos extends Component {
  constructor(){
    super();
    this.state = {
      tb_tipoProductos:[],
      nombreTipoProducto:'',
      //modales
      estadoModalCrearTipoProductos:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_tipoProductos.datos,"tipos-productos");
  }
  cambiarModalCrearTipoProductos(){
        this.setState({
          estadoModalCrearTipoProductos: !this.state.estadoModalCrearTipoProductos
        })
  }
  clean(){
    this.setState({
      estadoModalCrearTipoProductos: false,
      nombreTipoProducto:''
    },()=>this.fetchTipoProductos())
  }

  handleChange(e){

    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }

  enviarCrearTipoProducto(){
          fetch(`${Config.api}productos/crearTipo`,
            {
              mode:'cors',
              method: 'POST',
              body: JSON.stringify({
                  nombre : this.state.nombreTipoProducto,
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
                cogoToast.success("Tipo de producto creado");
                this.clean();
              }
              else{
                cogoToast.error("No se creo,verifique los datos")
              }
          }).catch((error)=> {
            cogoToast.error("No se creo el tipo de producto")
        });
    }
    enviarEliminarTipoProducto(id){
          fetch(`${Config.api}productos/eliminarTipo`,
              {
                mode:'cors',
                method: 'POST',
                body: JSON.stringify({
                    id : id,
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
                  cogoToast.success("Tipo de producto eliminado");
                  this.clean();
                }
                else{
                  cogoToast.error("No se elimino verifique los datos")
                }
            }).catch((error)=> {
              cogoToast.error("No se elimino el tipo de producto")
          });
      }


  fetchTipoProductos(){
      fetch(`${Config.api}productos/mostrarTipos`,
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
              tb_tipoProductos: data
            })
          }
      }).catch((error)=> {

    });
  }
  componentDidMount(){
      this.fetchTipoProductos();
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Tipos de productos' isOption>
                            <span className="p-5">
                              <button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearTipoProductos()}>Crear Tipos de productos </button>
                              <button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button>
                            </span>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Opciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_tipoProductos.datos ?
                                    this.state.tb_tipoProductos.datos.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-danger"  type="button" onClick={()=>this.enviarEliminarTipoProducto(task.id)}>
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
                  <Modal
                      size="lg"
                      show={this.state.estadoModalCrearTipoProductos}
                      onHide={() => this.cambiarModalCrearTipoProductos()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Crear tipo de producto
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-75">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Nombre :</label>
                                              <input type="text" className="form-control" name="nombreTipoProducto" onChange={this.handleChange} />
                                            </div>
                                            <div className="mx-auto p-2">
                                              <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.enviarCrearTipoProducto()}>Crear tipo de producto</button>
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

export default IndexTipoProductos;
