import React, {Component} from 'react';
import {Row, Col, Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexMembresias extends Component {
    constructor(){
      super();
      this.state = {
        tb_membresias:[],
        boxes:[],
        detallesArray:[],
        nombreCrear:'',
        periodoCrearId: 1,
        ocultoCrearId: 1,
        costoCrear:'',
        detalles:'',

        imagenTarjeta:'',
        imagenCurso:'',
        imagenTarjetaBase:null,
        imagenCursoBase:null,

        idEditar:'',
        nombreEditar:'',
        periodoEditarId: '',
        ocultoEditarId: '',
        costoEditar:'',
        detallesEditar:[],
        //modales
        estadoModalCrearMembresias:false,
        estadoModalEditarMembresias:false
      }
      this.handleChange = this.handleChange.bind(this);
    }
    descargarExcel(){
      Files.exportToCSV(this.state.tb_membresias.datos,"membresias");
    }
    cambiarModalCrearMembresias(){
          this.setState({
            estadoModalCrearMembresias: !this.state.estadoModalCrearMembresias
          })
    }
    cambiarModalEditarMembresias(){
          this.setState({
            estadoModalEditarMembresias: !this.state.estadoModalEditarMembresias
          })
    }

    editarMembresia(id,nombre,periodo,oculto,costo,linkppt,tarjeta,curso,detalles){
      let p
      let o
      if(periodo=="mensual"){
         p = 1
      }
      else if(periodo=="anual"){
         p = 2
      }
      if(oculto=="Si"){
        o = 1
      }
      else if(oculto=="No"){
        o = 2
      }
      if (linkppt==null){
        linkppt =''
      }

      this.setState({
        idEditar:id,
        nombreEditar:nombre,
        periodoEditarId:p,
        ocultoEditarId:o,
        linkpptEditar:linkppt,
        imagenTarjeta:tarjeta,
        imagenCurso:curso,
        costoEditar: costo,
        detallesEditar: detalles
      },()=>this.cambiarModalEditarMembresias())
    }
    clean(){
      this.setState({
        estadoModalCrearMembresias: false,
        estadoModalEditarMembresias: false,
        imagenTarjetaBase:'',
        imagenCursoBase:'',
      },()=>this.fetchMembresias())
    }

    exeEnviarCrear(){
      let a = this.state.boxes
      let b = this.state.detalles
      let r = []
      let oculto
      if(b){
        r.push(b)
      }
      for(let i = 0; i < a.length;i++){
        let z = `this.state.detalles${i}`
        let ok = eval(z)
        if(ok){
          r.push(ok)
        }
      }
      if (this.state.ocultoCrearId == 1){
        oculto = true
      }
      if(this.state.ocultoCrearId == 2){
        oculto = false
      }
      this.setState({
        detallesArray: r,
        ocultoCrearId: oculto
      },()=>this.enviarCrearMembresia())
    }
    exeEnviarEditar(){
      let b = this.state.detallesEditar
      let oculto

      for(let i = 0; i < b.length;i++){
        let z = `this.state.detallesEditar${i}`
        let ok = eval(z)
        if(ok){
          b[i] = ok
        }
      }
      if (this.state.ocultoEditarId == 1){
        oculto = true
      }
      if(this.state.ocultoEditarId == 2){
        oculto = false
      }
      this.setState({
        detallesEditar: b,
        ocultoEditarId: oculto
      },()=>this.enviarEditarMembresia())
    }

    enviarCrearMembresia(){
      fetch(`${Config.api}membresia/crear`,
        {
          mode:'cors',
          method: 'POST',
          body: JSON.stringify({
               nombre: this.state.nombreCrear,
               periodo: this.state.periodoCrearId,
               oculto: this.state.ocultoCrearId,
               costo: this.state.costoCrear,
               linkppt: this.state.linkpptCrear,
               tarjetaImg: this.state.imagenTarjetaBase,
               imagen: this.state.imagenCursoBase,
               detalles: this.state.detallesArray
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
            cogoToast.success("Membresia creada");
            this.clean();
          }
          else{
            cogoToast.error("No se creo,verifique los datos")
          }
      }).catch((error)=> {
        cogoToast.error("No se creo la membresia")
    });
}
    enviarEditarMembresia(){
      fetch(`${Config.api}membresia/editar`,
        {
          mode:'cors',
          method: 'POST',
          body: JSON.stringify({
                    id:this.state.idEditar,
               nombre: this.state.nombreEditar,
               periodo: this.state.periodoEditarId,
               oculto: this.state.ocultoEditarId,
               costo: this.state.costoEditar,
               linkppt: this.state.linkpptEditar,
               tarjetaImg: this.state.imagenTarjetaBase,
               imagen: this.state.imagenCursoBase,
               detalles: this.state.detallesEditar
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
            cogoToast.success("Se edito la membresia")
            this.clean();
          }
          else{
            cogoToast.error("No se edito la membresia")
          }
      }).catch((error)=> {
        cogoToast.error("No se edito la membresia")
    });
}
    eliminarMembresia(){

    }

    addBoxes(){
        let a = this.state.boxes
        if(a.length < 2){
          a.push(1)
          this.setState({
            boxes: a
          })
        }
        else{
          cogoToast.warn("Solo se permiten maximo 3 detalles")
        }

    }
    deleteBoxes(){
        let a = this.state.boxes
        a.pop()
        this.setState({
          boxes: a
        })
    }
    addBoxesEdit(){
        let a = this.state.detallesEditar
        if(a.length < 3){
          a.push('')
          this.setState({
            detallesEditar: a
          })
        }
        else{
          cogoToast.warn("Solo se permiten maximo 3 detalles")
        }
    }
    deleteBoxesEdit(){
        let a = this.state.detallesEditar

        a.pop()
        this.setState({
            detallesEditar: a
          })
    }

    handleChange(e){
      const {name, value} = e.target;
      this.setState({
        [name]: value
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
          if(e.target.name == "imgTarjeta"){
            fileData.onload = (event)=> {
              this.setState({imagenTarjetaBase: fileData.result},
                ()=>{
                    cogoToast.success("Imagen de tarjeta lista")
                  }
                );
              }
          }
          else if (e.target.name == "imgCurso") {
            fileData.onload = (event)=> {
              this.setState({imagenCursoBase: fileData.result},
                ()=>{
                    cogoToast.success("Imagen de curso lista")
                  }
                );
              }
          }
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
            if(data.respuesta==true){
              this.setState({
                tb_membresias: data
              })
            }
        }).catch((error)=> {

      });
    }
    componentDidMount(){
        this.fetchMembresias();
    }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Registro de Membresias' isOption>
                            <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                                <thead>
                                    <tr>
                                        <th><h4 className="card-title">Buscar </h4></th>
                                        <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                        <th><button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.cambiarModalCrearMembresias()}>Crear Membresia</button></th>
                                        <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                    </tr>
                                    <tr>
                                        <th>Nombres</th>
                                        <th>Periodo</th>
                                        <th>Oculto</th>
                                        <th>Costo</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                       {
                                        this.state.tb_membresias.datos ?
                                        this.state.tb_membresias.datos.map(task =>{
                                            return (
                                                <tr key={task.id}>
                                                    <td>{task.nombre}</td>
                                                    <td>{task.periodo}</td>
                                                    <td>{task.oculto}</td>
                                                    <td>{task.costo}</td>
                                                    <td>
                                                      <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.editarMembresia(
                                                          task.id,
                                                          task.nombre,
                                                          task.periodo,
                                                          task.oculto,
                                                          task.costo,
                                                          task.linkPPT,
                                                          task.tarjetaImg,
                                                          task.imagen,
                                                          task.detalles
                                                      )}><i className="fa fa-pencil"/></button>
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
                      show={this.state.estadoModalCrearMembresias}
                      onHide={() => this.cambiarModalCrearMembresias()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Crear Membresia
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-75">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Nombre:</label>
                                              <input type="text" className="form-control" name="nombreCrear" onChange={this.handleChange} />
                                            </div>
                                            <div>
                                              <label>Periodo:</label>
                                              <select className="form-control" name="periodoCrearId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.periodoCrearId}>
                                                  <option key={1} value={1}>Mensual</option>
                                                  <option key={2} value={2}>Anual</option>
                                              </select>
                                            </div>
                                            <div>
                                              <label>Oculto:</label>
                                              <select className="form-control" name="ocultoCrearId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.ocultoCrearId}>
                                                  <option key={1} value={1}>Si</option>
                                                  <option key={2} value={2}>No</option>
                                              </select>
                                            </div>
                                            <div>
                                              <label>Costo:</label>
                                              <input type="text" className="form-control" name="costoCrear" onChange={this.handleChange} />
                                            </div>
                                            <div>
                                              <label>Link de power point:</label>
                                              <input type="text" className="form-control" name="linkpptCrear" onChange={this.handleChange} />
                                            </div>
                                            <label>Imagen de Tarjeta: </label>
                                            <div className="input-group p-1">
                                              <input type="file" className="form-control-file" name="imgTarjeta" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>

                                            <label>Imagen de curso: </label>
                                            <div className="input-group p-1">
                                              <input type="file" className="form-control-file" name="imgCurso" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>

                                            <div className="p-3" >
                                              <label className="p-2">Detalles:</label>
                                                <button type="button" className="btn btn-sm btn-primary" onClick={()=>this.addBoxes()} ><i className="fa fa-plus" ></i></button>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={()=>this.deleteBoxes()} ><i className="fa fa-remove" ></i></button>
                                              <br/>
                                           </div>
                                           <div>
                                              <label>Detalle 1:</label>
                                              <input type="text" className="form-control"  name="detalles" onChange={this.handleChange}></input>
                                              {
                                                this.state.boxes?
                                                this.state.boxes.map((a,index)=>{
                                                    return(
                                                      <div>
                                                        <label>Detalle {index+2}:</label>
                                                        <input type="text" className="form-control"  name={'detalles'+index}  onChange={this.handleChange}></input>
                                                      </div>
                                                    )
                                                }):null
                                              }
                                            </div>
                                            <div className="mx-auto p-4">
                                              <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.exeEnviarCrear()}>Crear Membresia</button>
                                            </div>
                                          </div>
                                    </div>
                                  </div>

                      </Modal.Body>
                    </Modal>
                    <Modal
                        size="lg"
                        show={this.state.estadoModalEditarMembresias}
                        onHide={() => this.cambiarModalEditarMembresias()}
                        >
                        <Modal.Header closeButton>
                          <Modal.Title id="example-custom-modal-styling-title">
                            Editar Membresia
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card w-75">
                                    <div className="modal-body">
                                        <div className="card-body">
                                              <div>
                                                <label>Nombre:</label>
                                                <input type="text" className="form-control" name="nombreEditar" onChange={this.handleChange} defaultValue={this.state.nombreEditar} />
                                              </div>
                                              <div>
                                                <label>Periodo:</label>
                                                <select className="form-control" name="periodoEditarId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.periodoEditarId}>
                                                    <option key={1} value={1}>Mensual</option>
                                                    <option key={2} value={2}>Anual</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label>Oculto:</label>
                                                <select className="form-control" name="ocultoEditarId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.ocultoEditarId}>
                                                    <option key={1} value={1}>Si</option>
                                                    <option key={2} value={2}>No</option>
                                                </select>
                                              </div>
                                              <div>
                                                <label>Costo:</label>
                                                <input type="text" className="form-control" name="costoEditar" onChange={this.handleChange} value={this.state.costoEditar}/>
                                              </div>
                                              <div>
                                                <label>Link de power point:</label>
                                                <input type="text" className="form-control" name="linkpptEditar" onChange={this.handleChange} value={this.state.linkpptEditar}/>
                                              </div>
                                              <label>Imagen de Tarjeta (Actual): </label>
                                              <div className="input-group p-1">
                                                  <img src={this.state.imagenTarjeta} width="400" height="400"/>
                                              </div>

                                              <label>Cambiar la imagen de Tarjeta: </label>
                                              <div className="input-group p-1">
                                                <input type="file" className="form-control-file" name="imgTarjeta" onChange={e =>this.handleChangeFile(e)}/>
                                              </div>

                                              <label>Imagen de Membresía (Actual): </label>
                                              <div className="input-group p-1">
                                                  <img src={this.state.imagenCurso} width="400" height="400"/>
                                              </div>

                                              <label>Cambiar la imagen de Membresía: </label>
                                              <div className="input-group p-1">
                                                <input type="file" className="form-control-file" name="imgCurso" onChange={e =>this.handleChangeFile(e)}/>
                                              </div>

                                              <div className="p-2" >
                                                <label className="p-2">Detalles:</label>
                                                  <button type="button" className="btn btn-sm btn-primary" onClick={()=>this.addBoxesEdit()} ><i className="fa fa-plus" ></i></button>
                                                  <button type="button" className="btn btn-sm btn-danger" onClick={()=>this.deleteBoxesEdit()} ><i className="fa fa-remove" ></i></button>
                                                <br/>
                                              </div>
                                              <div className="p-2">
                                                  {
                                                    this.state.detallesEditar ?
                                                    this.state.detallesEditar.map((a,index)=>{
                                                        return(
                                                          <div>
                                                              <label>Detalle {index+1}:</label>
                                                              <input className="form-control" name={'detallesEditar'+index}  onChange={this.handleChange} defaultValue={a}></input>
                                                          </div>
                                                        )
                                                    }):null
                                                  }
                                              </div>
                                              <div className="mx-auto p-4">
                                                <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.exeEnviarEditar()}>Guardar cambios</button>
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

export default IndexMembresias;
