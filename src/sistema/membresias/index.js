import React, {Component} from 'react';
import {Row, Col, Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";

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

        idEditar:'',
        nombreEditar:'',
        periodoEditarId: 1,
        ocultoEditarId: 1,
        costoEditar:'',
        detallesEditar:[],
        //modales
        estadoModalCrearMembresias:false,
        estadoModalEditarMembresias:false
      }
      this.handleChange = this.handleChange.bind(this);
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

    editarMembresia(id,nombre,periodo,oculto,costo,tarjeta,curso,detalles){
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

      this.setState({
        idEditar:id,
        nombreEditar:nombre,
        periodoEditarId:p,
        ocultoEditarId:o,
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

      },()=>this.fetchMembresias())
    }

    exeEnviar(){
      let a = this.state.boxes
      let b = this.state.detalles
      let r = []
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
      this.setState({
        detallesArray: r
      },()=>this.enviarCrearMembresia())
    }
    exeEnviarEditar(){
      let b = this.state.detallesEditar

      for(let i = 0; i < b.length;i++){
        let z = `this.state.detallesEditar${i}`
        let ok = eval(z)
        if(ok){
          b[i] = ok
        }
      }
      this.setState({
        detallesEditar: b
      },this.enviarEditarMembresia())
    }

    enviarCrearMembresia(){
      fetch('http://107.23.50.10/membresia/crear',
        {
          mode:'cors',
          method: 'POST',
          body: JSON.stringify({
               nombre: this.state.nombreCrear,
               periodo: this.state.periodoCrearId,
               oculto: this.state.ocultoCrearId,
               costo: this.state.costoCrear,
               tarjetaImg: this.state.imagenTarjeta,
               imagen: this.state.imagenCurso,
               detalles: this.state.detallesArray
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
            cogoToast.success("Membresia creada");
            this.clean();
          }
          else{
            console.log(data)
            cogoToast.error("No se creo,verifique los datos")
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        cogoToast.error("No se creo la membresia")
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
}
    enviarEditarMembresia(){
  fetch('http://107.23.50.10/membresia/editar',
    {
      mode:'cors',
      method: 'POST',
      body: JSON.stringify({
                id:this.state.idEditar,
           nombre: this.state.nombreEditar,
           periodo: this.state.periodoEditarId,
           oculto: this.state.ocultoEditarId,
           costo: this.state.costoEditar,
           tarjetaImg: this.state.imagenTarjeta,
           imagen: this.state.imagenCurso,
           detalles: this.state.detallesEditar
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
        cogoToast.success("Se edito la membresia")
        this.clean();
      }
      else{
        console.log(data)
        cogoToast.error("No se edito la membresia")
        console.log("hubo un error con la peticion")
      }
  }).catch((error)=> {
    cogoToast.error("No se edito la membresia")
    console.log('Hubo un problema con la petición Fetch:' + error.message);
});
}
    eliminarMembresia(){

    }

    addBoxes(){
        let a = this.state.boxes
        a.push(1)
        this.setState({
          boxes: a
        },()=>console.log(this.state.boxes))
    }
    deleteBoxes(){
        let a = this.state.boxes
        a.pop()
        this.setState({
          boxes: a
        },()=>console.log(this.state.boxes))
    }
    addBoxesEdit(){
        let a = this.state.detallesEditar
        a.push(1)
        this.setState({
          detallesEditar: a
        },()=>console.log(this.state.detallesEditar))
    }
    deleteBoxesEdit(){
        let a = this.state.detallesEditar
        a.pop()
        this.setState({
          detallesEditar: a
        },()=>console.log(this.state.detallesEditar))
    }

    handleChange(e){
      const {name, value} = e.target;
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
          if(e.target.name == "imgTarjeta"){
            fileData.onload = (event)=> {
              this.setState({imagenTarjeta: fileData.result},
                ()=>{
                    cogoToast.success("Imagen de tarjeta lista")
                  }
                );
              }
          }
          else if (e.target.name == "imgCurso") {
            fileData.onload = (event)=> {
              this.setState({imagenCurso: fileData.result},
                ()=>{
                    cogoToast.success("Imagen de curso lista")
                  }
                );
              }
          }
      }

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
              },()=>{console.log(this.state.tb_membresias)})
            }
            else{
              console.log(data)
              console.log("hubo un error con la peticion")
            }
        }).catch((error)=> {
          console.log('Hubo un problema con la petición Fetch:' + error.message);
      });  }
    componentDidMount(){
        this.fetchMembresias();
        console.log(localStorage.getItem('token'));
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
                                        this.state.tb_membresias ?
                                        this.state.tb_membresias.map(task =>{
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
                                                          task.tarjetaImg,
                                                          task.imagen,
                                                          task.detalles
                                                      )}><i className="feather icon-trending-up"/></button>
                                                      <button className="btn btn-sm btn-danger "  type="button" onClick={()=>this.eliminarMembresia(task.id)}>
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
                                            <label>Imagen de Tarjeta: </label>
                                            <div className="input-group p-1">
                                              <input type="file" className="form-control-file" name="imgTarjeta" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>
                                            <label>Imagen de curso: </label>
                                            <div className="input-group p-1">
                                              <input type="file" className="form-control-file" name="imgCurso" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>

                                            <div className="p-2" >
                                              <label>Detalles:</label>
                                              <button type="button" className="btn btn-sm btn-primary" onClick={()=>this.addBoxes()} ><i className="fa fa-plus" ></i></button>
                                              <button type="button" className="btn btn-sm btn-danger" onClick={()=>this.deleteBoxes()} ><i className="fa fa-remove" ></i></button>
                                              <br/>

                                              <textarea name="detalles" cols="50" rows="6" onChange={this.handleChange}></textarea>
                                              {
                                                this.state.boxes?
                                                this.state.boxes.map((a,index)=>{
                                                    return(
                                                      <textarea name={'detalles'+index} cols="50" rows="6" onChange={this.handleChange}></textarea>
                                                    )
                                                }):null
                                              }
                                            </div>
                                            <div className="mx-auto" style={{padding:'4'}}>
                                              <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.exeEnviar()}>Crear</button>
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
                                              <label>Imagen de Tarjeta: </label>
                                              <div className="input-group p-1">
                                                <input type="file" className="form-control-file" name="imgTarjeta" onChange={e =>this.handleChangeFile(e)}/>
                                              </div>
                                              <label>Imagen de curso: </label>
                                              <div className="input-group p-1">
                                                <input type="file" className="form-control-file" name="imgCurso" onChange={e =>this.handleChangeFile(e)}/>
                                              </div>

                                              <div className="p-2" >
                                                <label>Detalles:</label>
                                                <button type="button" className="btn btn-sm btn-primary" onClick={()=>this.addBoxesEdit()} ><i className="fa fa-plus" ></i></button>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={()=>this.deleteBoxesEdit()} ><i className="fa fa-remove" ></i></button>
                                                <br/>
                                                  {
                                                    this.state.detallesEditar ?
                                                    this.state.detallesEditar.map((a,index)=>{
                                                        return(
                                                          <textarea name={'detallesEditar'+index} cols="50" rows="6" onChange={this.handleChange} defaultValue={a}></textarea>
                                                        )
                                                    }):null
                                                  }
                                              </div>
                                              <div className="mx-auto" style={{padding:'4'}}>
                                                <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.exeEnviarEditar()}>Crear</button>
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
