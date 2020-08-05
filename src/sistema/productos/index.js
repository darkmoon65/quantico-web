import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config";
import Files from "../../files";
import Paginar from "../../paginate"

class IndexProductos extends Component {

  constructor(){
    super();
    this.state = {
      tb_productos:[],
      tb_tipoProductos:[],
      tb_membresias:[],
      tb_cursosPre:[],
      detallesExtras:[],
      tipoCrearId:'',
      productoCrearId:'',
      //modales
      estadoModalCrearProductos:false,
      estadoModalEditarProductos:false,
      estadoModalCrearTipoProductos:false,
      imagen:'',

    }
    this.handleChange = this.handleChange.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_productos.data,"productos");
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
        tipoCrearId : '',
        prodPropio: '',
        nombre: '',
        descripcion: '',
        costo: '',
        imagen: '',
        descuentos: '',
        expositor: '',
        duracion: '',
        horaInicio: '',
        horaFin: '',
        inicio: '',
        fin: '',
        preCrearId:'',
        descuentosArray:[]
      },()=>this.fetchProductos())
    }

    exeEnviar(ope){
    let a = this.state.countMembresia
    let r = []

    if(ope=="crear"){
      for(let i = 1; i <= a.length;i++){
        let z = `this.state.descuento${i}`
        let ok = eval(z)
        if(ok){
          r.push({
            membresia: i,
            porcentaje: ok
          })
        }
      }
    }
    else if (ope=="editar") {
      for(let i = 1; i <= a.length;i++){
        let z = `this.state.descuento${i}`
        let ok = eval(z)
        if(ok){
          r.push({
            membresia: i,
            porcentaje: ok
          })
        }else{
          r.push({
            membresia: i,
            porcentaje: 0
          })
        }

      }
    }

    let z = this.state.productoCrearId
    if(z == 0){
      z = false
    }else{
      z = true
    }
    if (ope=="crear"){
      this.setState({
        descuentosArray: r,
        productoCrearId: z
      },()=>this.enviarCrearProducto())
    }else if (ope=="editar") {
      this.setState({
        descuentosArray: r,
        productoCrearId: z
      },()=>this.enviarEditarProducto())
    }

  }

    membresiaCount(){
      let a = this.state.tb_membresias.datos
      let r = []
      a.map((b,index)=>{
        r.push(b.id)
      })
      this.setState({
        countMembresia: r
      },()=>console.log(this.state.countMembresia))
    }

    enviarCrearProducto(){
      if(this.state.tipoCrearId == 2){
        fetch(`${Config.api}productos/crear`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
              tipo : this.state.tipoCrearId,
              prodPropio: this.state.productoCrearId,
              nombre: this.state.nombreCrear,
              descripcion: this.state.descripcionCrear,
              costo: this.state.costoCrear,
              imagen: this.state.imagenProducto,
              imagenExpositor: this.state.imagenExpositor,
              linkppt: this.state.linkppt,
              linkSala: this.state.linkSala,
              descuentos: this.state.descuentosArray,
              expositor: this.state.expositorCrear
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
    else {
          fetch(`${Config.api}productos/crear`,
            {
              mode:'cors',
              method: 'POST',
              body: JSON.stringify({
                  tipo : this.state.tipoCrearId,
                  prodPropio: this.state.productoCrearId,
                  nombre: this.state.nombreCrear,
                  descripcion: this.state.descripcionCrear,
                  costo: this.state.costoCrear,
                  imagen: this.state.imagenProducto,
                  imagenExpositor: this.state.imagenExpositor,
                  descuentos: this.state.descuentosArray,
                  expositor: this.state.expositorCrear,
                  duracion: this.state.duracionCrear,
                  horaInicio: this.state.horaInicioCrear,
                  horaFin: this.state.horaFinCrear,
                  inicio: this.state.fechaInicioCrear,
                  fin: this.state.fechaFinCrear,
                  linkppt: this.state.linkppt,
                  linkSala: this.state.linkSala,
                  prerrequisito: this.state.preCrearId
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
    enviarEditarProducto(){
      if(this.state.tipoEditarId == 2){
        fetch(`${Config.api}productos/editar`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
              id: this.state.id,
              tipo : this.state.tipoEditarId,
              prodPropio: this.state.productoEditarId,
              nombre: this.state.nombreEditar,
              descripcion: this.state.descripcionEditar,
              costo: this.state.costoEditar,
              imagen: this.state.imagenProducto,
              imagenExpositor: this.state.imagenExpositor,
              descuentos: this.state.descuentosArray,
              expositor: this.state.expositorEditar,
              linkSala: this.state.linkSalaEditar,
              linkppt: this.state.linkpptEditar
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
    else {
          fetch(`${Config.api}productos/editar`,
            {
              mode:'cors',
              method: 'POST',
              body: JSON.stringify({
                  id : this.state.id,
                  tipo : this.state.tipoEditarId,
                  prodPropio: this.state.productoEditarId,
                  nombre: this.state.nombreEditar,
                  descripcion: this.state.descripcionEditar,
                  costo: this.state.costoEditar,
                  imagen: this.state.imagenProducto,
                  imagenExpositor: this.state.imagenExpositor,
                  descuentos: this.state.descuentosArray,
                  expositor: this.state.expositorEditar,
                  duracion: this.state.duracionEditar,
                  horaInicio: this.state.horaInicioEditar,
                  horaFin: this.state.horaFinEditar,
                  inicio: this.state.fechaInicioEditar,
                  fin: this.state.fechaFinEditar,
                  linkppt: this.state.linkpptEditar,
                  linkSala: this.state.linkSalaEditar,
                  prerrequisito: this.state.preEditarId
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

    editarProducto(id,nombre,tipoId,costo,datosExtra,descuentos){
      let prodPropio = datosExtra.prodPropio;
      let prerequisito = datosExtra.prerequisito ;
      let descripcion = datosExtra.descripcion;
      let expositor = datosExtra.expositor;
      let imagenExpositor = datosExtra.imagenExpositor;
      let duracion = datosExtra.duracion;
      let horaInicio = datosExtra.horaInicio;
      let horaFin = datosExtra.horaFin;
      let inicio = datosExtra.inicio;
      let fin = datosExtra.fin;
      let imagen = datosExtra.imagen;
      let linkppt = datosExtra.linkPPT;
      let linkSala = datosExtra.linkSala;

      if(tipoId==2){
        this.setState({detallesExtras:[0]})
      }
      else{
          this.setState({detallesExtras:[1]})
      }
      if(descuentos){
         let descuentoNew=[];
         descuentos.map((data,index)=>{
              descuentoNew[data.membresia] = data.porcentaje
         })

        this.setState({
          descuento1:descuentoNew[1],
          descuento2:descuentoNew[2],
          descuento3:descuentoNew[3],
          descuento4:descuentoNew[4],
          descuento5:descuentoNew[5],
          descuento6:descuentoNew[6],
          descuento7:descuentoNew[7]
        })
      }

      this.setState({
          id:id,
          nombreEditar:nombre,
          tipoEditarId:tipoId,
          costoEditar:costo,
          productoEditarId: prodPropio,
          preEditarId: prerequisito,
          descripcionEditar: descripcion,
          expositorEditar: expositor,
          imagenExpositorVer: imagenExpositor,
          duracionEditar : duracion,
          horaInicioEditar : horaInicio,
          horaFinEditar : horaFin,
          fechaInicioEditar : inicio,
          fechaFinEditar : fin,
          imagenVer : imagen,
          linkpptEditar : linkppt,
          linkSalaEditar : linkSala
      },()=>this.cambiarModalEditarProductos())
    }

    eliminarProducto(id){

        fetch(`${Config.api}productos/eliminar`,
          {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({
                id: id
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
    tablaPulirPre(){
      let nuevo = []
      nuevo = this.state.tb_productos
      let array = []
      nuevo.data.map((data)=>{
         if(data.tipo=="Curso"){
           array.push({
             id: data.id,
             nombre: data.nombre
           })
         }
      })
      this.setState({
        tb_cursosPre: array
      })
    }
    fetchProductos(bolean,numero){
      fetch(`${Config.api}productos/mostrar?page=${numero}`,
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
          if(data){
            this.setState({
              tb_productos: data,
              var_texto_numeroPagina: numero
            },()=>{
              console.log(this.state.tb_productos);
              this.tablaPulirPre();

            })
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
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
            if(data.respuesta==true){
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

    fetchTipoProductos(){
          fetch(`${Config.api}productos/mostrarTipos`,
            {
              mode:'cors',
              method: 'GET',
              headers: {
                  'Accept' : 'application/json',
                  'Content-type' : 'application/json',
                  'estado': '3',
                  'api_token': localStorage.getItem('token')
              }
            }
          )
            .then(res =>res.json())
            .then(data => {
              if(data.respuesta==true){
                console.log(data)
                this.setState({
                  tb_tipoProductos: data
                },()=>{console.log(this.state.tb_tipoProductos)})
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
        if(value==2 || value==''){
          this.setState({detallesExtras:[0]})
        }
        else{
            this.setState({detallesExtras:[1]})
        }
      }
      if(name == "tipoEditarId"){
        if(value==2 || value==''){
          this.setState({
            detallesExtras:[0],
          })
        }
        else{
            this.setState({
              detallesExtras:[1],
            })
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
          if(e.target.name == "imagenProducto"){
            fileData.onload = (event)=> {
              this.setState({imagenProducto: fileData.result},
                ()=>{
                    cogoToast.success("Imagen de producto lista")
                  }
                );
              }
          }
          else if (e.target.name == "imagenExpositor") {
            fileData.onload = (event)=> {
              this.setState({imagenExpositor: fileData.result},
                ()=>{
                    cogoToast.success("Imagen de expositor lista")
                  }
                );
              }
          }
    }

    componentDidMount(){
      this.fetchProductos(true,1);
      this.fetchTipoProductos();
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
                                      <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
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
                                                    <button className="btn btn-sm btn-primary "  type="button" onClick={()=>this.editarProducto(
                                                      task.id,
                                                      task.nombre,
                                                      task.tipoId,
                                                      task.costo,
                                                      task.datosExtra,
                                                      task.descuentos
                                                    )}>
                                                      <i className="fa fa-pencil" ></i>
                                                    </button>
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
                          <div className="float-right">
                                <Pagination  >
                                  <Pagination.Prev
                                      onClick={() => {
                                        this.fetchProductos(
                                          true,
                                          this.state.var_texto_numeroPagina-1,
                                      )

                                    }}
                                  />
                                      {
                                         <Paginar data={this.state.tb_productos} fetch={(bolean,numero)=>this.fetchProductos(bolean,numero)} ></Paginar>
                                      }
                                  <Pagination.Next
                                      onClick={() => {
                                        this.fetchProductos(
                                          true,
                                          this.state.var_texto_numeroPagina+1,

                                        )

                                      }}
                                  />
                              </Pagination>
                              </div>

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
                                                <option key={0} value={null}>--escoge una opcion--</option>
                                                {
                                                this.state.tb_tipoProductos.datos?
                                                this.state.tb_tipoProductos.datos.map((data,index)=>{
                                                 return(
                                                    <option key={data.id} value={data.id}>{data.nombre}</option>
                                                 )
                                               }):null
                                                }

                                            </select>
                                          </div>
                                          <div>
                                            <label>Prerequisito:</label>
                                            <select className="form-control" name="preCrearId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.preCrearId}>
                                                <option key={0} value={null}>--escoge una opcion--</option>
                                                {
                                                this.state.tb_cursosPre?
                                                this.state.tb_cursosPre.map((data,index)=>{
                                                 return(
                                                    <option key={data.id} value={data.id}>{data.nombre}</option>
                                                 )
                                                }):null
                                                }

                                            </select>
                                          </div>
                                          <div>
                                            <label>Producto propio:</label>
                                            <select className="form-control" name="productoCrearId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.productoCrearId}>
                                                <option key={0} value={null}>--escoge una opcion--</option>
                                                <option key={1} value={1}>Si</option>
                                                <option key={2} value={0}>No</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label>Nombre:</label>
                                            <input type="text" className="form-control" name="nombreCrear" onChange={this.handleChange} />
                                          </div>
                                          <div>
                                            <label>Descripcion:</label>
                                            <input type="text" className="form-control" name="descripcionCrear" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Costo:</label>
                                            <input type="number" min="0" className="form-control" name="costoCrear" onChange={this.handleChange} />
                                          </div>
                                          <label>Imagen de producto: </label>
                                          <div className="input-group p-1">
                                            <input type="file" className="form-control-file" name="imagenProducto" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                          <div>
                                            <label>Expositor:</label>
                                            <input type="text" className="form-control" name="expositorCrear" onChange={this.handleChange} />
                                          </div>
                                          <div className="p-2">
                                            <label>Imagen de expositor:</label>
                                            <input type="file" className="form-control-file" name="imagenExpositor" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                            {
                                                (this.state.detallesExtras==1) ?
                                                this.state.detallesExtras.map((a,index)=>{
                                                return(
                                                  <div key={index} >
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
                                            <div>
                                              <label>Link de power point:</label>
                                              <input type="text" className="form-control" name="linkppt" onChange={this.handleChange} />
                                            </div>
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
                                                   this.state.tb_membresias.datos ?
                                                   this.state.tb_membresias.datos.map(task =>{
                                                       return (
                                                           <tr key={task.id}>
                                                               <td>{task.nombre}</td>
                                                               <td><input type="number" style={{width:'50px'}} min="0" max="100" name={'descuento'+task.id} onChange={this.handleChange}></input></td>
                                                           </tr>
                                                       );
                                                   } )   : null
                                                  }
                                                </tbody>
                                              </table>
                                          </div>
                                          <div className="mx-auto p-3">
                                            <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.exeEnviar("crear")}>Crear producto</button>
                                          </div>
                                        </div>
                                  </div>
                                </div>

                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarProductos}
                      onHide={() => this.cambiarModalEditarProductos()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Editar Producto
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-75">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Tipo:</label>
                                              <select className="form-control" name="tipoEditarId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.tipoEditarId}>
                                                  <option key={0} value={null}>--escoge una opcion--</option>
                                                  {
                                                  this.state.tb_tipoProductos.datos?
                                                  this.state.tb_tipoProductos.datos.map((data,index)=>{
                                                   return(
                                                      <option key={data.id} value={data.id}>{data.nombre}</option>
                                                   )
                                                 }):null
                                                  }

                                              </select>
                                            </div>
                                            <div>
                                              <label>Prerequisito:</label>
                                              <select className="form-control" name="preEditarId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.preEditarId}>
                                                  <option key={0} value={null}>--escoge una opcion--</option>
                                                  {
                                                  this.state.tb_cursosPre?
                                                  this.state.tb_cursosPre.map((data,index)=>{
                                                   return(
                                                      <option key={data.id} value={data.id}>{data.nombre}</option>
                                                   )
                                                  }):null
                                                  }

                                              </select>
                                            </div>
                                            <div>
                                              <label>Producto propio:</label>
                                              <select className="form-control" name="productoEditarId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.productoEditarId}>
                                                  <option key={0} value={null}>--escoge una opcion--</option>
                                                  <option key={1} value={1}>Si</option>
                                                  <option key={2} value={0}>No</option>
                                              </select>
                                            </div>
                                            <div>
                                              <label>Nombre:</label>
                                              <input type="text" className="form-control" name="nombreEditar" onChange={this.handleChange} defaultValue={this.state.nombreEditar}/>
                                            </div>
                                            <div>
                                              <label>Descripcion:</label>
                                              <input type="text" className="form-control" name="descripcionEditar" onChange={this.handleChange} defaultValue={this.state.descripcionEditar}/>
                                            </div>
                                            <div>
                                              <label>Costo:</label>
                                              <input type="number" min="0" className="form-control" name="costoEditar" onChange={this.handleChange} defaultValue={this.state.costoEditar}/>
                                            </div>
                                            <label>Imagen de producto: </label>
                                            <div className="input-group p-1">
                                              <input type="file" className="form-control-file" name="imagenProducto" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>
                                            <div>
                                              <label>Expositor:</label>
                                              <input type="text" className="form-control" name="expositorEditar" onChange={this.handleChange} defaultValue={this.state.expositorEditar}/>
                                            </div>
                                            <div className="p-2">
                                              <label>Imagen de expositor:</label>
                                              <input type="file" className="form-control-file" name="imagenExpositor" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>
                                              {
                                                  (this.state.detallesExtras==1) ?
                                                  this.state.detallesExtras.map((a,index)=>{
                                                  return(
                                                    <div key={index} >
                                                      <div>
                                                        <label>Duracion:</label>
                                                        <input type="text" className="form-control" name="duracionEditar" onChange={this.handleChange} defaultValue={this.state.duracionEditar} />
                                                      </div>
                                                      <div>
                                                        <label>Hora inicio:</label>
                                                        <input type="time" className="form-control" name="horaInicioEditar" onChange={this.handleChange} defaultValue={this.state.horaInicioEditar} />
                                                      </div>
                                                      <div>
                                                        <label>Hora Fin:</label>
                                                        <input type="time" className="form-control" name="horaFinEditar" onChange={this.handleChange} defaultValue={this.state.horaFinEditar} />
                                                      </div>
                                                      <div>
                                                        <label>Fecha de inicio:</label>
                                                        <input type="date" className="form-control" name="fechaInicioEditar" onChange={this.handleChange} defaultValue={this.state.fechaInicioEditar} />
                                                      </div>
                                                      <div>
                                                        <label>Fecha de fin:</label>
                                                        <input type="date" className="form-control" name="fechaFinEditar" onChange={this.handleChange} defaultValue={this.state.fechaFinEditar}/>
                                                      </div>
                                                    </div>
                                                  )
                                                }):null
                                              }
                                              <div>
                                                <label>Link de power point:</label>
                                                <input type="text" className="form-control" name="linkpptEditar" onChange={this.handleChange} defaultValue={this.state.linkpptEditar}/>
                                              </div>
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
                                                     this.state.tb_membresias.datos ?
                                                     this.state.tb_membresias.datos.map(task =>{
                                                         return (
                                                             <tr key={task.id}>
                                                                 <td>{task.nombre}</td>
                                                                 <td><input type="number" style={{width:'50px'}} min="0" max="100" name={'descuento'+task.id} onChange={this.handleChange} defaultValue={this.state['descuento'+task.id]}></input></td>
                                                             </tr>
                                                         );
                                                     } )   : null
                                                    }
                                                  </tbody>
                                                </table>
                                            </div>
                                            <div className="mx-auto p-3">
                                              <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.exeEnviar("editar")}>Guardar cambios</button>
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
