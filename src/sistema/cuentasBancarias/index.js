import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import FormTiposCuentaBancaria from './componentes/formTiposCuentaBancaria'
import FormTiposNumero from './componentes/formTiposNumero'
import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import NuevaCuentaBancaria from './nuevaCuentaBancaria'
import FormNumeroDocumentoIdentidad from './componentes/formNumeroDni'
import FormNumeroTelefono from './componentes/formNumeroTelefono'
import FormNumero from './componentes/formNumero'
import FormCci from './componentes/formCci'
import FormNumeroCuenta from './componentes/formNumeroCuenta'
import FormTiposOperador from './componentes/formTiposOperador'
import FormTiposTarjeta from './componentes/formTiposTarjeta'
import FormTitular from './componentes/formTitular'
import FormBancos from './componentes/formBancos'

class IndexCuentas extends Component {
  constructor(){
    super();
    this.state = {
      idTipoPagoSeleccionado    : 0,
      tb_cuentasBancarias       : [],
      tb_bancos                 : [],
      tb_tiposPagoLista         : [],
      tb_cuentasBancariasAdmin  : [{}],
      tb_camposCuentaBancaria   : null,

      //modales
      estadoModalCrearCuentaBancaria:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.fetchTiposPagosLista = this.fetchTiposPagosLista.bind(this);
    this.cambiarModalCrearCuentaBancaria = this.cambiarModalCrearCuentaBancaria.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_cuentasBancarias.datos,"cuentas-Bancarias");
  }
  cambiarModalCrearCuentaBancaria(){
    this.setState({
      estadoModalCrearCuentaBancaria: !this.state.estadoModalCrearCuentaBancaria
    })
  }

  clean(){
    this.setState({
      estadoModalCrearCuentaBancaria: false,
      banco: '',
      titular:'',
      cuenta:'' ,
      cci: ''
    },()=>this.fetchCuentasBancarias())
  }

  handleChange(e){
    const {name, value} = e.target;
    if(name == "selecTipoPago")
    {
      this.fetchCuentasBancariasAdmin(value)
    }else if(name == "selectTipoPagoNuevo")
    {
      this.fetchCamposCuentaBancaria(value)
    }
    
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
    
  }

  crearCuentaBancaria(){
    fetch(`${Config.api}cuentaBancaria/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              banco: this.state.bancoCrearId,
              titular: this.state.titularCrear,
              cuenta: this.state.cuentaCrear,
              cci: this.state.cciCrear
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
        cogoToast.success("Cuenta bancaria creada");
        this.clean();
      }
      else{
        cogoToast.error("Error al crear la cuenta bancaria")
        console.log("hubo un error con la peticion")
      }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la cuenta bancaria")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }

  eliminarCuentaBancaria(id){
    fetch(`${Config.api}cuentaBancaria/eliminar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id:id
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
        cogoToast.success("Cuenta bancaria eliminada");
        this.clean();
      }
      else{
        cogoToast.error("Error al crear la cuenta bancaria")
        console.log("hubo un error con la peticion")
      }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la cuenta bancaria")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }

  fetchCuentasBancarias(){
      fetch(`${Config.api}cuentaBancaria/mostrar`,
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
              tb_cuentasBancarias: data
            },()=>{console.log(this.state.tb_cuentasBancarias)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }

  fetchBancos(){
    fetch(`${Config.api}banco/mostrar`,
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
          tb_bancos: data
        },()=>{console.log(this.state.tb_bancos)})
      }
      else{
        console.log(data)
        console.log("hubo un error con la peticion")
      }
    }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  
  }

  fetchTiposPagosLista(){
    fetch(`${Config.api}tiposPago/mostrar/lista`,
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
      if(data.respuesta == true){
        this.setState({
          tb_tiposPagoLista: data.datos
        })
        this.fetchCuentasBancariasAdmin(data.datos[0]['id'])
      }
      else{

      }
    }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }

  fetchCuentasBancariasAdmin(idTipoPago){
    this.setState({
      idTipoPagoSeleccionado : idTipoPago
    })
    fetch(`${Config.api}mostrar/cuentasBancariasAdmin/`+idTipoPago,
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
      if(data.respuesta == true){
        this.setState({
          tb_cuentasBancariasAdmin: data.data
        })
      }
      else{
        this.setState({
          tb_cuentasBancariasAdmin: [{}]
        })
      }
    }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }

  componentDidMount(){
    this.fetchTiposPagosLista();
    this.fetchCuentasBancarias();
  }

  async editarCuentaBancaria(task)
  {
    let respuesta = false;

    await fetch(`${Config.api}editar/cuentasBancariasAdmin`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Accept' : 'application/json',
          'Content-type' : 'application/json',
          'api_token': localStorage.getItem('token')
        }
      }
    )
    .then(res =>res.json())
    .then(data => {
      respuesta = data.respuesta
      if(data.respuesta==true){
        cogoToast.success(data.mensaje);
      }
      else
      {
        cogoToast.error(data.mensaje)
      }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al editar la cuenta bancaria")
      respuesta = false
    });

    return respuesta;
  }

  

  render() {
      return (
          <Aux>
              <Row>
                  <Col>
                      <Card title='Datos Financieros' isOption>
                        <Col md={6}>
                          <Form.Group controlId="button.crear">
                            <button 
                              type="button" 
                              className="btn btn-primary" 
                              onClick={()=>this.cambiarModalCrearCuentaBancaria()}>
                                Crear Dato Financiero
                            </button>
                            <button 
                              className="btn btn-sm btn-success" 
                              type="button" 
                              onClick={()=>this.descargarExcel()}>
                                Descargar excel
                            </button>
                          </Form.Group>
                          <Form.Group controlId="select.filtros">
                            <Form.Label> Seleccionar tipo de pago </Form.Label>
                            <Form.Control as="select" onChange={this.handleChange} name="selecTipoPago" >
                              {
                                this.state.tb_tiposPagoLista
                                ?this.state.tb_tiposPagoLista.map((task, posicion) => {
                                  return (
                                    <option value={task.id} key={task.id}  > {task.nombre} </option>
                                  );
                                })
                                :null
                              }
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Table id="tb_cuentasBancarias" striped responsive>
                          <thead>
                            {
                              this.state.tb_cuentasBancariasAdmin
                              ?<tr>
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['nombreTipoPago'] == null
                                  ?null
                                  :<th>Nombre Tipo Pago</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['titular']  == null
                                  ?null
                                  :<th>Titular</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['titular']  == null
                                  ?null
                                  :<th>Banco</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['imagenQr']  == null
                                  ?null
                                  :<th>ImagenQr</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['nombreTipoCuentaBancaria'] == null
                                  ?null
                                  :<th>Tipo Cuenta Bancaria</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['nombreTipoNumero'] == null
                                  ?null
                                  :<th>Tipo de Número</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['nombreTipoTarjeta']  == null
                                  ?null
                                  :<th>Tipo de Tarjeta</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['nombreTipoOperador'] == null
                                  ?null
                                  :<th>Tipo de Operador</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['nroCuenta']  == null
                                  ?null
                                  :<th>Nro de Cuenta</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['cci']  == null
                                  ?null
                                  :<th>CCI</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['idBanco']  == null
                                  ?null
                                  :<th>Banco</th> 
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['numero'] == null
                                  ?null
                                  :<th>Número</th>
                                }
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['telefono'] == null
                                  ?null
                                  :<th>Télefono</th>
                                }
                                {/* {
                                  this.state.tb_cuentasBancariasAdmin[0]['imagenQr'] == null
                                  ?null
                                  :<th></th>
                                } */}
                                {
                                  this.state.tb_cuentasBancariasAdmin[0]['nroDocumentoIdentidad']  == null
                                  ?null
                                  :<th>Nro Documento Identidad</th>
                                }
                              </tr>
                            :null
                            }
                            </thead>
                            <tbody>
                                {
                                  this.state.tb_cuentasBancariasAdmin 
                                  ?this.state.tb_cuentasBancariasAdmin.map((task, posicion) =>{
                                    return (
                                      task.editar == true
                                      ?<tr key={task.id}>
                                        {
                                          task.nombreTipoPago == null
                                          ?null
                                          :<td>{task.nombreTipoPago}</td>
                                        }
                                        {
                                          task.titular == null
                                          ?null
                                          :<td>
                                            <FormTitular
                                              titular = {task.titular}
                                              handleChange = {(e) => {
                                                task.titular = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />

                                          </td>
                                        }
                                        {
                                          task.idBanco == null
                                          ?null
                                          :<td>
                                            <FormBancos
                                              idBancosSeleccionado = {task.idBanco}
                                              handleChange = {(e) => {
                                                task.idBanco = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />

                                          </td>
                                        }
                                        {
                                          task.imagenQr == null
                                          ?null
                                          :<td>
                                            <Form.Group controlId="formulario.imagenQrEditar">
                                              <input type="file" />
                                            </Form.Group>
                                          </td>
                                        }
                                        {
                                          task.nombreTipoCuentaBancaria == null
                                          ?null
                                          :<td>
                                            <FormTiposCuentaBancaria
                                              idTipoCuentaBancariaSeleccionado = {task.idTipoCuentaBancaria}
                                              handleChange = {(e) => {
                                                task.idTipoCuentaBancaria = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        {
                                          task.nombreTipoNumero == null
                                          ?null
                                          :<td>
                                            <FormTiposNumero
                                              idTipoNumeroSeleccionado = {task.idTipoNumero}
                                              handleChange = {(e) => {
                                                task.idTipoNumero = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        {
                                          task.nombreTipoTarjeta == null
                                          ?null
                                          :<td>
                                            <FormTiposTarjeta
                                              idTipoTarjetaSeleccionado = {task.idTipoTarjeta}
                                              handleChange = {(e) => {
                                                task.idTipoTarjeta = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        {
                                          task.nombreTipoOperador == null
                                          ?null
                                          :<td>
                                            <FormTiposOperador
                                              idTipoOperadorSeleccionado = {task.idTipoOperador}
                                              handleChange = {(e) => {
                                                task.idTipoOperador = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        {
                                          task.nroCuenta == null
                                          ?null
                                          :<td>
                                            <FormNumeroCuenta
                                              nroCuenta = {task.nroCuenta}
                                              handleChange = {(e) => {
                                                task.nroCuenta = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        {
                                          task.cci == null
                                          ?null
                                          :<td>
                                            <FormCci
                                              cci = {task.cci}
                                              handleChange = {(e) => {
                                                task.cci = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        {/* {
                                          task.nombreBanco == null
                                          ?null
                                          :<td>
                                            { task.nombreBanco}
                                          </td>
                                        } */}
                                        {
                                          task.numero == null
                                          ?null
                                          :<td>
                                            <FormNumero
                                              numero = {task.numero}
                                              handleChange = {(e) => {
                                                task.numero = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        {
                                          task.telefono == null
                                          ?null
                                          :<td>
                                            <FormNumeroTelefono
                                              telefono = {task.telefono}
                                              handleChange = {(e) => {
                                                task.telefono = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            /> 
                                          </td>
                                        }
                                        {
                                          task.nroDocumentoIdentidad == null
                                          ?null
                                          :<td>
                                            <FormNumeroDocumentoIdentidad
                                              nroDocumentoIdentidad = {task.nroDocumentoIdentidad}
                                              handleChange = {(e) => {
                                                task.nroDocumentoIdentidad = e.target.value
                                                this.setState({
                                                  tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                                })
                                              }}
                                            />
                                          </td>
                                        }
                                        <td>
                                          <button
                                            className="btn btn-sm btn-warning"
                                            type="button" 
                                            onClick={async() => {
                                              await this.editarCuentaBancaria(task);
                                              this.fetchCuentasBancariasAdmin(this.state.idTipoPagoSeleccionado)
                                            }}
                                          >
                                            <i className="fa fa-save" ></i>
                                          </button>
                                          <button 
                                              className="btn btn-sm btn-danger"  
                                              type="button" 
                                              onClick={()=> {
                                                this.fetchCuentasBancariasAdmin(this.state.idTipoPagoSeleccionado)
                                              }}
                                            >
                                              <i className="fa fa-ban" ></i>
                                            </button>
                                        </td>
                                      </tr>
                                      :<tr key={task.id}>
                                        {
                                          task.nombreTipoPago == null
                                          ?null
                                          :<td>{task.nombreTipoPago}</td>
                                        }
                                        {
                                          task.titular == null
                                          ?null
                                          :<td>{task.titular}</td>
                                        }
                                        {
                                          task.idBanco == null
                                          ?null
                                          :<td>{task.nombreBanco}</td>
                                        }
                                        {
                                          task.imagenQr == null
                                          ?null
                                          :<td>
                                            <img className="rounded-circle" style={{width: '100px'}} src={task.imagenQr} alt="activity-user"/>
                                          </td>
                                        }
                                        {
                                          task.nombreTipoCuentaBancaria == null
                                          ?null
                                          :<td>{task.nombreTipoCuentaBancaria}</td>
                                        }
                                        {
                                          task.nombreTipoNumero == null
                                          ?null
                                          :<td>{task.nombreTipoNumero}</td>
                                        }
                                        {
                                          task.nombreTipoTarjeta == null
                                          ?null
                                          :<td>{task.nombreTipoTarjeta}</td>
                                        }
                                        {
                                          task.nombreTipoOperador == null
                                          ?null
                                          :<td>{task.nombreTipoOperador}</td>
                                        }
                                        {
                                          task.nroCuenta == null
                                          ?null
                                          :<td>{task.nroCuenta}</td>
                                        }
                                        {
                                          task.cci == null
                                          ?null
                                          :<td> {task.cci}</td>
                                        }
                                        {/* {
                                          task.nombreBanco == null
                                          ?null
                                          :<td> { task.nombreBanco}</td>
                                        } */}
                                        {
                                          task.numero == null
                                          ?null
                                          :<td> {task.numero} </td>
                                        }
                                        {
                                          task.telefono == null
                                          ?null
                                          :<td> {task.telefono} </td>
                                        }
                                        {
                                          task.nroDocumentoIdentidad == null
                                          ?null
                                          :<td>{task.nroDocumentoIdentidad}</td>
                                        }
                                        <td>
                                          <button 
                                            className="btn btn-sm btn-primary" 
                                            type="button"
                                            onClick={()=> {
                                              this.state.tb_cuentasBancariasAdmin[posicion]['editar'] = true;
                                              this.setState({
                                                tb_cuentasBancariasAdmin : this.state.tb_cuentasBancariasAdmin
                                              })
                                            }}
                                          >
                                            <i className="fa fa-edit" ></i>
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                  : null
                              }

                          </tbody>
                        </Table>
                      </Card>
                  </Col>
              </Row>
              <Modal
                size="lg"
                show={this.state.estadoModalCrearCuentaBancaria}
                onHide={() => this.cambiarModalCrearCuentaBancaria()}
                >
                <Modal.Header closeButton>
                  <Modal.Title id="example-custom-modal-styling-title">
                    Crear Cuenta bancaria
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <NuevaCuentaBancaria
                    cambiarModalCrearCuentaBancaria = {()=>this.cambiarModalCrearCuentaBancaria()}
                  />
                </Modal.Body>
              </Modal>
          </Aux>
      );
  }
}

export default IndexCuentas;
