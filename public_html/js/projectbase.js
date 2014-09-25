function showForms () {
    $('.section').css({
        display: 'none'
    });

    $('#list-forms').css({
        display: 'block'
    });
}

function showSubmitions () {
    $('.section').css({
        display: 'none'
    });

    $('#list-submitions').css({
        display: 'block'
    });
}

$(function() {
    function resize() {
        var H = $(window).height(),
            W = $("#page-wrapper").width();
        
        $("#containner").css({
            height: H - 160
        });
        
        $(".component").css({
            width: W - 240 - 60
        });
    }

    $(window).resize(function() {
        resize();
    });

    setTimeout(function() {
        resize();
    }, 250);
});

$.support.cors = true;

var uget = function (params) {
    return $.ajax({
        xhrFields: {
            withCredentials: true
        }, type: (params.type)? params.type : 'GET',
        url: (params.url)? params.url : '',
        data: (params.data)? params.data : {},
        crossDomain: true
    });
};

var parametrizer = function (form, inArray) {
    var tmp = form.serializeArray(),
        params = {};
    for(var i in tmp) {
        if(inArray) {
            if(!params[tmp[i].name]) {
                params[tmp[i].name] = [];
            }
            
            params[tmp[i].name].push(tmp[i].value);
        } else {
            params[tmp[i].name] = tmp[i].value;
        }
    }
    
    return params;
};

function Linker (url) {
    var baseUrl = (url.substring(url.length-1) === "/")? url.substring(0, url.length-1) : url,
        extension = '.php?';
    
    this.Url = function (controller, action, get) {
        var strget = "";

        for(var key in get) {
            if(!isNaN(key)) {
                strget += get[key] + '/';
            } else {
                strget += key + '=' + get[key] + '&';
            }
        }
        
        //strget = (strget.length > 0)? strget.substring(0, strget.length-1) : strget;
        if(controller.length > 0) {
            if(action.length > 0) {
                return baseUrl + '/' + controller + '/' + action + extension + strget;
            } else {
                return baseUrl + '/' + controller;
            }
        } else {
            return baseUrl;
        }
    };
    
    this.Abslute = function (url) {
        return baseUrl + '/' + url;
    };
    
    this.setBaseUrl = function (url) {
        baseUrl = (url.substring(url.length-1) === "/")? url.substring(0, url.length-1) : url;
    };
    
    this.setExtension = function (ext) {
        extension = ext;
    };
};

//Image Loader
var Images = new (function () {
    var img = [], base = "", loaded = 0, count = 0;
    
    this.setBase = function (_base) {
        base = _base;
    };
    
    this.add = function (image, directory) {
        img[image] = new Image();
        img[image].src = base + directory;
    };
    
    this.get = function (image) {
        return img[image];
    };
    
    this.dim = function (image) {
        return {
            width: img[image].width, 
            height: img[image].height
        };
    };
    
    this.isLoaded = function () {
        loaded = 0; count = 0;
        for (var k in img) {
            if (img.hasOwnProperty(k)) loaded += (img[k].complete)? 1 : 0;
            count++;
        }
        
        return (loaded === count);
    };
    
    this.Percentloaded = function () {
        return loaded/count;
    };
})();

//Generate an Elastic Canvas
function Elastic (_draw, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    
    this.draw = function () {
        canvas.width = canvas.width;
        _draw(ctx, canvas);
    };
    
    this.getImage = function () {
        return canvas;
    };
};

var _Utils = {
    getChecks: function (elem) {
        var tmp = [];
        elem.find(":selected").each(function () {
            tmp.push($(this).val());
        });

        return tmp.join(',');
    }
};

$(function () {
    $(".listView a").click(function () {
        $(this).parent().find("div").css({
            display: 'block'
        });
    });
});

//Generate a requestAnimationFrame for any Browser
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
        'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {callback(currTime + timeToCall);}, 
            timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})();

//Start the program and generate all needed
function GCanvas (cnv, wdth, hght, functions, scene) {
    
    var oldtime = new Date().getTime(),
        _this = this;

    _this.W = 1000;
    _this.H = 1000;
    _this.FPS = 0;
    _this.keys = [];
    
    //Some Variables used in the app
    var isLoaded = false, deltaX = 0, deltaY = 0, deltaW = 0, deltaH = 0,
        canvas = document.getElementById(cnv), rende = document.createElement('canvas');
    canvas.height = hght;
    canvas.width = wdth;
    
    var ctx = canvas.getContext("2d");
    
    _this.H = rende.height = hght;
    _this.W = rende.width = wdth;
    
    this.resize = function (width, height) {
        if(height) {
            _this.H = canvas.height = rende.height = height;
        }
        
        if(width) {
            _this.W = canvas.width = rende.width = width;
        }
    };
        
    var g2d = rende.getContext("2d"),
        scenary = scene;
        _this.FPS = 30;
        oldtime = 0;

    //FUNCIONES DE PINTADO/CONFIGURACION DE LA WEBAPP
    var _Configs = function () {
        if(window.innerHeight !== h) {
            var h = window.innerHeight;
            var w = window.innerWidth;
            var off = $("#" + cnv).offset();
            
            deltaX = off.left;
            deltaY = off.top;
            deltaW = _this.W;
            deltaH = _this.H;
        }
    };

    var _Draw = function () {
        //canvas.width = canvas.width;
        try {
            ctx.drawImage(rende, 0, 0);
        } catch (ex) {
            console.log(ex);
        }
    };
    var _GameLoop = function (time) {
        
        _Configs();
        
        if(!functions[scenary].wasSetup) {
            if(functions[scenary].Setup) functions[scenary].Setup();
            functions[scenary].wasSetup = true;
        }
        
        if(!functions[scenary].isChanged) {
            if(functions[scenary].Change) functions[scenary].Change();
            functions[scenary].isChanged = true;
        }
        
        isLoaded = Images.isLoaded();
        
        if(isLoaded) {
            //rende.width = rende.width;
            if(functions[scenary].Step) functions[scenary].Step();
            if(functions[scenary].Draw) functions[scenary].Draw(g2d);
        } else {
            if(functions[scenary].Loading) functions[scenary].Loading(Images.Percentloaded());
        }
        
        _Draw();
        
        _this.FPS = (1000/(time-oldtime)).toFixed(1);
        oldtime = time;
        
        requestAnimationFrame(_GameLoop);
    };
    
    this.setScenary = function (scene) {
        scenary = scene;
        functions[scenary].isChanged = false;
    };
    
    this.getCurrentScenary = function () {
        return scenary;
    };
    
    //CANCELAR LOS EVENTOS PROPIOS DEL NAVEGADOR
    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
    }, false);
    canvas.addEventListener("touchend", function (e) {
        e.preventDefault();
    }, false);
    canvas.addEventListener("click", function (e) {
//        e.preventDefault();
    }, false);
    canvas.addEventListener("mousemove", function (e) {
        e.preventDefault();
    }, false);
    
    //EVENTOS DEL RATON
    canvas.addEventListener("mousedown", function (e) {
        if(functions[scenary].Start) {
            var x = Math.ceil(((e.pageX-deltaX)/deltaW)*_this.W),
                y = Math.ceil(((e.pageY-deltaY)/deltaH)*_this.H);
            functions[scenary].Start(x, y);
        }
    }, false);
    canvas.addEventListener("mousemove", function (e) {
        
        if(functions[scenary].Moving) {
            var x = Math.ceil(((e.pageX-deltaX)/deltaW)*_this.W),
                y = Math.ceil(((e.pageY-deltaY)/deltaH)*_this.H);
            functions[scenary].Moving(x, y);
        }
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        if(functions[scenary].End) {
            var x = Math.ceil(((e.pageX-deltaX)/deltaW)*_this.W),
                y = Math.ceil(((e.pageY-deltaY)/deltaH)*_this.H);
            functions[scenary].End(x, y);
        }
    }, false);

    //EVENTOS DEL TOUCH
    canvas.addEventListener("touchstart", function (e) {
        if(functions[scenary].Start) {
            var touches = e.targetTouches;
            for (var i=0; i<touches.length; i++) {
                var x = Math.ceil(((touches[i].pageX-deltaX)/deltaW)*_this.W),
                    y = Math.ceil(((touches[i].pageY-deltaY)/deltaH)*_this.H);
                functions[scenary].Start(x, y);
            }
        }
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        if(functions[scenary].Moving) {
            var touches = e.targetTouches;
            for (var i=0; i<touches.length; i++) {
                var x = Math.ceil(((touches[i].pageX-deltaX)/deltaW)*_this.W),
                    y = Math.ceil(((touches[i].pageY-deltaY)/deltaH)*_this.H);
                functions[scenary].Moving(x, y);
            }
        }
    }, false);
    canvas.addEventListener("touchend", function (e) {
        if(functions[scenary].End) {
            var touches = e.targetTouches;
            for (var i=0; i<touches.length; i++) {
                var x = Math.ceil(((touches[i].pageX-deltaX)/deltaW)*_this.W),
                    y = Math.ceil(((touches[i].pageY-deltaY)/deltaH)*_this.H);
                functions[scenary].End(x, y);
            }
        }
    }, false);
    canvas.addEventListener("keydown", function (e) {
        _this.keys[e.keyCode] = true;
        if(functions[scenary].KeyDown) {
            functions[scenary].KeyDown(e.keyCode);
        }
    }, false);
    canvas.addEventListener("keyup", function (e) {
        _this.keys[e.keyCode] = false;
        if(functions[scenary].KeyUp) {
            functions[scenary].KeyUp(e.keyCode);
        }
    }, false);

    //Iniciar el pintado del juego
    requestAnimationFrame(_GameLoop);
};