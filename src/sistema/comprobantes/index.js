import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";

class IndexComprobantes extends Component {
  constructor(){
    super();
    this.state = {
      tb_comprobantes:[],

      //modales
      estadoModalSubirComprobantes:false,
      aea:[1],
    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalSubirComprobantes(){
        this.setState({
          estadoModalSubirComprobantes: !this.state.estadoModalSubirComprobantes,
                      tipoComprobante: 1
        })
  }

  subirVerificaciones(id,concepto){

    this.setState({
      idSubir:id,
      conceptoSubir:concepto,
    },this.cambiarModalSubirComprobantes())

  }


  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }

  fetchComprobantes(){
      fetch('http://107.23.50.10/verificaciones/mostrar',
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'estado' : '2',
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
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
  clean(){
      this.setState({
        estadoModalSubirComprobantes: false,
      },()=>this.fetchComprobantes())
    }
  sendComprobante(){
    fetch('http://107.23.50.10/verificaciones/enviarComprobante',
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
            id: this.state.idSubir,
            concepto : this.state.conceptoSubir,
            archivo : this.state.imgComprobante,
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
          cogoToast.success("Comprobante enviado");
          this.clean();
        }
        else{
          console.log(data)
          cogoToast.error("Error al enviar comprobante");
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  handleChangeFileImagen (e){
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
                    cogoToast.success("Imagen de tarjeta lista");
                    console.log(this.state.imgComprobante)
                  }
                );
              }
      }
  handleChangeFilePdf (e){
          var file = e.target.files[0];
          var fileData = new FileReader();
          if(file){
            fileData.readAsDataURL(file);
            }
          else{
            cogoToast.warn("Se quito el pdf");
          }
          fileData.onload = (event)=> {
              this.setState({imgComprobante: fileData.result},
                  ()=>{
                      cogoToast.success("Documento pdf listo");
                      console.log(this.state.imgComprobante)
                    }
                    );
                  }
          }
  componentDidMount(){
      this.fetchComprobantes();
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
                                    <th>Apellidos</th>
                                    <th>Total</th>
                                    <th>Concepto</th>
                                    <th>Descripcion</th>
                                    <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_comprobantes ?
                                    this.state.tb_comprobantes.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.usuario.nombres}</td>
                                                <td>{task.usuario.apellidos}</td>
                                                <td>{task.total}</td>
                                                <td>{task.concepto}</td>
                                                <td>{task.descripcion}</td>
                                                <td>pendiente Comprobante</td>
                                                <td>
                                                  <button className="btn btn-sm btn-info"  type="button" onClick={()=>this.subirVerificaciones(task.id,task.concepto)}>
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
                                        <select className="form-control" name="tipoComprobante" style={{width: '50%'}} onChange={this.handleChange} value={this.state.tipoComprobante}>
                                            <option key={1} value={1}>Subir imagen</option>
                                            <option key={2} value={2}>Subir pdf </option>
                                        </select>
                                      {
                                        (this.state.tipoComprobante==1)?
                                        this.state.aea.map((a)=>{
                                        return(
                                              <div key={a}>
                                                  <div>
                                                    <label>Subir comprobante:</label><br/>
                                                    <input type="file" className="form-control-file" name="imgComprobante" onChange={e =>this.handleChangeFileImagen(e)}/>
                                                  </div>
                                                  <div className="p-2">
                                                    <img src={this.state.imgComprobante} width="300" height="300"/>
                                                  </div>
                                                  <div className="p-2">
                                                    <button className="btn btn-primary" onClick={()=>this.sendComprobante()}>Subir comprobante</button>
                                                  </div>
                                              </div>
                                          )}):this.state.aea.map((a)=>{
                                          return(
                                                <div key={a}>
                                                    <label>Subir PDF:</label><br/>
                                                    <input type="file" className="form-control-file" name="imgComprobante" onChange={e =>this.handleChangeFilePdf(e)}/>
                                                    <div className="p-2">
                                                      <button className="btn btn-primary" onClick={()=>this.sendComprobante()}>Subir comprobante</button>
                                                    </div>
                                                </div>
                                          )})
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

export default IndexComprobantes;
