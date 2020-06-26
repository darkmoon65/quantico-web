import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";

class IndexComprobantes extends Component {
  constructor(){
    super();
    this.state = {
      tb_comprobantes:[{id: 1, nombre:"ejemplo"}],

      //modales
      estadoModalSubirComprobantes:false,

    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalSubirComprobantes(){
        this.setState({
          estadoModalSubirComprobantes: !this.state.estadoModalSubirComprobantes
        })
  }

  subirVerificaciones(){
    this.cambiarModalSubirComprobantes();
  }


  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
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
              tb_comprobantes: data
            },()=>{console.log(this.state.tb_comprobantes)})
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
              this.setState({imgComprobante: fileData.result},
                ()=>{
                    cogoToast.success("Imagen de tarjeta lista")
                  }
                );
              }
      }
  componentDidMount(){
      //this.fetchVerificaciones();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Comprobantes' isOption>
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
                                    this.state.tb_comprobantes ?
                                    this.state.tb_comprobantes.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-info"  type="button" onClick={()=>this.subirVerificaciones(task.id)}>
                                                    <i className="fa fa-upload" ></i>
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
                    size="md"
                    show={this.state.estadoModalSubirComprobantes}
                    onHide={() => this.cambiarModalSubirComprobantes()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Subir Comprobantes
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                          <div className="card w-100">
                              <div className="modal-body">
                                  <div className="card-body">
                                          <div>
                                            <label>Subir comprobante:</label><br/>
                                            <input type="file" className="form-control-file" name="imgComprobante" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                          <div className="p-2">
                                            <img src={this.state.imgComprobante} width="300" height="300"/>
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

export default IndexComprobantes;
