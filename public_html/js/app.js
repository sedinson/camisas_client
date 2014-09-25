/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var LinkServer = new Linker('http://192.227.159.91/tservice');
LinkServer.setExtension('.json?');

document.addEventListener('polymer-ready', function() {
    var navicon = document.getElementById('navicon')
      , morebutton = document.getElementById('morebutton')
      , leftPanel = document.getElementById('leftPanel')
      , rightPanel = document.getElementById('rightPanel')
    ;
    
    navicon.addEventListener('click', function() {
        leftPanel.togglePanel();
    });
    
    morebutton.addEventListener('click', function() {
        rightPanel.togglePanel();
    });
});

$(function () {
    /*
     * Initialize Raphael's Library
     */
    var step1 = $("#step1")
      , step2 = $("#step2")
      , steps = document.getElementById('step')
      , loadPage = document.getElementById('loadPage')
    ;
    uget({
        url: LinkServer.Url('prenda', 'tipo')
    }).done(function (data) {
        if(data._code === 200) {
            step1.empty();
            
            for(var i=0; i<data._response.length; i++) {
                (function (ob) {
                    $("<core-icon-button/>")
                    .attr('src', ob.miniatura)
                    .attr('title', ob.tipo)
                    .click(function () {
                        uget({
                            url: LinkServer.Url('prenda', 'get', {
                                tipo: encodeURI(ob.tipo)
                            })
                        }).done(function (data) {
                            if(data._code === 200) {
                                steps.selected = 1;
                                step2.empty();
                                
                                $("#prendas-guide").html(
                                    $("<a/>", {
                                        href: '#',
                                        html: 'Prendas'
                                    }).click(function (e) {
                                        e.preventDefault();
                                        $("#prendas-guide").html("Prendas");
                                        steps.selected = 0;
                                    })
                                ).append(
                                    " > " + ob.tipo
                                );
                                
                                for(var i=0; i<data._response.length; i++) {
                                    (function (ob) {
                                        $("<core-icon-button/>")
                                        .attr('src', ob.miniatura)
                                        .attr('title', ob.nombre)
                                        .click(function () {
                                            uget({
                                                url: LinkServer.Url('perspectiva', 'get', {
                                                    idprenda: ob.idprenda
                                                })
                                            }).done(function (data) {
                                                if(data._code === 200) {
                                                    P.gen.perspectives(data._response);
                                                    loadPage.close();
                                                }
                                            });
                                        })
                                        .appendTo(step2);
                                    })(data._response[i]);
                                }
                            }
                        });
                    })
                    .appendTo(step1);
                })(data._response[i]);
            }
        } else {
            alert(data._message);
        }
    });
    
    $("#btn-text").click(function () {
        P.ins.text();
    });
    
    $("#btn-shape").click(function () {
        P.ins.shape();
    });
});