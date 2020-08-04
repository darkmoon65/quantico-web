import React, {Component} from 'react';
import {Row, Col, Form, Table, Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import { Redirect } from 'react-router-dom'
import Paginar from "../../paginate"

class IndexTiposPago extends Component {
  constructor(){
    super();
    this.state = {
      tb_tiposPago:[],
      nombreTipoProducto:'',
      //modales
      estadoModalCrearTiposPago  :false,
      redireccionarCrearTipoPago : false,
      txt_texto_numeroPagina :1,
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

  limpiarBoleanos(){
    let array = this.state.tb_tiposPago
    let newArray = []
    array.data.data.map((data)=>{
      let integracion       = data.integracion
      let esCuentaBancaria  = data.esCuentaBancaria
      let esDatoFinanciero  = data.esDatoFinanciero
      let oculto            = data.oculto
      // if (data.integracion == 1){
      //     integracion = "si"
      // }else{
      //     integracion= "no"
      // }
      // if (data.esCuentaBancaria ==1){
      //     esCuentaBancaria="si"
      // }else{
      //    esCuentaBancaria= "no"
      // }

      // if(data.esDatoFinanciero == 1){
      //   esDatoFinanciero = "si";
      // }else{
      //   esDatoFinanciero = "no";
      // }

      // if (data.oculto == 1){
      //    oculto="si"
      // }else{
      //   oculto="no"
      // }

      if(data.cuentasBancarias != null)
      {
        if(data.cuentasBancarias.titular != null)
        {
          data.cuentasBancarias.tieneTitular = true
        }else{
          data.cuentasBancarias.tieneTitular = false
        }
        if(data.cuentasBancarias.banco_id != null)
        {
          data.cuentasBancarias.tieneBanco = true
        }else{
          data.cuentasBancarias.tieneBanco = false
        }
        if(data.cuentasBancarias.cci != null)
        {
          data.cuentasBancarias.tieneCci = true
        }else{
          data.cuentasBancarias.tieneCci = false
        }
        if(data.cuentasBancarias.imagenQr != null)
        {
          data.cuentasBancarias.tieneImagenQr = true
        }else{
          data.cuentasBancarias.tieneImagenQr = false
        }
        if(data.cuentasBancarias.nroCuenta != null)
        {
          data.cuentasBancarias.tieneNroCuenta = true
        }else{
          data.cuentasBancarias.tieneNroCuenta = false
        }
        if(data.cuentasBancarias.nroDocumentoIdentidad != null)
        {
          data.cuentasBancarias.tieneDocumentoIdentidad = true
        }else{
          data.cuentasBancarias.tieneDocumentoIdentidad = false
        }
        if(data.cuentasBancarias.numero != null)
        {
          data.cuentasBancarias.tieneNumero = true
        }else{
          data.cuentasBancarias.tieneNumero = false
        }
        if(data.cuentasBancarias.telefono != null)
        {
          data.cuentasBancarias.tieneTelefono = true
        }else{
          data.cuentasBancarias.tieneTelefono = false
        }
        if(data.cuentasBancarias.tiposCuentasBancarias_id != null)
        {
          data.cuentasBancarias.tieneTiposCuentasBancarias = true
        }else{
          data.cuentasBancarias.tieneTiposCuentasBancarias = false
        }
        if(data.cuentasBancarias.tiposNumeros_id != null)
        {
          data.cuentasBancarias.tieneTiposNumero = true
        }else{
          data.cuentasBancarias.tieneTiposNumero = false
        }
        if(data.cuentasBancarias.tiposOperadores_id != null)
        {
          data.cuentasBancarias.tieneTiposOperador = true
        }else{
          data.cuentasBancarias.tieneTiposOperador = false
        }
        if(data.cuentasBancarias.tiposPago_id != null)
        {
          data.cuentasBancarias.tieneTiposPago = true
        }else{
          data.cuentasBancarias.tieneTiposPago = false
        }
        if(data.cuentasBancarias.tiposTarjetas_id != null)
        {
          data.cuentasBancarias.tieneTiposTarjeta = true
        }else{
          data.cuentasBancarias.tieneTiposTarjeta = false
        }
      }

      newArray.push({
        id                  : data.id,
        nombre              : data.nombre,
        integracion         : integracion,
        esCuentaBancaria    : esCuentaBancaria,
        esDatoFinanciero    : esDatoFinanciero,
        oculto              : oculto,
        imagen              : data.imagen,
        cuentasBancarias    : data.cuentasBancarias,
        membresia           : data.membresia,
        tiposProducto       : data.tiposProducto,
        tieneMembresias     : data.tieneMembresias,
        tieneTiposProductos : data.tieneTiposProductos
      })
    })
    this.state.tb_tiposPago.data.data = newArray;
    this.setState({
      tb_tiposPago: this.state.tb_tiposPago
    })
  }

  fetchTiposPago(bolean, numero)
  {
    fetch(`${Config.api}tiposPago/mostrar?page=`+numero,
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
          tb_tiposPago: data,
          txt_texto_numeroPagina : data.data.current_page
        },()=>{
          this.limpiarBoleanos()
        })
      }
      else
      {
        
      }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  
  }

  componentDidMount(){
    this.fetchTiposPago();
  }

  async editarTipoPago(task)
  {
    let respuesta = false;

    await fetch(`${Config.api}tiposPago/editar`,
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
      cogoToast.error("Hubo un error al editar el tipo de pago")
      respuesta = false
    });

    return respuesta;
  }

  renderRedireccionarCrearTipoPago = () => {
    if (this.state.redireccionarCrearTipoPago) {
        return <Redirect to='/tiposPago/crear' />
    }
  }

  render() {
      return (
          <Aux>
              {this.renderRedireccionarCrearTipoPago()}
              <Row>
                  <Col>
                      <Card title='Tipos de pago' isOption>
                        <Table id="tb_membresia" striped responsive>
                            <thead>
                                <tr>
                                    <th>
                                      <button 
                                        type="button" 
                                        className="btn btn-primary" 
                                        onClick={()=>this.setState({
                                          redireccionarCrearTipoPago : true
                                        })}>
                                          Crear Tipos de pago 
                                      </button> 
                                    </th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Integracion</th>
                                    <th>Cuenta bancaria</th>
                                    <th>Dato Financiero</th>
                                    <th>Oculto</th>
                                    <th>Campos</th>
                                    <th>Membresias</th>
                                    <th>Tipos de Producto</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {
                                    this.state.tb_tiposPago.data ?
                                    this.state.tb_tiposPago.data.data.map((task, posicion) =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<Form>
                                                        <Form.Group controlId="formNombre">
                                                            <Form.Control
                                                                type="nombreTipoPago" 
                                                                placeholder="" 
                                                                name="nombreTiposPago"
                                                                value = {task.nombre}
                                                                onChange = {(e) => {
                                                                  task.nombre = e.target.value
                                                                  this.setState({
                                                                    tb_tiposPago : this.state.tb_tiposPago
                                                                  })
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                    :task.nombre
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<Form>
                                                      <Form.Group controlId="formAvanzadoCheckOculto">
                                                          <Form.Check 
                                                              type     = "checkbox" 
                                                              label    = "¿Integración?"
                                                              name     = "integracion"
                                                              onChange = {(e) => {
                                                                if( task.integracion == 0 )
                                                                {
                                                                  task.integracion = 1
                                                                }else{
                                                                  task.integracion = 0
                                                                }
                                                                this.setState({
                                                                  tb_tiposPago : this.state.tb_tiposPago
                                                                })
                                                              }}
                                                              checked  = {
                                                                task.integracion == 0
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.integracion == 0
                                                      ?<p>No</p>
                                                      :<p>Si</p>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<Form>
                                                      <Form.Group controlId="formAvanzadoCheckOculto">
                                                          <Form.Check 
                                                              type     = "checkbox" 
                                                              label    = "¿Cuenta Bancaria?"
                                                              name     = "cuentaBancaria"
                                                              onChange = {(e) => {
                                                                if( task.esCuentaBancaria == 0 )
                                                                {
                                                                  task.esCuentaBancaria = 1
                                                                }else{
                                                                  task.esCuentaBancaria = 0
                                                                }
                                                                this.setState({
                                                                  tb_tiposPago : this.state.tb_tiposPago
                                                                })
                                                              }}
                                                              checked  = {
                                                                task.esCuentaBancaria == 0
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.esCuentaBancaria == 0
                                                      ?<p>No</p>
                                                      :<p>Si</p>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<Form>
                                                      <Form.Group controlId="formAvanzadoCheckOculto">
                                                          <Form.Check 
                                                              type     = "checkbox" 
                                                              label    = "¿Dato Financiero?"
                                                              name     = "datoFinanciero"
                                                              onChange = {(e) => {
                                                                if( task.esDatoFinanciero == 0 )
                                                                {
                                                                  task.esDatoFinanciero = 1
                                                                }else{
                                                                  task.esDatoFinanciero = 0
                                                                }
                                                                this.setState({
                                                                  tb_tiposPago : this.state.tb_tiposPago
                                                                })
                                                              }}
                                                              checked  = {
                                                                task.esDatoFinanciero == 0
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.esDatoFinanciero == 0
                                                      ?<p>No</p>
                                                      :<p>Si</p>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<Form>
                                                      <Form.Group controlId="formAvanzadoCheckOculto">
                                                          <Form.Check 
                                                              type     = "checkbox" 
                                                              label    = "¿Oculto?"
                                                              name     = "ocultoCrear"
                                                              onChange = {(e) => {
                                                                if( task.oculto == 0 )
                                                                {
                                                                  task.oculto = 1
                                                                }else{
                                                                  task.oculto = 0
                                                                }
                                                                this.setState({
                                                                  tb_tiposPago : this.state.tb_tiposPago
                                                                })
                                                              }}
                                                              checked  = {
                                                                task.oculto == 0
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.oculto == 0
                                                      ?<p>No</p>
                                                      :<p>Si</p>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.cuentasBancarias != null
                                                    ? task.editar == true
                                                      ?<div>
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "titular"
                                                            label = {"Titular"}
                                                            checked = {task.cuentasBancarias.tieneTitular}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneTitular == null)
                                                              {
                                                                task.cuentasBancarias.tieneTitular = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneTitular = !task.cuentasBancarias.tieneTitular
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "bancos"
                                                            label = {"Bancos"}
                                                            checked = {task.cuentasBancarias.tieneBanco}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneBanco == null)
                                                              {
                                                                task.cuentasBancarias.tieneBanco = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneBanco = !task.cuentasBancarias.tieneBanco
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "cci"
                                                            label = {"CCI"}
                                                            checked = {task.cuentasBancarias.tieneCci}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneCci == null)
                                                              {
                                                                task.cuentasBancarias.tieneCci = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneCci = !task.cuentasBancarias.tieneCci
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "qr"
                                                            label = {"QR"}
                                                            checked = {task.cuentasBancarias.tieneImagenQr}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneImagenQr == null)
                                                              {
                                                                task.cuentasBancarias.tieneImagenQr = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneImagenQr = !task.cuentasBancarias.tieneImagenQr
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "nCuenta"
                                                            label = {"N°Cuenta"}
                                                            checked = {task.cuentasBancarias.nroCuenta}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneNroCuenta == null)
                                                              {
                                                                task.cuentasBancarias.tieneNroCuenta = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneNroCuenta = !task.cuentasBancarias.tieneNroCuenta
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "nDocumentoIdentidad"
                                                            label = {"DNI"}
                                                            checked = {task.cuentasBancarias.tieneDocumentoIdentidad}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneDocumentoIdentidad == null)
                                                              {
                                                                task.cuentasBancarias.tieneDocumentoIdentidad = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneDocumentoIdentidad = !task.cuentasBancarias.tieneDocumentoIdentidad
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "numero"
                                                            label = {"Numero"}
                                                            checked = {task.cuentasBancarias.tieneNumero}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneNumero == null)
                                                              {
                                                                task.cuentasBancarias.tieneNumero = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneNumero = !task.cuentasBancarias.tieneNumero
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "telefono"
                                                            label = {"Télefono"}
                                                            checked = {task.cuentasBancarias.tieneTelefono}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneTelefono == null)
                                                              {
                                                                task.cuentasBancarias.tieneTelefono = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneTelefono = !task.cuentasBancarias.tieneTelefono
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "tiposCuentaBancaria"
                                                            label = {"Tipos Cuenta Bancaria"}
                                                            checked = {task.cuentasBancarias.tieneTiposCuentasBancarias}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneTiposCuentasBancarias == null)
                                                              {
                                                                task.cuentasBancarias.tieneTiposCuentasBancarias = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneTiposCuentasBancarias = !task.cuentasBancarias.tieneTiposCuentasBancarias
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "tiposNumero"
                                                            label = {"Tipos de Número"}
                                                            checked = {task.cuentasBancarias.tieneTiposNumero}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneTiposNumero == null)
                                                              {
                                                                task.cuentasBancarias.tieneTiposNumero = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneTiposNumero = !task.cuentasBancarias.tieneTiposNumero
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "tiposOperador"
                                                            label = {"Tipos de Operador"}
                                                            checked = {task.cuentasBancarias.tieneTiposOperador}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneTiposOperador == null)
                                                              {
                                                                task.cuentasBancarias.tieneTiposOperador = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneTiposOperador = !task.cuentasBancarias.tieneTiposOperador
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "tiposPago"
                                                            label = {"Tipos de Pago"}
                                                            checked = {true}
                                                          />
                                                        }
                                                        {
                                                          <Form.Check 
                                                            type  = "checkbox" 
                                                            name  = "tiposTarjeta"
                                                            label = {"Tipos de Tarjeta"}
                                                            checked = {task.cuentasBancarias.tieneTiposTarjeta}
                                                            onChange = {(e) => {
                                                              if(task.cuentasBancarias.tieneTiposTarjeta == null)
                                                              {
                                                                task.cuentasBancarias.tieneTiposTarjeta = true
                                                              }else
                                                              {
                                                                task.cuentasBancarias.tieneTiposTarjeta = !task.cuentasBancarias.tieneTiposTarjeta
                                                              }
                                                              this.setState({
                                                                tb_tiposPago : this.state.tb_tiposPago
                                                              })
                                                            }}
                                                          />
                                                        }
                                                      </div>
                                                      :<div>
                                                        {
                                                          task.cuentasBancarias.titular != null
                                                          ?<p>TITULAR<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.banco_id != null
                                                          ?<p>BANCOS<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.cci != null
                                                          ?<p>CCI<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.imagenQr != null
                                                          ?<p>QR<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.nroCuenta != null
                                                          ?<p>N°CUENTA<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.nroDocumentoIdentidad != null
                                                          ?<p>N°DOCUMENTO IDENTIDAD<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.numero != null
                                                          ?<p>NÚMERO<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.telefono != null
                                                          ?<p>TELÉFONO<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposCuentasBancarias_id != null
                                                          ?<p>TIPOS DE CUENTAS<br/>BANCARIAS<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposNumeros_id != null
                                                          ?<p>TIPOS DE NÚMERO<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposOperadores_id != null
                                                          ?<p>TIPOS DE OPERADOR<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposPago_id != null
                                                          ?<p>TIPOS DE PAGO<br/></p> 
                                                          :null
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposTarjetas_id != null
                                                          ?<p>TIPOS DE TARJETA<br/></p> 
                                                          :null
                                                        }
                                                      </div>
                                                    :<p>No tiene<br/>campos asignados</p>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<Form>
                                                        <Form.Group controlId="formMembresias">
                                                            {
                                                                task.membresia
                                                                ?task.membresia.map((tasks,posicion) => {
                                                                    return (
                                                                        <Form.Check
                                                                            key      = {posicion}
                                                                            name     = {posicion} 
                                                                            onChange = {(e) => {
                                                                              tasks.seleccionado = !tasks.seleccionado
                                                                              this.setState({
                                                                                tb_tiposPago : this.state.tb_tiposPago
                                                                              })
                                                                            }}
                                                                            type     = "checkbox" 
                                                                            checked  = {tasks.seleccionado}
                                                                            label    = {tasks.nombre}
                                                                        />
                                                                    );
                                                                })
                                                                :null
                                                            }
                                                        </Form.Group>
                                                    </Form>
                                                    :task.tieneMembresias == true
                                                      ?task.membresia
                                                        ?task.membresia.map(tasks =>{
                                                          return (
                                                            tasks.seleccionado == true
                                                            ?<div>
                                                              {
                                                                tasks.nombre
                                                              }<br/>
                                                            </div>
                                                            :null
                                                            
                                                          );
                                                        })
                                                        :<p>Sin membresias<br/>asignadas</p>
                                                      :<p>Sin membresias<br/>asignadas</p>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<Form>
                                                        <Form.Group controlId="formTiposProducto">
                                                            {
                                                                task.tiposProducto
                                                                ?task.tiposProducto.map((tasks,posicion) => {
                                                                    return (
                                                                        <Form.Check
                                                                            key      = {posicion}
                                                                            name     = {posicion} 
                                                                            onChange = {(e) => {
                                                                              tasks.seleccionado = !tasks.seleccionado
                                                                              this.setState({
                                                                                tb_tiposPago : this.state.tb_tiposPago
                                                                              })
                                                                            }}
                                                                            type     = "checkbox" 
                                                                            checked  = {tasks.seleccionado}
                                                                            label    = {tasks.nombre}
                                                                        />
                                                                    );
                                                                })
                                                                :null
                                                            }
                                                        </Form.Group>
                                                    </Form>
                                                    :task.tieneTiposProductos == true
                                                      ?task.tiposProducto
                                                        ?task.tiposProducto.map(taskTipoProducto =>{
                                                          return (
                                                            taskTipoProducto.seleccionado == true
                                                            ?<div>
                                                              {
                                                                taskTipoProducto.nombre
                                                              }<br/>
                                                            </div>
                                                            :null
                                                          );
                                                        })
                                                        :<p>Sin tipos<br/>de producto<br/>asignadas</p>
                                                      :<p>Sin tipos<br/>de producto<br/>asignadas</p>
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.editar == true
                                                    ?<button 
                                                      className="btn btn-sm btn-warning"  
                                                      type="button" 
                                                      onClick={async () => { 
                                                        await this.editarTipoPago(task);
                                                        this.fetchTiposPago(true, this.state.txt_texto_numeroPagina );
                                                      }}
                                                    >
                                                      <i className="fa fa-save" ></i>
                                                    </button>
                                                    :<button 
                                                      className="btn btn-sm btn-primary"  
                                                      type="button" 
                                                      onClick={() => {
                                                        this.state.tb_tiposPago.data.data[posicion]['editar'] = true;
                                                        this.setState({
                                                          tb_tiposPago : this.state.tb_tiposPago
                                                        })
                                                      }}
                                                    >
                                                      <i className="fa fa-pencil" ></i>
                                                    </button>
                                                  }
                                                  {
                                                    task.editar == true
                                                    ?<button 
                                                      className="btn btn-sm btn-danger"  
                                                      type="button" 
                                                      onClick={()=>{
                                                        this.fetchTiposPago(true, this.state.txt_texto_numeroPagina );
                                                      }}
                                                    >
                                                      <i className="fa fa-ban" ></i>
                                                    </button>
                                                    :<button 
                                                      className="btn btn-sm btn-danger"  
                                                      type="button" onClick={()=>this.enviarEliminarTiposPago(task.id)}>
                                                      <i className="fa fa-trash" ></i>
                                                    </button>
                                                  }
                                                </td>
                                            </tr>
                                        );
                                    } )   : null
                                }
                            </tbody>
                        </Table>
                        <Pagination>
                            <Pagination.Prev 
                              onClick={() => this.fetchTiposPago(
                                true,
                                parseInt(this.state.txt_texto_numeroPagina)-1,
                              )}
                            />
                            {
                              this.state.tb_tiposPago.data
                              ?<Paginar 
                                data  = { this.state.tb_tiposPago.data} 
                                fetch = { (bolean,numero)=>this.fetchTiposPago(bolean,numero)} >
                              </Paginar>
                              :null
                            }
                            <Pagination.Next
                              onClick={() => this.fetchTiposPago(
                                true,
                                parseInt(this.state.txt_texto_numeroPagina)+1,
                              )}
                            />
                        </Pagination>
                      </Card>
                  </Col>
              </Row>
          </Aux>
      );
  }
}

export default IndexTiposPago;
