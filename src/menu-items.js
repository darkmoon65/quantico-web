export default {
    items: [
        {
            id: 'quiantico',
            title: 'Quantico',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                  id:     'users',
                  title:  'Usuarios',
                  type:   'collapse',
                  icon:   'feather icon-users',
                  children: [
                        {
                          id: 'usuarios-registrados',
                          title: `Registrados (${localStorage.getItem('usuarios')})`,
                          type: 'item',
                          url: '/usuarios',
                          icon: 'fa fa-bar-chart',
                        },
                        {
                            id: 'blacklist',
                            title: 'BlackList',
                            type: 'item',
                            url: '/blacklist',
                            icon: 'fa fa-shield',
                        }
                    ]
                },
                {
                  id:     'validaciones',
                  title:  'Validaciones',
                  type:   'collapse',
                  icon:   'fa fa-eye',
                  children: [

                        {
                            id: 'citas',
                            title: 'Citas',
                            type: 'item',
                            url: '/citas',
                            icon: 'fa fa-calendar',
                        },
                        {
                            id: 'verificaciones',
                            title: `Verificaciones (${localStorage.getItem('verificaciones')})`,
                            type: 'item',
                            url: '/verificaciones',
                            icon: 'feather icon-check-square',
                        },
                        {
                            id: 'comprobantes',
                            title: `Comprobantes (${localStorage.getItem('comprobantes')})`,
                            type: 'item',
                            url: '/comprobantes',
                            icon: 'feather icon-book',
                        },
                        {
                            id: 'completos',
                            title: `Completos (${localStorage.getItem('completos')})`,
                            type: 'item',
                            url: '/completos',
                            icon: 'feather icon-user-check',
                        },
                  ]
                },
                {
                  id:     'productos-servicios',
                  title:  'Productos y servicios',
                  type:   'collapse',
                  icon:   'fa fa-archive',
                  children: [
                      {
                          id: 'membresias',
                          title: 'Membresias',
                          type: 'item',
                          url: '/membresias',
                          icon: 'fa fa-usd',
                      },
                      {
                          id: 'tipoProductos',
                          title: 'Tipos',
                          type: 'item',
                          url: '/tipoProductos',
                          icon: 'feather icon-box',
                      },
                      {
                          id: 'productos',
                          title: 'Registrados',
                          type: 'item',
                          url: '/productos',
                          icon: 'feather icon-align-justify',
                      },
                      {
                          id: 'asistencias',
                          title: 'Asistencias',
                          type: 'item',
                          url: '/asistencias',
                          icon: 'fa fa-bookmark',
                      },

                  ]
                },
                {
                  id:     'elite-servicios',
                  title:  'Elite platinum',
                  type:   'collapse',
                  icon:   'fa fa-user-plus',
                  children: [
                        {
                            id: 'intranet',
                            title: 'Intranet',
                            type: 'item',
                            url: '/intranet',
                            icon: 'fa fa-key',
                        }
                  ]
                },
                {
                  id:     'finanzas-servicios',
                  title:  'Area financiera',
                  type:   'collapse',
                  icon:   'fa fa-university',
                  children: [
                        {
                            id: 'tiposPago',
                            title: 'Metodos de pago',
                            type: 'item',
                            url: '/tiposPago',
                            icon: 'feather icon-command',
                        },
                        {
                            id: 'bancos',
                            title: 'Bancos',
                            type: 'item',
                            url: '/bancos',
                            icon: 'feather icon-crosshair',
                        },
                        {
                            id: 'cuentas',
                            title: 'Datos Financieros',
                            type: 'item',
                            url: '/cuentasBancarias',
                            icon: 'feather icon-credit-card',
                        },
                  ]
                },
                {
                    id: 'sugerencias',
                    title: 'Sugerencias',
                    type: 'item',
                    url: '/sugerencias',
                    icon: 'feather icon-message-square',
                },
                {
                    id: 'notificaciones',
                    title: 'Notificaciones',
                    type: 'item',
                    url: '/notificaciones',
                    icon: 'feather icon-bell',
                },
                {
                    id: 'regalos',
                    title: 'Regalos',
                    type: 'item',
                    url: '/regalos',
                    icon: 'fa fa-gift',
                },
                {
                  id:     'extras-menu',
                  title:  'Extras',
                  type:   'collapse',
                  icon:   'fa fa-edit',
                  children: [
                        {
                            id: 'slider',
                            title: 'Sliders',
                            type: 'item',
                            url: '/slider',
                            icon: 'fa fa-code',
                        },
                        {
                            id: 'socios',
                            title: 'Aliados',
                            type: 'item',
                            url: '/socios',
                            icon: 'feather icon-flag',
                        },
                        {
                            id: 'contactos',
                            title: 'Contactos',
                            type: 'item',
                            url: '/contactos',
                            icon: 'fa fa-address-book',
                        },
                        {
                            id: 'enlaces',
                            title: 'Enlaces',
                            type: 'item',
                            url: '/enlaces',
                            icon: 'feather icon-link',
                        },
                        {
                            id: 'intereses',
                            title: 'Intereses',
                            type: 'item',
                            url: '/intereses',
                            icon: 'feather icon-layers',
                        },
                        {
                            id: 'inversiones',
                            title: 'Inversiones',
                            type: 'item',
                            url: '/inversiones',
                            icon: 'fa fa-globe',
                        },
                        {
                            id: 'herramientas',
                            title: 'Herramientas',
                            type: 'item',
                            url: '/herramientas',
                            icon: 'feather icon-settings',
                        },
                        {
                            id: 'respuestas',
                            title: 'Respuestas',
                            type: 'item',
                            url: '/respuestas',
                            icon: 'fa fa-question',
                        },

                  ]
                },

            ]
        },
    ]
}
