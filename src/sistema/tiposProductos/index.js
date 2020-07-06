import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"

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
    },()=>{
      console.log(value)
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
                  'Content-type' : 'application/json'
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
                console.log(data)
                cogoToast.error("No se creo,verifique los datos")
                console.log("hubo un error con la peticion")
              }
          }).catch((error)=> {
            cogoToast.error("No se creo el tipo de producto")
            console.log('Hubo un problema con la petición Fetch:' + error.message);
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
                    'Content-type' : 'application/json'
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
                  console.log(data)
                  cogoToast.error("No se elimino verifique los datos")
                  console.log("hubo un error con la peticion")
                }
            }).catch((error)=> {
              cogoToast.error("No se elimino el tipo de producto")
              console.log('Hubo un problema con la petición Fetch:' + error.message);
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
              'estado': '3'
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data){
            console.log(data)
            this.setState({
              tb_tipoProductos: data
            },()=>{console.log(this.state.tb_tipoProductos)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchTipoProductos();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Tipos de productos' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><h4 className="card-title">Buscar </h4></th>
                                    <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearTipoProductos()}>Crear Tipos de productos </button> </th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Opciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_tipoProductos ?
                                    this.state.tb_tipoProductos.map(task =>{
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
