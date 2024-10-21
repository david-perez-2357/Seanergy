
var usuariosDisponibles = [
    {
        "user": "David Perez",
        "password": "hola12345"
    },

    {
        "user": "root",
        "password": "1234"
    },

    {
        "user": "Alba profesora",
        "password": "12345678"
    }
];

function checkSession(user, password) {
    var encontrado = false;

    for (let index = 0; index < usuariosDisponibles.length; index++) {
        if (usuariosDisponibles[index]["user"] == user && usuariosDisponibles[index]["password"] == password) {
            encontrado = true;
        }
    }

    if (!encontrado) {
        toastr.error("El usuario o la contraseña no son correctos", "Error");
        $("#password").val("");
    }

    if (!existeEnLocalStorage("precio_plan")) {
        $("#modalElegirPlan").modal("show");
    }

   

    return encontrado;
}

$(".comprobar_sesion").click(function () {
    var usuario = $("#user").val();
    var contrasena = $("#password").val();
    console.log(usuario);

    console.log(contrasena);

    if (!checkSession(usuario, contrasena)) {return;}

    $(".iniciar_sesion").attr("value", usuario);
    $("#loginModal").modal("hide");
    guardarEnLocalStorage("user", usuario);
    guardarEnLocalStorage("password", contrasena);

    var rutaArchivo = window.location.pathname;
    var nombreArchivo = rutaArchivo.split('/').pop();
    console.log(nombreArchivo);

    if (nombreArchivo == "index.html" || nombreArchivo == "factura.html") {
        actualizeUser();
    }
    changeButtonToDropdown();
});

function changeButtonToDropdown() {
    $("#loginModal").removeClass("blur");
    $(".iniciar_sesion").attr("data-bs-toggle", "dropdown");
    $(".iniciar_sesion").addClass("dropdown-toggle");
    $(".iniciar_sesion").attr("aria-expanded", "false");
    $(".cerrar_sesion").parent().parent().css("left", "-50px");
    $(".dropdown-menu").css("display", "");
}

function changeButtonToModal() {
    $(".iniciar_sesion").attr("data-bs-toggle", "modal");
    $(".iniciar_sesion").removeClass("dropdown-toggle");
}

function cambiarModal() {
    $("#loginModal").attr("data-bs-backdrop", "static");
    $("#loginModal").attr("data-bs-keyboard", "false");
    $("#loginModal").addClass("blur");
    $("#loginModal").modal("show");
    $("#loginModal").attr("data-bs-backdrop", "");
    $("#loginModal").attr("data-bs-keyboard", "");
}

$(document).ready(function () {
    if (existeEnLocalStorage("user")) {
        var usuario = obtenerDeLocalStorage("user");
        var contrasena = obtenerDeLocalStorage("password");
        // limpiarLocalStorage();
    
        if (checkSession(usuario, contrasena)) {
            $("#user").val(usuario);
            $("#password").val(contrasena);
            $(".iniciar_sesion").attr("value", usuario);
    
            changeButtonToDropdown();
            
        }

        
    
    }else {
        var rutaArchivo = window.location.pathname;
        var nombreArchivo = rutaArchivo.split('/').pop();
        console.log(nombreArchivo);
    
        if (nombreArchivo == "index.html" || nombreArchivo == "factura.html") {
            cambiarModal();
        }
    }

});



$(".cerrar_sesion").click(function () {

    if (existeEnLocalStorage("password")) {
        changeButtonToModal();
        eliminarDeLocalStorage("user");
        eliminarDeLocalStorage("password");
        $("#password").val("");
        $("#user").val("");
        $(".iniciar_sesion").val("Iniciar sesión");
        $(".dropdown-menu").hide();

        var rutaArchivo = window.location.pathname;
        var nombreArchivo = rutaArchivo.split('/').pop();
        console.log(nombreArchivo);
    
        if (nombreArchivo == "index.html" || nombreArchivo == "factura.html") {
            cambiarModal();
        }

    }
});

