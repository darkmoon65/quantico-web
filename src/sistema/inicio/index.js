import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Config from "../../config"


class IndexInicio extends Component {

  comprobar(){
    fetch(`${Config.api}verificaciones/totales`,
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
         .then(res=>{
               if (res.status==401){
                 localStorage.removeItem('token')
                 window.location.href="/"
               }
            }
          ).catch((error)=> {

            });
  }
  componentDidMount(){
    this.comprobar();
  }
  render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <p>Quantico</p>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default IndexInicio;
