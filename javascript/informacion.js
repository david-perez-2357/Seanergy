

$(".botonModalAgradecimiento").click(function () {
    var cantidad = $("#cantidadDonada").val();
    console.log(cantidad);

    if (cantidad && cantidad != "0") {
        $("#modalAgradecimiento .modal-body h2").text(`Has donado ${cantidad}€`);
        $("#cantidadDonada").val(0);
        $("#modalAgradecimiento .modal-body p").css("display", "flex");
        $("#modalAgradecimiento .modal-body p").removeClass("d-none");
        $("#modalAgradecimiento .modal-body img").addClass("d-none");
        $("#modalAgradecimiento .modal-body img").removeClass("d-flex");
    }else {
        $("#modalAgradecimiento .modal-body h2").text(`Tu donación hoy puede impulsar un mañana más sostenible y lleno de energía renovable. #JuntosPorElPlaneta`);
        $("#modalAgradecimiento .modal-body p").removeClass("d-flex");
        $("#modalAgradecimiento .modal-body p").addClass("d-none");
        $("#modalAgradecimiento .modal-body img").addClass("d-flex");
        $("#modalAgradecimiento .modal-body img").removeClass("d-none");

    }
});