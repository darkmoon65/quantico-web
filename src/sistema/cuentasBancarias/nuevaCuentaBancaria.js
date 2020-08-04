import React, {Component} from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import FormTitular from './componentes/formTitular'
import FormBancos from './componentes/formBancos'
import FormCci from './componentes/formCci'
import FormImagenQr from './componentes/formImagenQr'
import FormNumeroCuenta from './componentes/formNumeroCuenta'
import FormNumeroDocumentoIdentidad from './componentes/formNumeroDni'
import FormNumero from './componentes/formNumero'
import FormNumeroTelefono from './componentes/formNumeroTelefono'
import FormTiposCuentaBancaria from './componentes/formTiposCuentaBancaria'
import FormTiposNumero from './componentes/formTiposNumero'
import FormTiposTarjeta from './componentes/formTiposTarjeta'
import FormTiposOperador from './componentes/formTiposOperador'
import Config from "../../config"

class NuevaCuentaBancaria extends Component {
    constructor(){
        super();
        this.state = {
            tb_camposCuentaBancaria     : [],
            tb_tiposPagoLista           : [],
            tiposPago_id                : null,
            banco_id                    : null,
            tiposCuentasBancarias_id    : null,
            tiposNumeros_id             : null,
            tiposTarjetas_id            : null,
            tiposOperadores_id          : null,
            titular                     : null,
            nroCuenta                   : null,
            cci                         : null,
            nombreBanco                 : null,
            numero                      : null,
            telefono                    : null,
            imagenQr                    : null,
            nroDocumentoIdentidad       : null,

        }
        this.handleChange = this.handleChange.bind(this);
        this.fetchCamposCuentaBancaria = this.fetchCamposCuentaBancaria.bind(this);
    }
    
    handleChange(e){
        const {name, value} = e.target;
        if(name == "selectTipoPagoNuevo")
        {
            this.fetchCamposCuentaBancaria(value)
        }
        
        this.setState({
            [name]: value
        })
    }

    async fetchCamposCuentaBancaria(idTipoPago)
    {
        this.funLimpiarCampos();
        fetch(`${Config.api}tiposPagos/datosFinancieros/formulario/mostrar/`+idTipoPago,
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
            if(data.respuesta == true)
            {
                this.setState({
                    tb_camposCuentaBancaria: data.data,
                    tiposPago_id : idTipoPago
                })
            }
            else
            {
                this.setState({
                    tb_camposCuentaBancaria : []
                })
            }
        }).catch((error)=> {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
    }

    fetchTiposPagosLista()
    {
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
            if(data.respuesta == true)
            {
                this.setState({
                    tb_tiposPagoLista: data.datos
                })
                this.fetchCuentasBancariasAdmin(data.datos[0]['id'])
            }
            else
            {

            }
        }).catch((error)=> {
            
        });
    }

    componentDidMount()
    {
        this.fetchTiposPagosLista();
    }

    fetchAgregarDatoFinanciero()
    {
        console.log(this.state.tiposPago_id);
        console.log(this.state.banco_id);
        console.log(this.state.tiposCuentasBancarias_id);
        console.log(this.state.tiposNumeros_id);
        console.log(this.state.tiposTarjetas_id);
        console.log(this.state.tiposOperadores_id);
        console.log(this.state.titular);
        console.log(this.state.nroCuenta);
        console.log(this.state.cci);
        console.log(this.state.nombreBanco);
        console.log(this.state.numero);
        console.log(this.state.telefono);
        console.log(this.state.imagenQr);
        console.log(this.state.nroDocumentoIdentidad);
        fetch(`${Config.api}agregar/datoFinanciero`,
            {
                mode:'cors',
                method: 'POST',
                body: JSON.stringify({
                    tiposPago_id                : this.state.tiposPago_id,
                    banco_id                    : this.state.banco_id,
                    tiposCuentasBancarias_id    : this.state.tiposCuentasBancarias_id,
                    tiposNumeros_id             : this.state.tiposNumeros_id,
                    tiposTarjetas_id            : this.state.tiposTarjetas_id,
                    tiposOperadores_id          : this.state.tiposOperadores_id,
                    titular                     : this.state.titular,
                    nroCuenta                   : this.state.nroCuenta,
                    cci                         : this.state.cci,
                    nombreBanco                 : this.state.nombreBanco,
                    numero                      : this.state.numero,
                    telefono                    : this.state.telefono,
                    imagenQr                    : this.state.imagenQr,
                    nroDocumentoIdentidad       : this.state.nroDocumentoIdentidad,
                }),
                headers: {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json',
                    'api_token': localStorage.getItem('token')
                }
            }
        )
        .then(res =>res.json())
        .then(data => {
            if(data.respuesta == true)
            {
                console.log('Correcto ')
                this.props.cambiarModalCrearCuentaBancaria();
            }
            else
            {

            }
        }).catch((error)=> {
            
        });
    }

    funLimpiarCampos()
    {
        this.setState({
            tiposPago_id                : null,
            banco_id                    : null,
            tiposCuentasBancarias_id    : null,
            tiposNumeros_id             : null,
            tiposTarjetas_id            : null,
            tiposOperadores_id          : null,
            // titular                     : null,
            nroCuenta                   : null,
            cci                         : null,
            nombreBanco                 : null,
            numero                      : null,
            telefono                    : null,
            imagenQr                    : null,
            nroDocumentoIdentidad       : null,
        })
        return true;
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <Form.Group controlId="select.filtros">
                    <Form.Label> Seleccionar tipo de pago </Form.Label>
                    <Form.Control as="select" onChange={this.handleChange} name="selectTipoPagoNuevo" >
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
                <Col md={6}>
                    <FormTitular
                        titular         = {this.state.titular}
                        handleChange    = {this.handleChange}
                    />
                </Col>
                {
                    this.state.tb_camposCuentaBancaria
                    ?<Col md={12}>
                        {
                        this.state.tb_camposCuentaBancaria['banco_id'] == null
                        ?null
                        :<FormBancos
                            banco_id        = {this.state.banco_id}
                            handleChange    = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['tiposCuentasBancarias_id'] == null
                        ?null
                        :<FormTiposCuentaBancaria
                            tiposCuentasBancarias_id    = {this.state.tiposCuentasBancarias_id}
                            handleChange                = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['cci'] == null
                        ?null
                        :<FormCci
                            cci             = {this.state.cci}
                            handleChange    = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['imagenQr'] == null
                        ?null
                        :<FormImagenQr
                            imagenQr        = {this.state.imagenQr}
                            handleChange    = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['nroCuenta'] == null
                        ?null
                        :<FormNumeroCuenta
                            nroCuenta       = {this.state.nroCuenta}
                            handleChange    = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['nroDocumentoIdentidad'] == null
                        ?null
                        :<FormNumeroDocumentoIdentidad
                            nroDocumentoIdentidad   = {this.state.nroDocumentoIdentidad}
                            handleChange            = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['tiposNumeros_id'] == null
                        ?null
                        :<FormTiposNumero
                            tiposNumeros_id = {this.state.tiposNumeros_id}
                            handleChange    = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['tiposTarjetas_id'] == null
                        ?null
                        :<FormTiposTarjeta
                            tiposTarjetas_id    = {this.state.tiposTarjetas_id}
                            handleChange        = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['tiposOperadores_id'] == null
                        ?null
                        :<FormTiposOperador
                            tiposOperadores_id  = {this.state.tiposOperadores_id}
                            handleChange        = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['numero'] == null
                        ?null
                        :<FormNumero
                            numero       = {this.state.numero}
                            handleChange = {this.handleChange}
                        />
                        }
                        {
                        this.state.tb_camposCuentaBancaria['telefono'] == null
                        ?null
                        :<FormNumeroTelefono
                            telefono     = {this.state.telefono}
                            handleChange = {this.handleChange}
                        />
                        }
                        
                    </Col>
                    :null
                }
                    <Col md={12}>
                        <Button
                            onClick={()=>{this.fetchAgregarDatoFinanciero()} }
                        >
                            Crear
                        </Button>
                    </Col>
                </Row>
        );
    }
}

export default NuevaCuentaBancaria;
