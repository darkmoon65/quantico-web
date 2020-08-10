import React, {Component} from 'react';
import {Row, Col, Card, Table, Modal, Form, InputGroup, FormControl, Button} from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexComprobantes extends Component {

    constructor(){
        super();
        this.state = {
            tb_notificaciones:[],
            boolModal:false,
            txt_crearNotificacion_mensaje : ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    descargarExcel(){
      Files.exportToCSV(this.state.tb_notificaciones,"notificaciones");
    }
    fetchNotificaciones(){
        fetch(`${Config.api}notificaciones/mostrar`,
          {
            mode:'cors',
            method: 'GET',
            headers: {
                'estado' : '2',
                'Accept' : 'application/json',
                'Content-type' : 'application/json',
                'api_token': localStorage.getItem('token')
            }
          }
        )
        .then(res =>res.json())
        .then(data => {

            if(data['respuesta']){
                this.setState({
                    tb_notificaciones: data['datos']
                })
            }
        }).catch((error)=> {

        });
    }

    componentDidMount(){
      this.fetchNotificaciones();
    }

    agregarNotificacion(){
        fetch(`${Config.api}notificaciones/crear`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                todos     : true,
                idUsuario : null,
                mensaje   : this.state.txt_crearNotificacion_mensaje,
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
            if(data.respuesta === true){
                cogoToast.success("Notificacion enviada");
                this.abrirModal();
                this.fetchNotificaciones();
            }
            else{
              cogoToast.error("Error al enviar la notificación");
            }
        }).catch((error)=> {
          cogoToast.error("Error al enviar la notificación");
        });
    }


    abrirModal(){
        this.setState({
            boolModal: !this.state.boolModal,
        })
    }

    handleChange(e){
        const {name, value} = e.target;
        this.setState({
          [name]: value
        })
    }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">NOTIFICACIONES</Card.Title>
                                {/* <span className="d-block m-t-5">use props <code>hover</code> with <code>Table</code> component</span> */}
                            </Card.Header>
                            <Card.Body>
                                <button
                                    className="btn btn-sm btn-primary ver"
                                    type="button"
                                    onClick={()=>this.abrirModal()}>Crear Notificación</button>
                                <button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            {/* <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>correo</th> */}
                                            <th>texto</th>
                                            <th>fecha</th>
                                            {/* <th>todos</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.tb_notificaciones
                                        ?this.state.tb_notificaciones.map((task, posicion) => {
                                            return (
                                                <tr key={posicion}>
                                                    <td>{posicion+1}</td>
                                                    {/* <td>{task.nombres}</td>
                                                    <td>{task.apellidos}</td>
                                                    <td>{task.correo}</td> */}
                                                    <td>{task.texto}</td>
                                                    <td>{task.usunoticreated_at}</td>
                                                    {/* <td>{task.todos}</td> */}
                                                </tr>
                                            );
                                        })
                                        :null
                                    }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    size="md"
                    show={this.state.boolModal}
                    onHide={() => this.abrirModal()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                            Agregar Notificación
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Mensaje Notificación</Form.Label>
                                    <Form.Control name="txt_crearNotificacion_mensaje" as="textarea" rows="3" onChange={this.handleChange} />
                                </Form.Group>
                                <InputGroup className="mb-12">
                                    <Button
                                        onClick={()=>{this.agregarNotificacion();}}
                                    >Enviar</Button>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Modal.Body>
                  </Modal>
            </Aux>
        );
    }
}

export default IndexComprobantes;
