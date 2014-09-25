/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Composicion del objeto interno que referencia la plantilla creada
 * -----------------------------------------------------------------
 * _p = {                                                   --> La plantilla usada
       idprenda: 0, 
       filter: '#fff',                                      --> el Filtro que especifica el color de la prenda
       p: {                                                 --> Perspectivas
           0: {                                             --> ID de la perspectiva en BD
               nombre: 'nombre de la perspectiva',
               miniatura: 'preview perspectiva',
               plantilla: 'Imagen de la perspectiva',
               width: 0,                                    --> Ancho de la plantilla
               height: 0,                                   --> Alto de la plantilla
               x: 0,                                        --> Posicion en X del area de dibujo
               y: 0,                                        --> Posicion en y del area de dibujo
               iw: 0,                                       --> Ancho interno del area de dibujo
               ih: 0,                                       --> Alto interno del area de dibujo
               e: {                                         --> Elementos que contiene la perspectiva
                   1102938849: {                            --> ID de referencia al agregar un elemento a la perspectiva
                       type: 'text'
                   }
                }
           }
       }
   };
 */



var P = new (function () {
    var _p = {} //Perspectivas
      , _this = this
      , bbox = null
      , sel = {
          idperspectiva: 0,
          code: 0,
          element: function (code) {
            _this.render.selected(code);
            sel.code = code;
            edit(code);
          }
      }
      , comp = {}   //Componentes
      , elem = {}   //Elementos creados de Paper (Raphael)
      , layer = []  //Orden de renderizado de las capas
      , paper = null
      , draggin = false
    ;
   
   this.gen = {
       perspectives: function (data) {
           _p.p = {};
           sel.idperspectiva = data[0].idperspectiva;
           
           for(var i=0; i<data.length; i++) {
               _p.p[data[i].idperspectiva] = data[i];
               
               delete _p.p[data[i].idperspectiva].idprenda;
               delete _p.p[data[i].idperspectiva].idperspectiva;
           }
           
           _this.render.perspectives();
           _this.render.perspective();
       }
   };
   
   this.ins = {
       text: function () {
            create({
                type: 0,
                icon: 'text.png',
                text: 'Texto',
                attr: {
                    'font-size': 50,
                    fill: '000000',
                    stroke: '000000',
                    'stroke-width': 1,
                    text: '¡Hola!',
                    'font-family': 'Arial',
                    'font-weight': 'normal'
                },
                transform: {
                    x: _p.p[sel.idperspectiva].iw/2,
                    y: _p.p[sel.idperspectiva].ih/2,
                    rotate: 0
                }
            });
       },
       shape: function () {
           create({
               type: 1,
               icon: 'shape.png',
               text: 'Figura',
               attr: {
                    fill: '000000',
                    stroke: '000000',
                    'stroke-width': 1,
                    width: 50,
                    height: 50,
                    r: 0
                },
                transform: {
                    x: _p.p[sel.idperspectiva].iw/2,
                    y: _p.p[sel.idperspectiva].ih/2,
                    rotate: 0
                }/*,
                complex: {
                    rect: {
                        x: _p.p[sel.idperspectiva].iw/2,
                        y: _p.p[sel.idperspectiva].ih/2,
                        w: 50,
                        h: 50,
                        r: 0
                    }
                }*/
           });
       }
   };
   
   this.move = {
       layer: {
           up: function (i) {
               /*
                * 1. Verificar que se puede mover
                * 2. Intercambiar la posicion del elemento con el que esta una posicion encima de el
                * 3. Comenzar a iterar los objetos para que queden una posicion mas arriba
                * 4. Renderizar
                */
               if(i-1 < 0) {
                   return;
               }
               
               var tmp = layer[i];
               layer[i] = layer[i-1];
               layer[i-1] = tmp;
               
               for(var j=i; j>=0; j--) {
                   elem[layer[j]].toFront();
               }
               
               _this.render.layers();
           },
           down: function (i) {
               /*
                * 1. Verificar que se puede mover
                * 2. Intercambiar las posicion con el elemento que esta una posicion debajo de el
                * 3. Comenzar a iterar los objetos para que queden una posicion mas arriba
                * 4. Renderizar
                */
               if(parseInt(i)+1 >= layer.length) {
                   return;
               }
               
               var tmp = layer[i];
               layer[i] = layer[parseInt(i)+1];
               layer[parseInt(i)+1] = tmp;
               
               for(var j=i; j>=0; j--) {
                   elem[layer[j]].toFront();
               }
               
               _this.render.layers();
           }
       }
   };
   
   this.render = {
       /*
        * Show all perspectives
        */
       perspectives: function () {
           var perspectiva = $("#perspectivas").empty();
           
           for(var key in _p.p) {
               (function (key, val) {
                   $("<core-icon-button/>")
                    .attr('src', val.miniatura)
                    .attr('title', val.nombre)
                    .click(function () {
                        var prev = sel.idperspectiva;
                        sel.idperspectiva = key;
                        _this.render.perspective(prev);
                    })
                    .appendTo(perspectiva);
               })(key, _p.p[key]);
           }
       },
       
       /*
        * Render a perspective
        */
       perspective: function (prev) {
           /*
            * Copy previous information in the edited perspective
            */
           if(prev) {
               _p.p[prev].json = [];
               
               for (var i in layer) {
                   _p.p[prev].json.push($.extend({}, comp[layer[i]]));
               }
           }
           
           /*
            * Clear all variables
            */
           $("#layers").empty();
           layer = [];
           comp = {};
           elem = {};
           code = 0;
           
            $("#donatello")
            .attr('src', _p.p[sel.idperspectiva].plantilla)
            .attr('width', _p.p[sel.idperspectiva].width)
            .attr('height', _p.p[sel.idperspectiva].height);
    
            $("#michelangelo").css({
                width: _p.p[sel.idperspectiva].width
            });

            $("#raphael").empty();
            paper = new Raphael(document.getElementById('raphael'), _p.p[sel.idperspectiva].iw, _p.p[sel.idperspectiva].ih);
            
            $("[name=x]").attr('max', _p.p[sel.idperspectiva].iw);
            $("[name=y]").attr('max', _p.p[sel.idperspectiva].ih);
            $("[name=rect_x]").attr('max', _p.p[sel.idperspectiva].iw);
            $("[name=rect_y]").attr('max', _p.p[sel.idperspectiva].ih);
            
            $("#raphael").css({
                top: _p.p[sel.idperspectiva].y + 'px',
                left: _p.p[sel.idperspectiva].x + 'px',
                width: _p.p[sel.idperspectiva].iw + 'px',
                height: _p.p[sel.idperspectiva].ih + 'px'
            });
            
            /*
             * If layer exists, then create
             */
            if(_p.p[sel.idperspectiva].json) {
                for(var i=_p.p[sel.idperspectiva].json.length-1; i>=0; i--) {
                    create(_p.p[sel.idperspectiva].json[i]);
                }
            }
       },
       layers: function () {
           var _layers = $("#layers").empty();
           
           for(var i in layer) {
               (function (i) {
                   var _elem = comp[layer[i]];
                   
                   _layers.append(
                        $("<li/>").click(function () {
                            sel.element(layer[i]);
                        }).html(
                            $("<img/>", {
                                src: 'imgs/' + _elem.icon,
                                width: 20
                            })
                        ).append(
                            $("<h2/>", {
                                html: _elem.text
                            })
                        ).append(
                            $("<button/>", {
                                class: 'right'
                            }).html("^").click(function () {
                                _this.move.layer.up(i);
                            })
                        ).append(
                            $("<button/>", {
                                class: 'right'
                            }).html("v").click(function () {
                                _this.move.layer.down(i);
                            })
                        ).append(
                            $("<button/>", {
                                class: 'right delete'
                            }).html("x").click(function () {
                                var del = confirm("¿Desea eliminar esta capa?");
                                
                                if(del) {
                                    elem[layer[i]].remove();
                                    if(bbox) {
                                        bbox.remove();
                                    }
                                    layer.splice(i, 1);
                                    _this.render.layers();
                                }
                            })
                        )
                   );
               })(i);
           }
           
           _this.render.selected(sel.code);
       },
       
       /*
        * Show what layer is selected
        */
       selected: function (code) {
           var i = layer.indexOf(code);
           
           if(i >= 0) {
               $("#layers")
                .find("li")
                .removeClass('selected')
                .eq(i)
                .addClass('selected');
                
                _this.render.bbox(code);
           }
       },
       
       /*
        * Draw dotted line across selected object
        */
       bbox: function (code) {
            var obj = elem[code].getBBox(false)
              , x = obj.x
              , y = obj.y
            ;
                
            if(bbox) {
                bbox.remove();
            }

            bbox = paper
                .rect(x-3, y-3, obj.width+6, obj.height+6)
                .attr({
                    'stroke-dasharray': '--',
                    stroke: '#f00'
                });
                
            bbox.insertBefore(elem[code]);
       },
       
       /*
        * apply transform to a object
        */
       transform: function (o, p) {
            o.transform(
                ((p.x && p.y)? 'T' + p.x + ',' + p.y : '') + 
                ((p.rotate)? 'r' + p.rotate : '')
            );
       }
   };
   
   /*
    * Create a component
    */
   function create (obj) {
        var d = new Date()
          , code = Date.UTC(
                d.getFullYear(), 
                d.getMonth(), 
                d.getDate(), 
                d.getHours(),
                d.getMinutes(), 
                d.getSeconds(), 
                d.getMilliseconds()
            )
        ;
        
        layer.unshift(code);

        comp[code] = obj;

        switch(obj.type) {
            case 0:
                elem[code] = paper
                .text(0, 0, "");
            break;
            
            case 1:
                elem[code] = paper
                .rect(0, 0, 50, 50);
            break;
        }
        
        edit(code);
        update(code);
        _this.render.layers();
        sel.element(code);
        
        elem[code].click(function () {
            sel.element(code);
        });
        
        var _x = 0, _y = 0;
        elem[code].drag(function (dx, dy, x, y) {
            comp[code].transform.x = parseInt(_x) + dx;
            comp[code].transform.y = parseInt(_y) + dy;
            
            _this.render.transform(elem[code], comp[code].transform);
            _this.render.bbox(code);
        }, function (x, y) {
            _x = comp[code].transform.x;
            _y = comp[code].transform.y;
            draggin = true;
        }, function () {
            draggin = false;
            edit(code);
        });
   }
   
   function edit (code) {
       var designer = null
         , pages = document.querySelector('#design');
       
       switch(comp[code].type) {
           case 0:
               designer = $("#design-text");
            break;
            
            case 1:
                designer = $("#design-shape");
            break;
       }
       
       if(designer) {
            pages.selected = comp[code].type;
           
            for(var key in comp[code].attr) {
                designer.find("[name=" + key + "]").val(comp[code].attr[key]);
            }
            
            if(comp[code].attr.fill) {
                designer.find("[name=fill]").css({
                    background: '#' + comp[code].attr.fill
                });
            }
            
            if(comp[code].attr.stroke) {
                designer.find("[name=stroke]").css({
                    background: '#' + comp[code].attr.stroke
                });
            }
           
            for(var key in comp[code].transform) {
                designer.find("[name=" + key + "]").val(comp[code].transform[key]);
            }
            
            for(var key in comp[code].complex) {
                var c = comp[code].complex[key];
                
                for(var k in c) {
                    designer.find("[name=" + key + "_" + k + "]").val(c[k]);
                }
            }
       } else {
           alert("No se encontró el objeto");
       }
   }
   
   function update (code) {
       var designer = null
         , attr = {}
       ;
       
       if(!comp[code]) {
           return;
       }
       
       switch(comp[code].type) {
            case 0:
               designer = $("#design-text");
            break;
            
            case 1:
                designer = $("#design-shape");
            break;
       }
       
       if(designer && !draggin) {
           /*
            * Complex attributes
            */
            for(var key in comp[code].complex) {
                var c = comp[code].complex[key];
                
                for(var k in c) {
                    var _des = designer.find("[name=" + key + "_" + k + "]");
                    
                    if(_des) {
                        c[k] = _des.val();
                    }
                }
                
                switch (key) {
                    case 'rect':
                        //elem[code].remove();
                        //elem[code] = paper.rect(c.x, c.y, c.w, c.h, c.r);
                        /*if(elem[code]) {
                            elem[code].attr({});
                            console.log(code, elem[code].attrs)
                        }
                        
                        elem[code].click(function () {
                            sel.code = code;
                            edit(code);
                        });*/
                    break;
                }
            }
           
            /*
             * Transformations
             */
            var prm = {};
            for(var key in comp[code].transform) {
                comp[code].transform[key] = designer.find("[name=" + key + "]").val();
                prm[key] = designer.find("[name=" + key + "]").val();
            }
            
            _this.render.transform(elem[code], prm);

            /*
             * Basic Attributes
             */
            for(var key in comp[code].attr) {
                var _des = designer.find("[name=" + key + "]");
                if(_des) {
                    attr[key] = ((['fill', 'stroke'].indexOf(key) >= 0)? "#" : "") + _des.val();
                    comp[code].attr[key] = _des.val();
                }
            }

            elem[code].attr(attr);
            _this.render.selected(code);
       }
    }
   
    function refresh () {
        if(sel.code !== 0) {
            update(sel.code);
        }
        
        setTimeout(refresh, 250);
    }
    
    refresh();
})();