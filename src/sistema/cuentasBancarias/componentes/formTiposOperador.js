import React, {Component} from 'react';
import {Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import Config from "../../../config"

class FormTiposOperador extends Component {
    constructor(){
        super();
        this.state = {
            tb_tiposOperador : []
        }

        this.fetchTiposOperador = this.fetchTiposOperador.bind(this);
    }

    fetchTiposOperador(){
        fetch(`${Config.api}mostrar/tiposOperador`,
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
            if(this.props.idTipoOperadorSeleccionado != null)
            {
                let nuevoArray = []
                let tienePosicionCero = false
                data.data.map((task, posicion)=>{
                    if(posicion == 0)
                    {
                        if(task.id == this.props.idTipoOperadorSeleccionado)
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
                        if(task.id == this.props.idTipoOperadorSeleccionado)
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
                    tb_tiposOperador : nuevoArray
                })
            }else{
                this.setState({
                    tb_tiposOperador : data.data
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
        this.fetchTiposOperador();
    }

    render() {
        return (
            <Aux>
                <Form.Group controlId="select.tiposOperador">
                    {
                        this.props.idTipoOperadorSeleccionado != null
                        ?null
                        :<Form.Label> Selecciona un Tipo de Operador </Form.Label>
                    }
                    <Form.Control 
                        as="select" 
                        onChange={this.props.handleChange} 
                        name="tiposOperadores_id"
                    >
                        {
                            this.state.tb_tiposOperador
                            ?this.state.tb_tiposOperador.map((task, posicion) => {
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

export default FormTiposOperador;