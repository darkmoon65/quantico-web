import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import Paginar from "../../paginate"

class IndexCompletos extends Component {
  constructor(){
    super();
    this.state = {
      tb_completos:[],
      buscarT:"nombres",
      valor:'',
      var_texto_numeroPagina:1,
      //modales
      estadoModalVerVerCompletos:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador = this.handleChangeBuscador.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_completos,"completos");
  }

  cambiarModalVerCompletos(){
        this.setState({
          estadoModalVerVerCompletos: !this.state.estadoModalVerVerCompletos
        })
  }
  clean(){
      this.setState({
        estadoModalVerVerCompletos: false,
      },()=>this.fetchCompletos(true,1))
    }
  verResultado(id,concepto){
    this.setState({
      idSubir:id,
      conceptoSubir:concepto
    },()=>this.fetchCompletosDetalle(id,concepto))

  }
  verDetalle(concepto){
    let mostrar
    if(concepto=="Membresia Gratuita"){
      mostrar = false
    }else{
      mostrar = true
    }

    this.setState({
      nombresVer:this.state.tb_detalles.nombres,
      apellidosVer:this.state.tb_detalles.apellidos,
      generoVer:this.state.tb_detalles.genero,
      celularVer:this.state.tb_detalles.celular,
      correoVer:this.state.tb_detalles.correo,
      nombreMVer:this.state.tb_detalles.membresia,
      totalVer:this.state.tb_detalles.total,

      paisVer:this.state.tb_detalles.pais,
      fechaNacimientoVer:this.state.tb_detalles.fechaNacimiento,
      direccionVer:this.state.tb_detalles.direccion,
      documentoIdentidadVer:this.state.tb_detalles.documentoIdentidad,
      interesesVer:this.state.tb_detalles.intereses,
      telefonosVer:this.state.tb_detalles.telefonos,

      mostrarImg: mostrar,
      tipoComprobanteVer: this.state.tb_detalles.tipoComprobanteCompra,
      imagenesUsuarioVer: this.state.tb_detalles.imagenesUsuario,
      imagenComprobanteCompraVer:this.state.tb_detalles.comprobanteCompra,
      comprobantesPagoVer:this.state.tb_detalles.comprobantesPago
    },()=>this.cambiarModalVerCompletos())
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
      this.fetchCompletos(true,1);
    })
  }

  fetchCompletosDetalle(id,concepto){
      fetch(`${Config.api}verificaciones/detalles?concepto=${concepto}&id=${id}`,
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
              tb_detalles: data['datos']
            },()=>{
              this.verDetalle(concepto)
            })
          }
      }).catch((error)=> {

    });
  }

  fetchCompletos(boleano,numero){
      fetch(`${Config.api}verificaciones/mostrar?page=${numero}&columna=${this.state.buscarT}&buscar=${this.state.valor}`,
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
              tb_completos: data['datos'],
              var_texto_numeroPagina: numero
            })
          }
      }).catch((error)=> {

    });
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
  componentDidMount(){
      this.fetchCompletos(true,1);
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Completos' isOption>
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
                                    this.state.tb_completos.data ?
                                    this.state.tb_completos.data.map((task,index) =>{
                                        return (
                                            <tr key={index}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.total}</td>
                                                <td>{task.concepto}</td>
                                                <td>{task.descripcion}</td>
                                                <td>{task.nroTarjeta}</td>
                                                <td>Completo</td>
                                                <td>
                                                  <button className="btn btn-sm btn-info"  type="button" onClick={()=>this.verResultado(task.id,task.concepto)}>
                                                    <i className="fa fa-eye" ></i>
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
                                      this.fetchCompletos(
                                        true,
                                        this.state.var_texto_numeroPagina-1,
                                    )
                                  }}
                                />
                                    {
                                        <Paginar data={this.state.tb_completos} fetch={(bolean,numero)=>this.fetchCompletos(bolean,numero)} ></Paginar>
                                    }
                                <Pagination.Next
                                    onClick={() => {
                                      this.fetchCompletos(
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
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-6" >
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Nombres:</label><br/>
                                                    <h5>{this.state.nombresVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Apellidos:</label><br/>
                                                    <h5>{this.state.apellidosVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Genero:</label><br/>
                                                    <h5>{this.state.generoVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Pais:</label><br/>
                                                    <h5>{this.state.paisVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Celular:</label><br/>
                                                    <h5>{this.state.celularVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Correo:</label><br/>
                                                    <h5>{this.state.correoVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Nombre de Membresia:</label><br/>
                                                    <h5>{this.state.nombreMVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Total:</label><br/>
                                                    <h5>{this.state.totalVer}</h5>
                                                  </div>
                                            </div>
                                            <div className="col-6" >
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Fecha de nacimiento:</label><br/>
                                                    <h5>{this.state.fechaNacimientoVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Direccion:</label><br/>
                                                    <h5>{this.state.direccionVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Documento de identidad:</label><br/>
                                                    <h5>{this.state.documentoIdentidadVer}</h5>
                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Intereses:</label><br/>
                                                    {
                                                      this.state.interesesVer?
                                                      this.state.interesesVer.map((data,index)=>{
                                                        return(
                                                          <h6 key={index} className="p-1">
                                                            * {data}
                                                          </h6>
                                                        )
                                                      }):null
                                                    }

                                                  </div>
                                                  <div className="p-1">
                                                    <label style={{color:'#062563'}}>Telefonos:</label><br/>
                                                    {
                                                      this.state.telefonosVer?
                                                      this.state.telefonosVer.map((data,index)=>{
                                                        return(
                                                          <div key={index} className="p-1">
                                                            <label>{data.nombre}</label><br/>
                                                            <h5>{data.numero}</h5>
                                                          </div>
                                                        )
                                                      }):null
                                                    }
                                                  </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {
                                              this.state.imagenesUsuarioVer?
                                              this.state.imagenesUsuarioVer.map((data,index)=>{
                                                return(
                                                  <div key={index} className="p-3">
                                                    <label>{data.dato}:</label><br/>
                                                    <img src={data.imagen} width="300" height="300" />
                                                  </div>
                                                )
                                              })
                                              :null
                                            }

                                        </div>
                                        <div className="row">
                                            {
                                              this.state.comprobantesPagoVer?
                                              this.state.comprobantesPagoVer.map((data,index)=>{
                                                return(
                                                  <div key={index} className="p-3">
                                                    <label>comprobante {index+1}:</label><br/>
                                                    <img src={data} width="300" height="300" />
                                                  </div>
                                                )
                                              })
                                              :null
                                            }

                                        </div>
                                        <div>
                                            {
                                              this.state.mostrarImg?
                                              <div>
                                                <label style={{color:'#062563'}}>Comprobante de la compra(Administrador):</label><br/>
                                                {
                                                  this.state.tipoComprobanteVer=="pdf"?
                                                    <form action={this.state.imagenComprobanteCompraVer} target="_blank">
                                                      <input type="submit" value="Ver comprobante" />
                                                    </form>
                                                  :
                                                    <img src={this.state.imagenComprobanteCompraVer} width="300" height="300" />
                                                }


                                                <div className="p-2">
                                                    <div>
                                                      <label>Subir comprobante:</label><br/>
                                                      <input type="file" className="form-control-file" accept="application/pdf , image/png" name="imgComprobante" onChange={e =>this.handleChangeFileImagen(e)}/>
                                                    </div>
                                                    <div className="p-2">
                                                      <button className="btn btn-primary" onClick={()=>this.sendComprobante()}>Guardar</button>
                                                    </div>
                                                </div>
                                              </div>
                                              :null
                                            }
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
