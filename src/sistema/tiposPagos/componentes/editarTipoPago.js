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
          cogoToast.error("No se creo,verifique los datos")
        }
    }).catch((error)=> {
      cogoToast.error("No se creo el tipo de producto")
    });
  }

  limpiarBoleanos(){
    let array = this.state.tb_tiposPago
    let newArray = []
    array.data.data.map((data)=>{
      let integracion
      let esCuentaBancaria
      let esDatoFinanciero
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

      if(data.esDatoFinanciero == 1){
        esDatoFinanciero = "si";
      }else{
        esDatoFinanciero = "no";
      }

      if (data.oculto == 1){
         oculto="si"
      }else{
        oculto="no"
      }

      if(data.cuentasBancarias != null)
      {
        if(data.cuentasBancarias.titular != null)
        {
          data.cuentasBancarias.tieneTitular = true
        }
        if(data.cuentasBancarias.banco_id != null)
        {
          data.cuentasBancarias.tieneBanco = true
        }
        if(data.cuentasBancarias.cci != null)
        {
          data.cuentasBancarias.tieneCci = true
        }
        if(data.cuentasBancarias.imagenQr != null)
        {
          data.cuentasBancarias.tieneImagenQr = true
        }
        if(data.cuentasBancarias.nroCuenta != null)
        {
          data.cuentasBancarias.tieneNroCuenta = true
        }
        if(data.cuentasBancarias.nroDocumentoIdentidad != null)
        {
          data.cuentasBancarias.tieneDocumentoIdentidad = true
        }
        if(data.cuentasBancarias.numero != null)
        {
          data.cuentasBancarias.tieneNumero = true
        }
        if(data.cuentasBancarias.telefono != null)
        {
          data.cuentasBancarias.tieneTelefono = true
        }
        if(data.cuentasBancarias.tiposCuentasBancarias_id != null)
        {
          data.cuentasBancarias.tieneTiposCuentasBancarias = true
        }
        if(data.cuentasBancarias.tiposNumeros_id != null)
        {
          data.cuentasBancarias.tieneTiposNumero = true
        }
        if(data.cuentasBancarias.tiposOperadores_id != null)
        {
          data.cuentasBancarias.tieneTiposOperador = true
        }
        if(data.cuentasBancarias.tiposPago_id != null)
        {
          data.cuentasBancarias.tieneTiposPago = true
        }
        if(data.cuentasBancarias.tiposTarjetas_id != null)
        {
          data.cuentasBancarias.tieneTiposTarjeta = true
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
      
    }).catch((error)=> {

    });
  }

  componentDidMount(){
    this.fetchTiposPago();
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
                                                                onChange={this.handleChange}
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
                                                              onChange = {this.handleChange}
                                                              checked  = {
                                                                task.integracion == 'no'
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.integracion
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
                                                              onChange = {this.handleChange}
                                                              checked  = {
                                                                task.esCuentaBancaria == 'no'
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.esCuentaBancaria
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
                                                              onChange = {this.handleChange}
                                                              checked  = {
                                                                task.esDatoFinanciero == 'no'
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.esDatoFinanciero
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
                                                              onChange = {this.handleChange}
                                                              checked  = {
                                                                task.oculto == 'no'
                                                                ?false
                                                                :true
                                                              }
                                                          />
                                                      </Form.Group>
                                                    </Form>
                                                    :task.oculto
                                                  }
                                                </td>
                                                <td>
                                                  {
                                                    task.cuentasBancarias != null
                                                    ? task.editar == true
                                                      ?<div>
                                                        {
                                                          task.cuentasBancarias.titular != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "titular"
                                                            label = {"Titular"}
                                                            checked = {task.cuentasBancarias.tieneTitular}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "titular"
                                                            label = {"Titular"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.banco_id != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "bancos"
                                                            label = {"Bancos"}
                                                            checked = {task.cuentasBancarias.tieneBanco}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "bancos"
                                                            label = {"Bancos"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.cci != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "cci"
                                                            label = {"CCI"}
                                                            checked = {task.cuentasBancarias.tieneCci}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "cci"
                                                            label = {"CCI"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.imagenQr != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "qr"
                                                            label = {"QR"}
                                                            checked = {task.cuentasBancarias.tieneImagenQr}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "qr"
                                                            label = {"QR"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.nroCuenta != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "nCuenta"
                                                            label = {"N°Cuenta"}
                                                            checked = {task.cuentasBancarias.nroCuenta}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "nCuenta"
                                                            label = {"N°Cuenta"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.nroDocumentoIdentidad != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "nDocumentoIdentidad"
                                                            label = {"DNI"}
                                                            checked = {task.cuentasBancarias.tieneDocumentoIdentidad}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "nDocumentoIdentidad"
                                                            label = {"DNI"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.numero != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "numero"
                                                            label = {"Numero"}
                                                            checked = {task.cuentasBancarias.tieneNumero}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "numero"
                                                            label = {"Numero"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.telefono != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "telefono"
                                                            label = {"Télefono"}
                                                            checked = {task.cuentasBancarias.tieneTelefono}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "telefono"
                                                            label = {"Télefono"}
                                                            checked = {task.cuentasBancarias.tieneTelefono}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposCuentasBancarias_id != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposCuentaBancaria"
                                                            label = {"Tipos Cuenta Bancaria"}
                                                            checked = {task.cuentasBancarias.tieneTiposCuentasBancarias}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposCuentaBancaria"
                                                            label = {"Tipos Cuenta Bancaria"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposNumeros_id != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposNumero"
                                                            label = {"Tipos de Número"}
                                                            checked = {task.cuentasBancarias.tieneTiposNumero}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposNumero"
                                                            label = {"Tipos de Número"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposOperadores_id != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposOperador"
                                                            label = {"Tipos de Operador"}
                                                            checked = {task.cuentasBancarias.tieneTiposOperador}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposOperador"
                                                            label = {"Tipos de Operador"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposPago_id != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposPago"
                                                            label = {"Tipos de Pago"}
                                                            checked = {true}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposPago"
                                                            label = {"Tipos de Pago"}
                                                          />
                                                        }
                                                        {
                                                          task.cuentasBancarias.tiposTarjetas_id != null
                                                          ?<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposTarjeta"
                                                            label = {"Tipos de Tarjeta"}
                                                            checked = {task.cuentasBancarias.tieneTiposTarjeta}
                                                          />
                                                          :<Form.Check
                                                            type  = "checkbox"
                                                            name  = "tiposTarjeta"
                                                            label = {"Tipos de Tarjeta"}
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
                                                        <Form.Group controlId="formTiposProducto">
                                                            {
                                                                task.membresia
                                                                ?task.membresia.map((tasks,posicion) => {
                                                                    return (
                                                                        <Form.Check
                                                                            key      = {posicion}
                                                                            name     = {posicion}
                                                                            onChange = {this.obtenerCambioInputTiposProducto}
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
                                                                            onChange = {this.obtenerCambioInputTiposProducto}
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
                                                      onClick={() => {
                                                        this.state.tb_tiposPago.data.data[posicion]['editar'] = false;
                                                        this.setState({
                                                          tb_tiposPago : this.state.tb_tiposPago
                                                        })
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
                                                        this.state.tb_tiposPago.data.data[posicion]['editar'] = false;
                                                        this.setState({
                                                          tb_tiposPago : this.state.tb_tiposPago
                                                        })
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
