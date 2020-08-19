import React, {Component} from 'react';
import {Row, Col,Form,Pagination,Table} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files";
import Paginar from "../../paginate"

class IndexQuieros extends Component {
    constructor(){
        super();
        this.state = {
            txt_texto_numeroPagina : 1,
            tb_quieros : []
        }
        this.fetchQuieros = this.fetchQuieros.bind(this);
        this.fetchEditarQuieroMembresia = this.fetchEditarQuieroMembresia.bind(this);
    }

    fetchQuieros(bolean, numero)
    {
        fetch(`${Config.api}mostrar/quierosMembresias?page=`+numero,
        {
            mode:'cors',
            method: 'get',
            headers: {
                'Accept' : 'application/json',
                'Content-type' : 'application/json',
                'api_token': localStorage.getItem('token')
            },
        })
        .then(res =>res.json())
        .then(data => {
        if(data.respuesta == true){
            this.setState({
                tb_quieros: data.data,
                // txt_texto_numeroPagina : data.data.current_page
            })
        }

        }).catch((error)=> {

        });
    }

    componentDidMount(){
        this.fetchQuieros();
    }

    fetchEditarQuieroMembresia(idMembresiaPadre, idsMembresiasHijos){
        fetch(`${Config.api}editar/quierosMembresias`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                idMembresiaPadre : idMembresiaPadre,
                idsMembresiasHijos : idsMembresiasHijos
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
                this.fetchQuieros();
                cogoToast.success(data.mensaje)
            }else{
                cogoToast.error(data.mensaje)
            }
        })
        .catch((error)=> {
          cogoToast.error("No se pudo actualizar la información")
      });
    }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Quieros' isOption>
                            <Table id="tb_quieros" striped responsive>
                                <thead>
                                    <tr>
                                        
                                    </tr>
                                    <tr>
                                        <th>Membresía</th>
                                        <th>Membresias Asignadas</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.tb_quieros.length > 0
                                    ?this.state.tb_quieros.map((task, posicion) =>{
                                        return (
                                            <tr key={posicion}>
                                                <td>
                                                    {task.membresiaPadreNombre}
                                                </td>
                                                <td>
                                                    {
                                                        task.membresiasHijo
                                                        ?task.editar == true
                                                            ?<Form>
                                                                <Form.Group controlId="formTiposProducto">
                                                                    {
                                                                        task.membresiasHijo
                                                                        ?task.membresiasHijo.map((tasks,posicion) => {
                                                                            return (
                                                                                <Form.Check
                                                                                    key      = {posicion}
                                                                                    name     = {posicion}
                                                                                    onChange = {(e) => {
                                                                                    tasks.seleccionado = !tasks.seleccionado
                                                                                    this.setState({
                                                                                        tb_quieros : this.state.tb_quieros
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
                                                            :task.membresiasHijo.map((tosk, posicion) => {
                                                                return(
                                                                    tosk.seleccionado == true
                                                                    ?<span>{tosk.nombre}<br/></span>
                                                                    :null
                                                                )
                                                            })
                                                        :null

                                                    } 
                                                </td>
                                                <td>
                                                    {
                                                        task.editar != true
                                                        ?<button
                                                            className="btn btn-sm btn-primary"
                                                            type="button"
                                                            onClick={() => {
                                                                this.state.tb_quieros[posicion]['editar'] = true;
                                                                this.setState({
                                                                    tb_quieros : this.state.tb_quieros
                                                                })
                                                            }}
                                                        >
                                                            <i className="fa fa-pencil" ></i>
                                                        </button>
                                                        :<button
                                                            className="btn btn-sm btn-warning"
                                                            type="button"
                                                            onClick={() => {
                                                                this.fetchEditarQuieroMembresia(task.idMembresiaPadre, task.membresiasHijo)
                                                            }}
                                                        >
                                                            <i className="fa fa-save" ></i>
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :null
                                }

                                </tbody>
                            </Table>
                            <Pagination>
                                
                            </Pagination>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default IndexQuieros;
