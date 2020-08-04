import React, {Component} from 'react';
import {Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import Config from "../../../config"

class FormTiposTarjeta extends Component {
    constructor(){
        super();
        this.state = {
            tb_tiposTarjeta : []
        }
        this.fetchTiposTarjeta = this.fetchTiposTarjeta.bind(this);
    }

    fetchTiposTarjeta(){
        fetch(`${Config.api}mostrar/tiposTarjetas`,
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
        if(data.respuesta==true)
        {
            if(this.props.idTipoTarjetaSeleccionado != null)
            {
                let nuevoArray = []
                let tienePosicionCero = false
                data.data.map((task, posicion)=>{
                    if(posicion == 0)
                    {
                        if(task.id == this.props.idTipoTarjetaSeleccionado)
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
                        if(task.id == this.props.idTipoTarjetaSeleccionado)
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
                    tb_tiposTarjeta : nuevoArray
                })
            }else{
                this.setState({
                    tb_tiposTarjeta : data.data
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
        this.fetchTiposTarjeta();
    }

    render() {
        return (
            <Aux>
                <Form.Group controlId="select.tiposTarjeta">
                    {
                        this.props.idTipoTarjetaSeleccionado != null
                        ?null
                        :<Form.Label> Selecciona un Tipo de Tarjeta </Form.Label>
                    }
                    <Form.Control 
                        as="select" 
                        onChange={this.props.handleChange} 
                        name="tiposTarjetas_id"
                    >
                        {
                            this.state.tb_tiposTarjeta
                            ?this.state.tb_tiposTarjeta.map((task, posicion) => {
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

export default FormTiposTarjeta;