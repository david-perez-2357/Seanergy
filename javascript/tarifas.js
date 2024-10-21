
$(".tarifa input").click(function () {
    var padre = $(this).parent().parent().parent();

    if (!existeEnLocalStorage("user")) {
        toastr.error("Para elegir plan hay que iniciar sesión", "Error");
        return;
    }

    if (padre.hasClass("selected") && !existeEnLocalStorage("precio_plan")) {
        padre.removeClass("selected");
        $(".panel").css("display", "none");
    }else {
        $(".selected").removeClass("selected");
        padre.addClass("selected");
        $(".panel").css("display", "flex");
    }
    
});


$(".panel").css("display", "none");

$(".panel").click(function () {
    let precio = $(".selected .btn-info").val();
    precio = precio.split(" ");
    precio = precio[0].replace("€", "").replace(",", ".");
    eliminarDeLocalStorage("precio_plan");
    guardarEnLocalStorage("precio_plan", precio);
});

$(".comprobar_sesion, .cerrar_sesion").click(function() {
    setTimeout(function() {
        reloadPrivileges();
    }, 10);
});

function reloadPrivileges() {

    if (existeEnLocalStorage("precio_plan") && existeEnLocalStorage("user")) {
        $(".tarifa").each(function (index, element) {

            if ($(element).find("input").val().replace("€", "").replace(",", ".").split(" ")[0] == obtenerDeLocalStorage("precio_plan")) {
                $(element).addClass("selected");
                $(".panel").css("display", "flex");
            }
        });

        $("#modalCambio").modal("show");
    }else {
        $(".selected").removeClass("selected");
        $(".panel").css("display", "none");
        console.log("escnder");
    }
}

$(document).ready(function () {
    reloadPrivileges();

    $(".cancelar_plan").click(function () {
        eliminarDeLocalStorage("precio_plan");
        $(".selected").removeClass("selected");
        $(".panel").css("display", "none");
    });
    
});
