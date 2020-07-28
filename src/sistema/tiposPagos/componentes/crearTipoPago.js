import React, {Component} from 'react';
import {Row, Col, Card, Form, InputGroup, FormControl, Button, Collapse} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import Config from "../../../config"
import DEMO from "../../../store/constant";
import cogoToast from "cogo-toast";
import { Redirect } from 'react-router-dom';
// SPINNER (cargando)
import { css } from "@emotion/core";
import HashLoader from "react-spinners/HashLoader";

class CrearTipoPago extends Component {
    constructor(){
        super();
        this.state = {
            cargando                 : false,
            redireccionarTipoPago    : false,
            tb_membresias            : [],
            tb_tipoProductos         : [],
            acordionSeleccionado     : 0,

            nombreTiposPago          : '',
            integracionCrear         : 0,
            esDatoFinanciero         : 1,
            esCuentaBancariaCrear    : 0,
            ocultoCrear              : 0,
            imagen                   : '',
            titular                  : 0,
            bancos                   : 0,
            numerosCuenta            : 0,
            codigoInterbancaria      : 0,
            tiposPago                : 0,
            tiposCuentaBancaria      : 0,
            tiposNumero              : 0,
            tiposTarjeta             : 0,
            tiposOperador            : 0,
            numero                   : 0,
            telefono                 : 0,
            imagenQR                 : 0,
            numeroDocumentoIdentidad : 0,
        }
        this.fetchMembresias = this.fetchMembresias.bind(this);
        this.fetchTipoProductos = this.fetchTipoProductos.bind(this);
        this.obtenerCambioInputTiposProducto = this.obtenerCambioInputTiposProducto.bind(this);
        this.obtenerCambioInputMembresias = this.obtenerCambioInputMembresias.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.renderRedireccionarTiposPago = this.renderRedireccionarTiposPago.bind(this);
    }

    fetchMembresias(){
        fetch(`${Config.api}membresia/mostrar`,
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
            if(data.respuesta === true){
                this.setState({
                    tb_membresias: data
                });

                
                let newArray = []
                this.state.tb_membresias.datos.map((data)=>{
                    newArray.push({
                        id           : data.id,
                        nombre       : data.nombre,
                        seleccionado : true
                    })
                })
                this.state.tb_membresias.datos = newArray;
                this.setState({
                    tb_membresias: this.state.tb_membresias
                })
            }
            else{
                
            }
        }).catch((error)=> {
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

                let newArray = []
                this.state.tb_tipoProductos.datos.map((data)=>{
                    newArray.push({
                        id           : data.id,
                        nombre       : data.nombre,
                        seleccionado : true
                    })
                })
                this.state.tb_tipoProductos.datos = newArray;
                this.setState({
                    tb_tipoProductos: this.state.tb_tipoProductos
                })
            }
            else{

            }
        }).catch((error)=> {

        });
    }

    async enviarCrearTiposPago(){
        this.setState({ cargando: true }, async() => {
            await fetch(`${Config.api}tiposPago/crear`,
            {
                mode:'cors',
                method: 'POST',
                body: JSON.stringify({
                    nombre                   : this.state.nombreTiposPago,
                    integracion              : this.state.integracionCrear,
                    esCuentaBancaria         : this.state.esCuentaBancariaCrear,
                    esDatoFinanciero         : this.state.esCuentaBancariaCrear,
                    oculto                   : this.state.ocultoCrear,
                    imagen                   : this.state.imagen,
                    titular                  : this.state.titular,
                    bancos                   : this.state.bancos,
                    numerosCuenta            : this.state.numerosCuenta,
                    codigoInterbancaria      : this.state.codigoInterbancaria,
                    tiposPago                : this.state.tiposPago,
                    tiposCuentaBancaria      : this.state.tiposCuentaBancaria,
                    tiposNumero              : this.state.tiposNumero,
                    tiposTarjeta             : this.state.tiposTarjeta,
                    tiposOperador            : this.state.tiposOperador,
                    numero                   : this.state.numero,
                    telefono                 : this.state.telefono,
                    imagenQR                 : this.state.imagenQR,
                    numeroDocumentoIdentidad : this.state.numeroDocumentoIdentidad,
                    membresias               : this.state.tb_membresias.datos,
                    tiposProducto            : this.state.tb_tipoProductos.datos
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
                    this.setState({
                        redireccionarTipoPago : true
                    })
                    cogoToast.success(data.mensaje);
                }
                else{
                    cogoToast.warn(data.mensaje);
                }
            }).catch((error)=> {
                cogoToast.warn("Lo sentimos, hubo problemas al momento de agregar el nuevo tipo de pago");
            });
            this.setState({ cargando: false })
        });
    }

    componentDidMount()
    {
        this.fetchMembresias();
        this.fetchTipoProductos();
    }

    obtenerCambioInputMembresias(e){

        this.state.tb_membresias.datos[e.target.name]['seleccionado'] = !this.state.tb_membresias.datos[e.target.name]['seleccionado'];
        
        this.setState({
            tb_membresias : this.state.tb_membresias
        })
    }

    obtenerCambioInputTiposProducto(e){

        this.state.tb_tipoProductos.datos[e.target.name]['seleccionado'] = !this.state.tb_tipoProductos.datos[e.target.name]['seleccionado'];
        
        this.setState({
            tb_tipoProductos : this.state.tb_tipoProductos
        })
    }

    handleChange(e){
        let {name, value} = e.target;
        // console.log(value);
        if(value == 'on')
        {
            if(this.state[name] == 0)
            {
                value = 1;
            }else{
                value = 0;
            }
        }
        // console.log(value);
        this.setState({
          [name]: value
        })
    }

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
            });
        }
    }

    renderRedireccionarTiposPago = () => {
        if (this.state.redireccionarTipoPago) {
            return <Redirect to='/tiposPago' />
        }
    }

    render() {
        return (
            <Aux>
                {this.renderRedireccionarTiposPago()}
                <Row>
                    <Col sm={12} className="accordion">
                        <Card className="mt-2">
                            <Card.Header>
                                <Card.Title as="h5">
                                    <a href={DEMO.BLANK_LINK}
                                        onClick={() => this.setState({ acordionSeleccionado: (this.state.acordionSeleccionado !== 1) ? 1 : 0 })}
                                        aria-controls="accordion1"
                                        aria-expanded={this.state.acordionSeleccionado=== 1}>
                                        Opciones Avanzadas
                                    </a>
                                </Card.Title>
                            </Card.Header>
                            <Collapse in={this.state.acordionSeleccionado === 1}>
                                <div id="accordion1">
                                    <Card.Body>
                                        <Col>
                                            <Form>
                                                <Form.Group controlId="formAvanzadoCheckOculto">
                                                    <Form.Check 
                                                        type     = "checkbox" 
                                                        label    = "¿Esta Oculto?"
                                                        name     = "ocultoCrear"
                                                        onChange = {this.handleChange}
                                                        checked  = {
                                                            this.state.ocultoCrear == 0
                                                            ?false
                                                            :true
                                                        }
                                                    />
                                                    <Form.Text className="text-muted">
                                                        <b>Si:</b> Esta desabilitado y no se mostrara a los usuarios.
                                                    </Form.Text>
                                                    <Form.Text className="text-muted">
                                                        <b>No:</b> Esta disponible para seleccionar y mostrar.
                                                    </Form.Text>
                                                </Form.Group>
                                                <Form.Group controlId="formAvanzadoCheckIntegracion">
                                                    <Form.Check 
                                                        type     = "checkbox" 
                                                        label    = "¿Tiene alguna integración?" 
                                                        name     = "integracionCrear"
                                                        onChange = {this.handleChange}
                                                        checked  = {
                                                            this.state.integracionCrear == 0
                                                            ?false
                                                            :true
                                                        }
                                                    />
                                                    <Form.Text className="text-muted">
                                                        <b>Si:</b> Un desarrollo aparte del lado del celular a nivel de codigo que incluya modificar o actualizar esta.
                                                    </Form.Text>
                                                    <Form.Text className="text-muted">
                                                        <b>No:</b> Un dato que se utiliza unicamente para seleccionar y/o mostrar, no incluye cambios a nivel de codigo del celular.
                                                    </Form.Text>
                                                </Form.Group>
                                                <Form.Group controlId="formAvanzadoCheckCuentaBancaria">
                                                    <Form.Check 
                                                        type     = "checkbox" 
                                                        label    = "¿Es una cuenta bancaria?" 
                                                        name     = "esCuentaBancariaCrear"
                                                        onChange = {this.handleChange}
                                                        checked  = {
                                                            this.state.esCuentaBancariaCrear == 0
                                                            ?false
                                                            :true
                                                        }
                                                    />
                                                    <Form.Text className="text-muted">
                                                        <b>Si:</b> Es un dato que tiene relación con cualquier entidad bancaria tales como: "Numero de Cuenta", "CCI", etc.
                                                    </Form.Text>
                                                    <Form.Text className="text-muted">
                                                        <b>No:</b> No tiene relación con ninguna entidad bancaria tales como: "Culqi", "Ligo Magica", "Bim", etc.
                                                    </Form.Text>
                                                </Form.Group>
                                                <Form.Group controlId="formAvanzadoCheckDatoFinanciero">
                                                    <Form.Check 
                                                        type     = "checkbox" 
                                                        label    = "¿Es un dato financiero?" 
                                                        name     = "esDatoFinanciero"
                                                        onChange = {this.handleChange}
                                                        checked  = {
                                                            this.state.esDatoFinanciero == 0
                                                            ?false
                                                            :true
                                                        }
                                                    />
                                                    <Form.Text className="text-muted">
                                                        <b>Si:</b> Se mostrara como opción para que un usuario pueda agregar sus datos financieros.
                                                    </Form.Text>
                                                    <Form.Text className="text-muted">
                                                        <b>No:</b> No es necesario que un usuario tenga la opción de llenar este tipo de pago como dato financiero tales como: "Depósito", "Transferencia", "Culqi", etc.
                                                    </Form.Text>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='Recent-Users'>
                            <Card.Header>
                                <Card.Title as='h5'>Nuevo Tipo Pago</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form>
                                            <Form.Group controlId="formNombre">
                                                <Form.Label>Nombre:</Form.Label>
                                                <Form.Control
                                                    type="nombreTipoPago" 
                                                    placeholder="" 
                                                    name="nombreTiposPago"
                                                    onChange={this.handleChange}
                                                />
                                                {/* <Form.Text className="text-muted">
                                                    We'll never share your email with anyone else.
                                                </Form.Text> */}
                                            </Form.Group>
                                        </Form>
                                        <Form>
                                            <Form.Group controlId="formImagen">
                                                <Form.Label>Imagen:</Form.Label>
                                                <input 
                                                    type="file" 
                                                    className="form-control-file" 
                                                    name="imagen" 
                                                    onChange={e =>this.handleChangeFile(e)}
                                                />
                                            </Form.Group>
                                        </Form>

                                        <Form.Label>Marca los campos que tendrá este nuevo tipo de pago:</Form.Label>
                                        <Form.Check
                                            type="checkbox" 
                                            label={"Titular"}
                                            name="titular"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            name="bancos"
                                            onChange={this.handleChange}
                                            label={"Bancos"}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Numeros de Cuenta"}
                                            name="numerosCuenta"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Código de Cuenta Interbancaria"}
                                            name="codigoInterbancaria"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Tipos de Pago"}
                                            name="tiposPago"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Tipos de Cuenta Bancaria"}
                                            name="tiposCuentaBancaria"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Tipos de Número"}
                                            name="tiposNumero"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Tipos de Tarjeta"}
                                            name="tiposTarjeta"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Tipos de Operador"}
                                            name="tiposOperador"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Número"}
                                            name="numero"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Teléfono"}
                                            name="telefono"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Imagen QR"}
                                            name="imagenQR"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check 
                                            type="checkbox" 
                                            label={"Número de Documento Identidad"}
                                            name="numeroDocumentoIdentidad"
                                            onChange={this.handleChange}
                                        />
                                        
                                    </Col>
                                    <Col md={6}>
                                        <Form>
                                            <Form.Group controlId="formMembresias">
                                                <Form.Label>Membresias:</Form.Label>
                                                {
                                                    this.state.tb_membresias.datos
                                                    ?this.state.tb_membresias.datos.map((task, posicion) => {
                                                        return (
                                                            <Form.Check 
                                                                key      = {posicion}
                                                                type    = "checkbox" 
                                                                name     = {posicion} 
                                                                onChange = {this.obtenerCambioInputMembresias}
                                                                checked = {task.seleccionado}
                                                                label   = {task.nombre}

                                                                
                                                            />
                                                        );
                                                    })
                                                    :null
                                                }
                                            </Form.Group>
                                        </Form>
                                        <Form>
                                            <Form.Group controlId="formTiposProducto">
                                                <Form.Label>Tipos Producto:</Form.Label>
                                                {
                                                    this.state.tb_tipoProductos.datos
                                                    ?this.state.tb_tipoProductos.datos.map((task,posicion) => {
                                                        return (
                                                            <Form.Check
                                                                key      = {posicion}
                                                                name     = {posicion} 
                                                                onChange = {this.obtenerCambioInputTiposProducto}
                                                                type     = "checkbox" 
                                                                checked  = {task.seleccionado}
                                                                label    = {task.nombre}
                                                            />
                                                        );
                                                    })
                                                    :null
                                                }
                                            </Form.Group>
                                        </Form>
                                        {
                                            this.state.cargando == true
                                            ?<HashLoader
                                                color={"blue"}
                                                width={1000}
                                                size={40}
                                                loading={true}
                                            />
                                            :<div className="mx-auto p-2">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-sm btn-primary ver" 
                                                    onClick={() => this.enviarCrearTiposPago()}>Crear Nuevo Tipo Pago</button>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default CrearTipoPago;
