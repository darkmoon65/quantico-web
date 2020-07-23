import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexTiposPago extends Component {
  constructor(){
    super();
    this.state = {
      tb_tiposPago:[],
      nombreTipoProducto:'',
      //modales
      estadoModalCrearTiposPago:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_tiposPago,"tipos-pagos");
  }
  cambiarModalCrearTiposPago(){
        this.setState({
          estadoModalCrearTiposPago: !this.state.estadoModalCrearTiposPago
        })
  }
  clean(){
    this.setState({
      estadoModalCrearTiposPago: false,
      nombreTipoProducto:''
    },()=>this.fetchTiposPago())
  }

  handleChange(e){

    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }
  enviarCrearTiposPago(){
          fetch(`${Config.api}tiposPago/crear`,
            {
              mode:'cors',
              method: 'POST',
              body: JSON.stringify({
                  nombre : this.state.nombreTiposPago,
                  integracion: this.state.integracionCrear,
                  esCuentaBancaria: this.state.esCuentaBancariaCrear,
                  oculto: this.state.ocultoCrear,
                  imagen: this.state.imagen
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
                console.log(data)
                cogoToast.error("No se creo,verifique los datos")
                console.log("hubo un error con la peticion")
              }
          }).catch((error)=> {
            cogoToast.error("No se creo el tipo de producto")
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
    }
    editarTiposPago(){

    }
    enviarEliminarTiposPago(id){
          fetch(`${Config.api}tiposPago/eliminar`,
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
                  console.log(data)
                  cogoToast.error("No se elimino verifique los datos")
                  console.log("hubo un error con la peticion")
                }
            }).catch((error)=> {
              cogoToast.error("No se elimino el tipo de producto")
              console.log('Hubo un problema con la petición Fetch:' + error.message);
          });
      }

  limpiarBoleanos(){
    let array = this.state.tb_tiposPagoS
    let newArray = []
    array.datos.map((data)=>{
      let integracion
      let esCuentaBancaria
      let oculto
      if (data.integracion == 1){
          integracion = "si"
      }else{
          integracion= "no"
      }
      if (data.esCuentaBancaria ==1){
          esCuentaBancaria="si"
      }else{
         esCuentaBancaria= "no"
      }
      if (data.oculto == 1){
         oculto="si"
      }else{
        oculto="no"
      }
      newArray.push({
        id:data.id,
        nombre:data.nombre,
        integracion: integracion,
        esCuentaBancaria: esCuentaBancaria,
        oculto: oculto,
        imagen: data.imagen
      })
    })
    this.setState({
      tb_tiposPago: newArray
    },()=>console.log(this.state.tb_tiposPago))
  }

  fetchTiposPago(){
        fetch(`${Config.api}tiposPago/mostrar`,
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
            console.log(data)
            this.setState({
              tb_tiposPagoS: data
            },()=>{
              console.log(this.state.tb_tiposPagoS);
              this.limpiarBoleanos()
            })
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }

    handleChangeFile (e){
          var file = e.target.files[0];
          var fileData = new FileReader();
          if(file){
            fileData.readAsDataURL(file);
          }
          else{
            cogoToast.warn("Se quito la imagen");
          }
          fileData.onload = (event)=> {
              this.setState({imagen: fileData.result},
                ()=>{
                    cogoToast.success("Imagen lista ");
                    console.log(this.state.imagen)
                    }
                );
        }
    }
  componentDidMount(){
      this.fetchTiposPago();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Tipos de pago' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearTiposPago()}>Crear Tipos de pago </button> </th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Integracion</th>
                                    <th>Es cuenta bancaria</th>
                                    <th>Oculto</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_tiposPago ?
                                    this.state.tb_tiposPago.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>{task.integracion}</td>
                                                <td>{task.esCuentaBancaria}</td>
                                                <td>{task.oculto}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary"  type="button" onClick={()=>this.editarTiposPago(task.id,)}>
                                                    <i className="fa fa-pencil" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger"  type="button" onClick={()=>this.enviarEliminarTiposPago(task.id)}>
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
                      show={this.state.estadoModalCrearTiposPago}
                      onHide={() => this.cambiarModalCrearTiposPago()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Crear tipos de pago
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-75">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Nombre :</label>
                                              <input type="text" className="form-control" name="nombreTiposPago" onChange={this.handleChange} />
                                            </div>
                                            <div>
                                              <label>Imagen: </label>
                                              <div className="input-group p-1">
                                                <input type="file" className="form-control-file" name="imagen" onChange={e =>this.handleChangeFile(e)}/>
                                              </div>
                                            </div>
                                            <div className="p-2">
                                              <label>Integracion: </label>
                                              <select className="form-control" name="integracionCrear" style={{width: '50%'}} onChange={this.handleChange} value={this.state.integracionCrear}>
                                                  <option key={0} value={null}>--escoge una opcion--</option>
                                                  <option key={1} value={1}>Si</option>
                                                  <option key={2} value={0}>No</option>
                                              </select>
                                            </div>
                                            <div className="p-2">
                                              <label>Es cuenta bancaria: </label>
                                              <select className="form-control" name="esCuentaBancariaCrear" style={{width: '50%'}} onChange={this.handleChange} value={this.state.esCuentaBancariaCrear}>
                                                  <option key={0} value={null}>--escoge una opcion--</option>
                                                  <option key={1} value={1}>Si</option>
                                                  <option key={2} value={0}>No</option>
                                              </select>
                                            </div>
                                            <div className="p-2">
                                              <label>Oculto: </label>
                                              <select className="form-control" name="ocultoCrear" style={{width: '50%'}} onChange={this.handleChange} value={this.state.ocultoCrear}>
                                                  <option key={0} value={null}>--escoge una opcion--</option>
                                                  <option key={1} value={1}>Si</option>
                                                  <option key={2} value={0}>No</option>
                                              </select>
                                            </div>
                                            <div className="mx-auto p-2">
                                              <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.enviarCrearTiposPago()}>Crear tipo de producto</button>
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

export default IndexTiposPago;
