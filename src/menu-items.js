export default {
    items: [
        {
            id: 'quiantico',
            title: 'Quantico',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                // {
                //     id: 'login',
                //     title: 'Login',
                //     type: 'item',
                //     url: '/login',
                //     icon: 'feather icon-home',
                // },
                {
                    id: 'usuarios',
                    title: 'Usuarios',
                    type: 'item',
                    url: '/usuarios',
                    icon: 'fa fa-user-circle',
                },
                {
                    id: 'herramientas',
                    title: 'Herramientas',
                    type: 'item',
                    url: '/herramientas',
                    icon: 'fa fa-wrench',
                },
                {
                    id: 'blacklist',
                    title: 'BlackList',
                    type: 'item',
                    url: '/blacklist',
                    icon: 'fa fa-ban',
                },
                {
                    id: 'slider',
                    title: 'Slider',
                    type: 'item',
                    url: '/slider',
                    icon: 'feather icon-home',
                },
                {
                    id: 'membresias',
                    title: 'Membresias',
                    type: 'item',
                    url: '/membresias',
                    icon: 'feather icon-home',
                },
                {
                    id: 'productos',
                    title: 'Productos',
                    type: 'item',
                    url: '/productos',
                    icon: 'feather icon-home',
                },
                {
                    id: 'tipoProductos',
                    title: 'Tipos de Productos',
                    type: 'item',
                    url: '/tipoProductos',
                    icon: 'feather icon-home',
                },
                {
                    id: 'verificaciones',
                    title: `Verificaciones (${localStorage.getItem('verificaciones')})`,
                    type: 'item',
                    url: '/verificaciones',
                    icon: 'feather icon-home',
                },
                {
                    id: 'comprobantes',
                    title: `Comprobantes (${localStorage.getItem('comprobantes')})`,
                    type: 'item',
                    url: '/comprobantes',
                    icon: 'feather icon-home',
                },
                {
                    id: 'completos',
                    title: `Completos (${localStorage.getItem('completos')})`,
                    type: 'item',
                    url: '/completos',
                    icon: 'feather icon-home',
                },
                {
                    id: 'socios',
                    title: 'Socios',
                    type: 'item',
                    url: '/socios',
                    icon: 'feather icon-home',
                },
                {
                    id: 'contactos',
                    title: 'Contactos',
                    type: 'item',
                    url: '/contactos',
                    icon: 'fa fa-address-book',
                },
                {
                    id: 'citas',
                    title: 'Citas',
                    type: 'item',
                    url: '/citas',
                    icon: 'fa fa-phone',
                },
                {
                    id: 'cuentas',
                    title: 'Cuentas Bancarias',
                    type: 'item',
                    url: '/cuentasBancarias',
                    icon: 'feather icon-home',
                },
                {
                    id: 'bancos',
                    title: 'Bancos',
                    type: 'item',
                    url: '/bancos',
                    icon: 'feather icon-home',
                },
                {
                    id: 'sugerencias',
                    title: 'Sugerencias',
                    type: 'item',
                    url: '/sugerencias',
                    icon: 'fa fa-lightbulb-o',
                },
                {
                    id: 'notificaciones',
                    title: 'Notificaciones',
                    type: 'item',
                    url: '/notificaciones',
                    icon: 'feather icon-shopping-cart',
                },
                {
                    id: 'intereses',
                    title: 'Intereses',
                    type: 'item',
                    url: '/intereses',
                    icon: 'feather icon-home',
                },
                {
                    id: 'redes',
                    title: 'Redes',
                    type: 'item',
                    url: '/redes',
                    icon: 'feather icon-home',
                },
                {
                    id: 'tiposPago',
                    title: 'Tipos de pago',
                    type: 'item',
                    url: '/tiposPago',
                    icon: 'feather icon-home',
                },
                {
                    id: 'regalos',
                    title: 'Regalos',
                    type: 'item',
                    url: '/regalos',
                    icon: 'fa fa-gift',
                },
                {
                    id: 'inversiones',
                    title: 'Inversiones',
                    type: 'item',
                    url: '/inversiones',
                    icon: 'fa fa-home',
                },
                {
                    id: 'asistencias',
                    title: 'Asistencias',
                    type: 'item',
                    url: '/asistencias',
                    icon: 'fa fa-home',
                },
                {
                    id: 'datosFinancieros',
                    title: 'Datos Financieros',
                    type: 'item',
                    url: '/datosFinancieros',
                    icon: 'fa fa-university',
                }


            ]
        },
    ]
}
