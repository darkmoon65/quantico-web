import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Login = React.lazy(() => import('./sistema/login/index'));

const Usuarios   = React.lazy(() => import('./sistema/usuarios/index'));
const Slider     = React.lazy(() => import('./sistema/slider/index'));
const Membresias = React.lazy(() => import('./sistema/membresias/index'));
const Productos  = React.lazy(() => import('./sistema/productos/index'));
const Compras    = React.lazy(() => import('./sistema/compras/index'));
const Verificaciones = React.lazy(() => import('./sistema/verificaciones/index'));

const routes = [
    { 
        path: '/login', 
        exact: true, 
        name: 'Login', 
        component: Login 
    },
    { 
        path: '/usuarios', 
        exact: true, 
        name: 'Usuarios', 
        component: Usuarios 
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
        path: '/compras', 
        exact: true, 
        name: 'Compras', 
        component: Compras 
    },
];

export default routes;