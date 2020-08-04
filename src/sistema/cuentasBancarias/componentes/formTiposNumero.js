import React, {Component} from 'react';
import {Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import Config from "../../../config"

class FormTiposNumero extends Component {
    constructor(){
        super();
        this.state = {
            tb_tiposNumero : []
        }
        this.fetchTiposNumero = this.fetchTiposNumero.bind(this);
    }

    fetchTiposNumero(){
        fetch(`${Config.api}mostrar/tiposNumero`,
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
            if(this.props.idTipoNumeroSeleccionado != null)
            {
                let nuevoArray = []
                let tienePosicionCero = false
                data.data.map((task, posicion)=>{
                    if(posicion == 0)
                    {
                        if(task.id == this.props.idTipoNumeroSeleccionado)
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
                        if(task.id == this.props.idTipoNumeroSeleccionado)
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
                    tb_tiposNumero : nuevoArray
                })
            }else{
                this.setState({
                    tb_tiposNumero : data.data
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
        this.fetchTiposNumero();
    }

    render() {
        return (
            <Aux>
                <Form.Group controlId="select.tipoNumero">
                    {
                        this.props.idTipoNumeroSeleccionado != null
                        ?null
                        :<Form.Label> Selecciona un Tipo de Número </Form.Label>
                    }
                    <Form.Control as="select" onChange={this.props.handleChange} name="tiposNumeros_id" >
                        {
                            this.state.tb_tiposNumero
                            ?this.state.tb_tiposNumero.map((task, posicion) => {
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

export default FormTiposNumero;