import React, {Component} from 'react';
import {Row, Col, Card, Table, Modal, Form, InputGroup, Pagination, Button} from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"
import Paginar from "../../paginate"

class IndexComprobantes extends Component {

    constructor(){
        super();
        this.state = {
            tb_notificaciones:{"data" : []},
            boolModal:false,
            tb_membresias             : [],
            selec_crearNotificacion_enviara   : true,
            selec_crearNotificacion_membresia : '',
            txt_crearNotificacion_titulo      : '',
            txt_crearNotificacion_mensaje     : '',
            txt_texto_numeroPagina :1,

        }
        this.handleChange = this.handleChange.bind(this);
        this.fetchMembresias = this.fetchMembresias.bind(this);
        this.fetchNotificaciones = this.fetchNotificaciones.bind(this);
    }
    
    descargarExcel(){
      Files.exportToCSV(this.state.tb_notificaciones,"notificaciones");
    }

    fetchNotificaciones(bolean, numero){
        fetch(`${Config.api}notificaciones/mostrar?page=`+numero,
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

            console.log(data);
            if(data['respuesta']){
                this.setState({
                    tb_notificaciones: data['data']
                })
            }
            else{
                console.log(data)
                console.log("hubo un error con la peticion")
            }
        }).catch((error)=> {
            console.log(error);
          console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
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
                this.state.selec_crearNotificacion_membresia = newArray[0]['id'];
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

    componentDidMount(){
      this.fetchNotificaciones(true, this.state.txt_texto_numeroPagina);
      this.fetchMembresias();
    }

    agregarNotificacion(){
        fetch(`${Config.api}notificaciones/crear`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                // todos     : true,
                // idUsuario : null,
                // mensaje   : this.state.txt_crearNotificacion_mensaje,

                todos       : this.state.selec_crearNotificacion_enviara,
                token       : null,
                idUsuario   : null,
                idMembresia : this.state.selec_crearNotificacion_membresia,
                titulo      : this.state.txt_crearNotificacion_titulo,
                mensaje     : this.state.txt_crearNotificacion_mensaje,
                codigo      : null,
                vista       : null,
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
                this.fetchNotificaciones(true, this.state.txt_texto_numeroPagina);
            }
            else{
              console.log(data)
              cogoToast.error("Error al enviar la notificación");
            }
        }).catch((error)=> {
          console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
    }


    abrirModal(){
        this.setState({
            boolModal: !this.state.boolModal,
        })
    }

    handleChange(e){
        let {name, value} = e.target;
        if(name == 'selec_crearNotificacion_enviara')
        {
            if(value == 'todos')
            {
                value = true
            }else{
                value = false
            }
        }

        this.setState({
          [name]: value
        })
    }

    fetchObtenerUsuario()
    {

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
                                        ?this.state.tb_notificaciones.data.map((task, posicion) => {
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
                                <Pagination>
                                    <Pagination.Prev 
                                    onClick={() => this.fetchNotificaciones(
                                        true,
                                        parseInt(this.state.txt_texto_numeroPagina)-1,
                                    )}
                                    />
                                    {
                                    this.state.tb_notificaciones
                                    ?<Paginar 
                                        data  = { this.state.tb_notificaciones} 
                                        fetch = { (bolean,numero)=>this.fetchNotificaciones(bolean,numero)} >
                                    </Paginar>
                                    :null
                                    }
                                    <Pagination.Next
                                    onClick={() => this.fetchNotificaciones(
                                        true,
                                        parseInt(this.state.txt_texto_numeroPagina)+1,
                                    )}
                                    />
                                </Pagination>
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
                            <Col md={12}>
                                <Form.Group controlId="select.enviara">
                                    <Form.Label>ENVIAR A:</Form.Label>
                                    <Form.Control as="select" className="mb-3" name="selec_crearNotificacion_enviara"  onChange={this.handleChange}>
                                        <option value={"todos"} >TODOS</option>
                                        {/* <option value={"usuario"} >USUARIO</option> */}
                                        <option value={"membresia"} >MEMBRESÍA</option>
                                    </Form.Control>
                                </Form.Group>
                                {/* <Form.Group controlId="input.ntarjetaNotificacion">
                                    <Form.Label>N° TARJETA</Form.Label>
                                    <Form.Control name="txt_crearNotificacion_ntarjeta"  onChange={this.handleChange} />
                                </Form.Group> */}
                                {/* <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="input.correoNotificacion">
                                            <Form.Label>CORREO</Form.Label>
                                            <Form.Control name="txt_crearNotificacion_correo"  onChange={this.handleChange} disabled />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="input.nombreUsuarioNotificacion">
                                            <Form.Label>NOMBRE</Form.Label>
                                            <Form.Control name="txt_crearNotificacion_nombre"  onChange={this.handleChange} disabled/>
                                        </Form.Group>
                                    </Col>
                                </Row> */}
                                {
                                    this.state.selec_crearNotificacion_enviara == false
                                    ?<Form.Group controlId="select.membresia">
                                        <Form.Label>SELECCIONAR MEMBRESÍA:</Form.Label>
                                        <Form.Control as="select" className="mb-3" name="selec_crearNotificacion_membresia"  onChange={this.handleChange}>
                                            {
                                                this.state.tb_membresias.datos
                                                ?this.state.tb_membresias.datos.map((task, posicion) => {
                                                    return (
                                                        <option 
                                                            key   = {posicion}
                                                            value = {task.id} 
                                                        >
                                                            {task.nombre}
                                                        </option>
                                                        // <Form.Check 
                                                        //     key      = {posicion}
                                                        //     type    = "checkbox" 
                                                        //     name     = {posicion} 
                                                        //     onChange = {this.obtenerCambioInputMembresias}
                                                        //     checked = {task.seleccionado}
                                                        //     label   = {task.nombre}
                                                        // />
                                                    );
                                                })
                                                :null
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    :null
                                }
                                <hr/>
                                <Form.Group controlId="input.tituloNotificacion">
                                    <Form.Label>TÍTULO</Form.Label>
                                    <Form.Control name="txt_crearNotificacion_titulo" onChange={this.handleChange} />
                                </Form.Group>
                                <Form.Group controlId="input.mensajeNotificacion">
                                    <Form.Label>Mensaje Notificación</Form.Label>
                                    <Form.Control name="txt_crearNotificacion_mensaje" as="textarea" rows="3" onChange={this.handleChange} />
                                </Form.Group>
                            </Col>
                            <Col>
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
