import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import Paginar from "../../paginate"

class IndexComprobantes extends Component {
  constructor(){
    super();
    this.state = {
      tb_comprobantes:[],
      var_texto_numeroPagina:1,
      buscarT:"nombres",
      valor:'',
      //modales
      estadoModalSubirComprobantes:false,
      aea:[1],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_comprobantes.data,"comprobantes");
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
    })
  }
  handleChangeBuscador(e){
    const value = e.target.value;
    this.setState({
      valor: value
    },()=>{
      this.fetchComprobantes(true,1);
    })
  }

  fetchComprobantes(boleano,numero){
      fetch(`${Config.api}verificaciones/mostrar?page=${numero}&columna=${this.state.buscarT}&buscar=${this.state.valor}`,
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'estado' : '2',
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
                tb_comprobantes: data['datos'],
                var_texto_numeroPagina:numero
              })
          }
      }).catch((error)=> {

    });
  }
  clean(){
      this.setState({
        estadoModalSubirComprobantes: false,
      },()=>this.fetchComprobantes(true,1))
    }
  sendComprobante(){
    cogoToast.loading('Cargando...',fetch(`${Config.api}verificaciones/enviarComprobante`,
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
            'Content-type' : 'application/json',
            'api_token': localStorage.getItem('token')

        }
      }
    ).then(res =>res.json())
     .then(data => {
          if(data.respuesta==true){
            this.clean();
          }
          else{
            cogoToast.error("Error al enviar comprobante");
          }
      }).catch((error)=> {
        cogoToast.error("Error al enviar comprobante");
    })
  ).then(() => {
        cogoToast.success('Comprobante enviado');
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
                    cogoToast.success("Imagen de comprobante lista");
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
                    }
                    );
                  }
          }
  componentDidMount(){
      this.fetchComprobantes(true,1);
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Comprobantes' isOption>
                        <h4 className="card-title">Buscar</h4>
                        <input type="text" onChange={this.handleChangeBuscador} />
                        <span className="p-5">

                            <select  name="buscarT" id="tipoProducto" style={{width: '15%'}} onChange={this.handleChange} value={this.state.buscarT}>
                                <option key={1} value={"nombres"}>Nombres</option>
                                <option key={2} value={"apellidos"}>Apellidos</option>
                                <option key={3} value={"correo"}>Correo</option>
                                <option key={4} value={"descripcion"}>Descripcion</option>
                                <option key={5} value={"nroTarjeta"}>Tarjeta</option>
                            </select>
                        </span>
                        <span className="p-5"><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></span>

                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Total</th>
                                    <th>Concepto</th>
                                    <th>Descripcion</th>
                                    <th>Tarjeta</th>
                                    <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_comprobantes.data ?
                                    this.state.tb_comprobantes.data.map((task,index) =>{
                                        return (
                                            <tr key={index}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.total}</td>
                                                <td>{task.concepto}</td>
                                                <td>{task.descripcion}</td>
                                                <td>{task.nroTarjeta}</td>
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
                        <div className="float-right">
                              <Pagination  >
                                <Pagination.Prev
                                    onClick={() => {
                                      this.fetchComprobantes(
                                        true,
                                        this.state.var_texto_numeroPagina-1,
                                    )
                                  }}
                                />
                                    {
                                        <Paginar data={this.state.tb_comprobantes} fetch={(bolean,numero)=>this.fetchComprobantes(bolean,numero)} ></Paginar>
                                    }
                                <Pagination.Next
                                    onClick={() => {
                                      this.fetchComprobantes(
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
