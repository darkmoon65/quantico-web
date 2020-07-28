import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Login = React.lazy(() => import('./sistema/login/index'));

const Inicio            = React.lazy(() => import('./sistema/inicio/index'));
const Usuarios          = React.lazy(() => import('./sistema/usuarios/index'));
const Slider            = React.lazy(() => import('./sistema/slider/index'));
const Membresias        = React.lazy(() => import('./sistema/membresias/index'));
const Productos         = React.lazy(() => import('./sistema/productos/index'));
const Verificaciones    = React.lazy(() => import('./sistema/verificaciones/index'));
const Comprobantes      = React.lazy(() => import('./sistema/comprobantes/index'));
const Completos         = React.lazy(() => import('./sistema/completos/index'));
const Socios            = React.lazy(() => import('./sistema/socios/index'));
const Contactos         = React.lazy(() => import('./sistema/contactos/index'));
const TipoProductos     = React.lazy(() => import('./sistema/tiposProductos/index'));
const Citas             = React.lazy(() => import('./sistema/citas/index'));
const Bancos            = React.lazy(() => import('./sistema/bancos/index'));
const CuentasBancarias  = React.lazy(() => import('./sistema/cuentasBancarias/index'));
const BlackList         = React.lazy(() => import('./sistema/blacklist/index'));
const Sugerencias       = React.lazy(() => import('./sistema/sugerencias/index'));
const Intereses         = React.lazy(() => import('./sistema/intereses/index'));
const RedesSociales     = React.lazy(() => import('./sistema/redes/index'));
const TiposPago         = React.lazy(() => import('./sistema/tiposPagos/index'));
const CrearTiposPago    = React.lazy(() => import('./sistema/tiposPagos/componentes/crearTipoPago'));
const Regalos           = React.lazy(() => import('./sistema/regalos/index'));
const Inversiones       = React.lazy(() => import('./sistema/inversiones/index'));
const Herramientas      = React.lazy(() => import('./sistema/herramientas/index'));
const Asistencias       = React.lazy(() => import('./sistema/asistencias/index'));
const Intranet          = React.lazy(() => import('./sistema/intranet/index'));

const DatosFinancieros = React.lazy(() => import('./sistema/datosFinancieros/index'));
const Notificaciones = React.lazy(() => import('./sistema/notificaciones/index'));

const routes = [
    {
        path: '/login',
        exact: true,
        name: 'Login',
        component: Login
    },
    {
        path: '/quantico',
        exact: true,
        name: 'inicio',
        component: Inicio
    },
    {
        path: '/usuarios',
        exact: true,
        name: 'Usuarios',
        component: Usuarios
    },
    {
        path: '/blacklist',
        exact: true,
        name: 'BlackList',
        component: BlackList
    },
    {
        path: '/slider',
        exact: true,
        name: 'Slider',
        component: Slider
    },
    {
        path: '/membresias',
        exact: true,
        name: 'Membresias',
        component: Membresias
    },
    {
        path: '/productos',
        exact: true,
        name: 'Productos',
        component: Productos
    },
    {
        path: '/verificaciones',
        exact: true,
        name: 'Verificaciones',
        component: Verificaciones
    },
    {
        path: '/completos',
        exact: true,
        name: 'Verificaciones',
        component: Completos
    },
    {
        path: '/comprobantes',
        exact: true,
        name: 'Verificaciones',
        component: Comprobantes
    },
    {
        path: '/socios',
        exact: true,
        name: 'Socios',
        component: Socios
    },
    {
        path: '/notificaciones',
        exact: true,
        name: 'Notificaciones',
        component: Notificaciones
    },
    {
        path: '/contactos',
        exact: true,
        name: 'Contactos',
        component: Contactos
    },
    {
        path: '/tipoProductos',
        exact: true,
        name: 'TipoProductos',
        component: TipoProductos
    },
    {
        path: '/bancos',
        exact: true,
        name: 'Bancos',
        component: Bancos
    },
    {
        path: '/citas',
        exact: true,
        name: 'Citas',
        component: Citas
    },
    {
        path: '/cuentasBancarias',
        exact: true,
        name: 'CuentasBancarias',
        component: CuentasBancarias
    },
    {
        path: '/sugerencias',
        exact: true,
        name: 'Sugerencias',
        component: Sugerencias
    },
    {
        path: '/intereses',
        exact: true,
        name: 'Intereses',
        component: Intereses
    },
    {
        path: '/redes',
        exact: true,
        name: 'Redes',
        component: RedesSociales
    },
    {
        path: '/tiposPago',
        exact: true,
        name: 'TiposPago',
        component: TiposPago
    },
    {
        path: '/tiposPago/crear',
        exact: true,
        name: 'CrearTiposPago',
        component: CrearTiposPago
    },
    {
        path: '/regalos',
        exact: true,
        name: 'Regalos',
        component: Regalos
    },
    {
        path: '/inversiones',
        exact: true,
        name: 'Inversiones',
        component: Inversiones
    },
    {
        path: '/herramientas',
        exact: true,
        name: 'Herramientas',
        component: Herramientas
    },
    {
        path: '/asistencias',
        exact: true,
        name: 'Asistencias',
        component: Asistencias
    },
    {
        path: '/datosFinancieros',
        exact: true,
        name: 'DatosFinancieros',
        component: DatosFinancieros
    },
    {
        path: '/intranet',
        exact: true,
        name: 'Intranet',
        component: Intranet
    }

];

export default routes;
