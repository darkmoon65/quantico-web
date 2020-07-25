import React,{Component} from 'react';
import {Pagination} from 'react-bootstrap';

class Paginar extends Component {
    constructor(){
      super();
      this.state = {
      }
    }

paginar(
    totalDatos,             // TOTAL DE TODOS LO DATOS 
    totalPorPagina,         // TOTAL QUE RECIBE EN CADA PAGINA (10)
    paginaSeleccionada,     // EL NUMERO DE LA PAGINA QUE SE ENCUENTRA 
){
    let totalPaginas = Math.ceil(totalDatos/totalPorPagina);
    let pagina = []

    let primeraPagina = 1;
    let segundaPagina = primeraPagina+1;
    let terceraPagina = segundaPagina+1;
    let cuartaPagina  = terceraPagina+1;

    let anteriorPaginaSeleccionada   = paginaSeleccionada-1;
    let siguientePaginaSeleccionada  = paginaSeleccionada+1;

    let ultimaPagina        = totalPaginas;
    let penultimaPagina     = ultimaPagina-1;
    let antePenultimaPagina = penultimaPagina-1;

    for (let i = 1; i <= totalPaginas; i++) {

        if(totalPaginas > 9){
            
            if(i == paginaSeleccionada){
                pagina.push(
                    <Pagination.Item
                        onClick={() => this.props.fetch(true, i  ) }  // EL FETCHTABLA, O FUNCION QUE VUELVE A LLAMAR LA QUERY RECIBE 2 PARAMENTROS "TRUE" U "I", DONDE TRUE SIGNIFICA QUE JALE LA DATA DEL FILTRO SI ES QUE TUVIERA YA MARCADA ANTERIORMENTE,
                                                                // Y EL PARAMETRO "i" significa el numero de la pagina 
                        active 
                        key={i}> {i}
                    </Pagination.Item>)
            }else if(i == primeraPagina || i == segundaPagina || i == terceraPagina ){
                pagina.push(
                    <Pagination.Item 
                        onClick={() => this.props.fetch(true, i ) }   // EL FETCHTABLA, O FUNCION QUE VUELVE A LLAMAR LA QUERY RECIBE 2 PARAMENTROS "TRUE" U "I", DONDE TRUE SIGNIFICA QUE JALE LA DATA DEL FILTRO SI ES QUE TUVIERA YA MARCADA ANTERIORMENTE,
                                                                // Y EL PARAMETRO "i" significa el numero de la pagina 
                        key={i}> {i}
                    </Pagination.Item>)
            }else if(i == ultimaPagina || i == penultimaPagina){
                pagina.push(
                    <Pagination.Item 
                        onClick={() => this.props.fetch(true, i ) }   // EL FETCHTABLA, O FUNCION QUE VUELVE A LLAMAR LA QUERY RECIBE 2 PARAMENTROS "TRUE" U "I", DONDE TRUE SIGNIFICA QUE JALE LA DATA DEL FILTRO SI ES QUE TUVIERA YA MARCADA ANTERIORMENTE,
                                                                // Y EL PARAMETRO "i" significa el numero de la pagina 
                        key={i}> {i}
                    </Pagination.Item>)
            }else if(i == anteriorPaginaSeleccionada || i == siguientePaginaSeleccionada ){
                pagina.push(
                    <Pagination.Item 
                        onClick={() => this.props.fetch(true, i ) }
                        key={i}> {i}
                    </Pagination.Item>)
            }else if(i == cuartaPagina){
                pagina.push(
                    <Pagination.Ellipsis />)
            }
            else if( i == antePenultimaPagina){
                pagina.push(
                    <Pagination.Ellipsis />)
            }

        }else{
            if(i == paginaSeleccionada){
                pagina.push(
                    <Pagination.Item
                        onClick={() => this.props.fetch(true, i  ) }
                        active 
                        key={i}> {i}
                    </Pagination.Item>)
            }else{
                pagina.push(
                    <Pagination.Item 
                        onClick={() => this.props.fetch(true, i ) }
                        key={i}> {i}
                    </Pagination.Item>)
            }
        }

                
    }
    return pagina;
    }
render(){
    return(
        
            this.paginar(  // ESTA FUNCION ES LA QUE ESTA ARRIBA, LA QUE ARMA LOS NUMEROS DE PAGINA, ENTRE OTROS
                 this.props.data['total'],          // ESTOS SON LOS DATOS OTORGADOS POR EL PAGINATE DE LARAVEL LUMEN
                 this.props.data['per_page'],       // ESTOS SON LOS DATOS OTORGADOS POR EL PAGINATE DE LARAVEL LUMEN
                 this.props.data['current_page'],   // ESTOS SON LOS DATOS OTORGADOS POR EL PAGINATE DE LARAVEL LUMEN
            )
    )
    
}
};
export default Paginar
