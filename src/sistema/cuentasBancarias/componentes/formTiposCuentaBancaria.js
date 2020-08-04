import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import Config from "../../../config"

class FormTiposCuentaBancaria extends Component {
    constructor(){
        super();
        this.state = {
            tb_tiposCuentaBancaria : []
        }
        this.fetchTiposCuentasBancarias = this.fetchTiposCuentasBancarias.bind(this);
    }

    fetchTiposCuentasBancarias(){
        fetch(`${Config.api}mostrar/tiposCuentasBancarias`,
        {
            mode:'cors',
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type' : 'application/json',
                'api_token': localStorage.getItem('token')
            }
        })
        .then(res =>res.json())
        .then(data => {
        if(data.respuesta==true)
        {
            if(this.props.idTipoCuentaBancariaSeleccionado != null)
            {
                let nuevoArray = []
                let tienePosicionCero = false
                data.data.map((task, posicion)=>{
                    if(posicion == 0)
                    {
                        if(task.id == this.props.idTipoCuentaBancariaSeleccionado)
                        {
                            nuevoArray.push({
                                id      : task.id,
                                nombre  : task.nombre
                            })
                        }else{
                            nuevoArray.push({
                                id      : task.id,
                                nombre  : task.nombre
                            })
                            tienePosicionCero = true
                        }
                    }else{
                        if(task.id == this.props.idTipoCuentaBancariaSeleccionado)
                        {
                            if(tienePosicionCero == true)
                            {
                                nuevoArray.push({
                                    id      : nuevoArray[0]['id'],
                                    nombre  : nuevoArray[0]['nombre']
                                })
                                nuevoArray[0]['id']     = task.id
                                nuevoArray[0]['nombre'] = task.nombre
                            }
                        }else{
                            nuevoArray.push({
                                id      : task.id,
                                nombre  : task.nombre
                            })
                        }
                    }
                })
                this.setState({
                    tb_tiposCuentaBancaria : nuevoArray
                })
            }else{
                this.setState({
                    tb_tiposCuentaBancaria : data.data
                })
            }

        }
        else
        {
            
        }
        }).catch((error)=> {
            
        });  
    }

    componentDidMount()
    {
        this.fetchTiposCuentasBancarias();
    }

    render() {
        return (
            <Aux>
                <Form.Group controlId="select.bancos">
                    {
                        this.props.idTipoCuentaBancariaSeleccionado != null
                        ?null
                        :<Form.Label> Selecciona un tipo de cuenta bancaria </Form.Label>
                    }
                        <Form.Control as="select" onChange={this.props.handleChange} name="tiposCuentasBancarias_id" >
                        {
                            this.state.tb_tiposCuentaBancaria
                            ?this.state.tb_tiposCuentaBancaria.map((task, posicion) => {
                                return (
                                <option value={task.id} key={task.id}  > {task.nombre} </option>
                                );
                            })
                            :null
                        }
                    </Form.Control>
                </Form.Group>
            </Aux>
        );
    }
}

export default FormTiposCuentaBancaria;