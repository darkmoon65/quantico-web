import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";

class IndexProductos extends Component {

  constructor(){
    super();
    this.state = {
      tb_productos:[],

      detallesExtras:[],
      tipoCrearId:1,
      productoCrearId:0,
      //modales
      estadoModalCrearProductos:false,
      estadoModalEditarProductos:false,
      imagen:'',

    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalCrearProductos(){
        this.setState({
          estadoModalCrearProductos: !this.state.estadoModalCrearProductos
        })
  }
  cambiarModalEditarProductos(){
        this.setState({
          estadoModalEditarProductos: !this.state.estadoModalEditarProductos
        })
  }


    clean(){
      this.setState({
        estadoModalCrearProductos: false,
        estadoModalEditarProductos: false,

      },()=>this.fetchProductos())
    }
    exeEnviar(){
    let a = this.state.countMembresia
    let r = []
    for(let i = 0; i <= a.length;i++){
      let z = `this.state.descuento${i}`
      let ok = eval(z)
      if(ok){
        r.push({
          membresia: i,
          porcentaje: ok
        })
      }
    }
    let z = this.state.productoCrearId
    if(z == 0){
      z = true
    }else{
      z = false
    }
    this.setState({
      descuentosArray: r,
      productoCrearId: z
    },()=>this.enviarCrearProducto())
  }

    membresiaCount(){
      let a = this.state.tb_membresias
      let r = []
      a.map((b,index)=>{
        r.push(index)
      })
      this.setState({
        countMembresia: r
      },()=>console.log(this.state.countMembresia))
    }

    enviarCrearProducto(){
      if(this.state.tipoCrearId == 2){
        fetch('http://107.23.50.10/productos/crear',
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
              tipo : this.state.tipoCrearId,
              prodPropio: this.state.productoCrearId,
              nombre: this.state.nombreCrear,
              descripcion: this.state.descripcionCrear,
              costo: this.state.costoCrear,
              imagen: this.state.imagen,
              descuentos: this.state.descuentosArray
              }
            ),
            headers: {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            }
          }
        )
          .then(res =>res.json())
          .then(data => {
            if(data.respuesta==true){
              cogoToast.success("Producto creado");
              this.clean();
            }
            else{
              console.log(data)
              cogoToast.error("No se creo,verifique los datos")
              console.log("hubo un error con la peticion")
            }
        }).catch((error)=> {
          cogoToast.error("No se creo el producto")
          console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
    }
    if (this.state.tipoCrearId == 1 || this.state.tipoCrearId == 3){
          fetch('http://107.23.50.10/productos/crear',
            {
              mode:'cors',
              method: 'POST',
              body: JSON.stringify({
                  tipo : this.state.tipoCrearId,
                  prodPropio: this.state.productoCrearId,
                  nombre: this.state.nombreCrear,
                  descripcion: this.state.descripcionCrear,
                  costo: this.state.costoCrear,
                  imagen: this.state.imagen,
                  descuentos: this.state.descuentosArray,
                  expositor: this.state.expositorCrear,
                  duracion: this.state.duracionCrear,
                  horaInicio: this.state.horaInicioCrear,
                  horaFin: this.state.horaFinCrear,
                  inicio: this.state.fechaInicioCrear,
                  fin: this.state.fechaFinCrear
                }
              ),
              headers: {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json'
              }
            }
          )
            .then(res =>res.json())
            .then(data => {
              if(data.respuesta==true){
                cogoToast.success("Producto creada");
                this.clean();
              }
              else{
                console.log(data)
                cogoToast.error("No se creo,verifique los datos")
                console.log("hubo un error con la peticion")
              }
          }).catch((error)=> {
            cogoToast.error("No se creo el producto")
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
    }


    }
    eliminarProducto(id){

        fetch('http://107.23.50.10/productos/eliminar',
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                id: id
              }
            ),
            headers: {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            }
          }
        )
          .then(res =>res.json())
          .then(data => {
            if(data.respuesta==true){
              cogoToast.success("Producto Eliminado");
              this.clean();
            }
            else{
              console.log(data)
              cogoToast.error("No se pudo eliminar el producto")
              console.log("hubo un error con la peticion")
            }
        }).catch((error)=> {
          cogoToast.error("No se pudo eliminar el producto")
          console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
    }
    editarProducto(){

    }
    fetchProductos(){
      fetch('http://107.23.50.10/productos/mostrar',
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'Accept' : 'application/json',
              'Content-type' : 'application/json'
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data){
            this.setState({
              tb_productos: data
            },()=>{console.log(this.state.tb_productos)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
    fetchMembresias(){
        fetch('http://107.23.50.10/membresia/mostrar',
          {
            mode:'cors',
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            }
          }
        )
          .then(res =>res.json())
          .then(data => {
            if(data){
              this.setState({
                tb_membresias: data
              },()=>{
                console.log(this.state.tb_membresias);
                this.membresiaCount();
              })
            }
            else{
              console.log(data)
              console.log("hubo un error con la peticion")
            }
        }).catch((error)=> {
          console.log('Hubo un problema con la petición Fetch:' + error.message);
      });  }

    handleChange(e){
      const {name, value} = e.target;
      if(name == "tipoCrearId"){
        if(value==1){
          this.setState({detallesExtras:[1]})
        }
        if(value==2){
          this.setState({detallesExtras:[0]})
        }
        if(value==3){
          this.setState({detallesExtras:[1]})
        }
      }

      this.setState({
        [name]: value
      },()=>{
        console.log(value)
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
                    console.log(this.state.imagen)
                    }
                );
              }
    }

    componentDidMount(){
      this.fetchProductos();
      this.fetchMembresias();
      console.log(localStorage.getItem('token'));
    }


    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Registro de productos' isOption>
                          <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                              <thead>
                                  <tr>
                                      <th><h4 className="card-title">Buscar </h4></th>
                                      <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                      <th><button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.cambiarModalCrearProductos()}>Crear Producto</button></th>
                                  </tr>
                                  <tr>
                                      <th>Tipo</th>
                                      <th>Nombre</th>
                                      <th>Costo</th>
                                  </tr>
                                </thead>
                                <tbody>
                                     {
                                      this.state.tb_productos.data ?
                                      this.state.tb_productos.data.map(task =>{
                                          return (
                                              <tr key={task.id}>
                                                  <td>{task.tipo}</td>
                                                  <td>{task.nombre}</td>
                                                  <td>{task.costo}</td>
                                                  <td>
                                                    <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.editarProducto(
                                                        task.id,
                                                        task.nombre,
                                                        task.costo,
                                                    )}><i className="feather icon-trending-up"/></button>
                                                    <button className="btn btn-sm btn-danger "  type="button" onClick={()=>this.eliminarProducto(task.id)}>
                                                      <i className="fa fa-trash" ></i>
                                                    </button>
                                                  </td>
                                              </tr>
                                          );
                                      } )   : null
                                  }
                              </tbody>
                          </table>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    size="lg"
                    show={this.state.estadoModalCrearProductos}
                    onHide={() => this.cambiarModalCrearProductos()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Producto
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-75">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Tipo:</label>
                                            <select className="form-control" name="tipoCrearId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.tipoCrearId}>
                                                <option key={1} value={1}>Curso</option>
                                                <option key={2} value={2}>Libro</option>
                                                <option key={3} value={3}>Evento</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label>Producto propio:</label>
                                            <select className="form-control" name="productoCrearId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.productoCrearId}>
                                                <option key={1} value={0}>Si</option>
                                                <option key={2} value={1}>No</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label>Nombre:</label>
                                            <input type="text" className="form-control" name="nombreCrear" onChange={this.handleChange} />
                                          </div>
                                          <div>
                                            <label>Descripcion:</label>
                                            <textarea name="descripcionCrear" cols="50" rows="5" onChange={this.handleChange}></textarea>
                                          </div>
                                          <div>
                                            <label>Costo:</label>
                                            <input type="text" className="form-control" name="costoCrear" onChange={this.handleChange} />
                                          </div>
                                          <label>Imagen: </label>
                                          <div className="input-group p-1">
                                            <input type="file" className="form-control-file" name="imagen" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>

                                            {
                                                (this.state.detallesExtras==1) ?
                                                this.state.detallesExtras.map((a,index)=>{
                                                return(
                                                  <div key={index} >
                                                    <div>
                                                      <label>Expositor:</label>
                                                      <input type="text" className="form-control" name="expositorCrear" onChange={this.handleChange} />
                                                    </div>
                                                    <div>
                                                      <label>Duracion:</label>
                                                      <input type="text" className="form-control" name="duracionCrear" onChange={this.handleChange} />
                                                    </div>
                                                    <div>
                                                      <label>Hora inicio:</label>
                                                      <input type="time" className="form-control" name="horaInicioCrear" onChange={this.handleChange} />
                                                    </div>
                                                    <div>
                                                      <label>Hora Fin:</label>
                                                      <input type="time" className="form-control" name="horaFinCrear" onChange={this.handleChange} />
                                                    </div>
                                                    <div>
                                                      <label>Fecha de inicio:</label>
                                                      <input type="date" className="form-control" name="fechaInicioCrear" onChange={this.handleChange} />
                                                    </div>
                                                    <div>
                                                      <label>Fecha de fin:</label>
                                                      <input type="date" className="form-control" name="fechaFinCrear" onChange={this.handleChange} />
                                                    </div>
                                                  </div>
                                                )
                                              }):null
                                            }
                                            <div className="p-2">
                                              <label>Descuentos: </label><br/>
                                                <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Descuento(%)</th>
                                                        </tr>
                                                    </thead>
                                                  <tbody>
                                                  {
                                                   this.state.tb_membresias ?
                                                   this.state.tb_membresias.map(task =>{
                                                       return (
                                                           <tr key={task.id}>
                                                               <td>{task.nombre}</td>
                                                               <td><input type="number" style={{width:'50px'}} name={'descuento'+task.id} onChange={this.handleChange}></input></td>
                                                           </tr>
                                                       );
                                                   } )   : null
                                                  }
                                                </tbody>
                                              </table>
                                          </div>
                                          <div className="mx-auto p-3">
                                            <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.exeEnviar()}>Crear</button>
                                          </div>
                                        </div>
                                  </div>
                                </div>

                    </Modal.Body>
                  </Modal>

            </Aux>
        );
    }
}

export default IndexProductos;
