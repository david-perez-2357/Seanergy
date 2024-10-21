var kWhGenerado = [295, 217, 240, 232, 141, 114, 157, 145, 282, 289, 304, 358];
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
var fechaActual = new Date();
let fecha = new Date(fechaActual.setDate(1));
fecha.setMonth(fecha.getMonth() - 1); // Creamos una copia de fechaActual

var fechaContratado = new Date("2020-10-1");
console.log(fechaContratado);

function obtenerLongitudMes(anio, mes) {
    // mes--;

    var primerDiaMesSiguiente = new Date(anio, mes + 1, 1);

    var ultimoDiaMesActual = new Date(primerDiaMesSiguiente - 1);

    var longitudMes = ultimoDiaMesActual.getDate();

    return longitudMes;
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function repartirNumero(numeroInicial, cantidadDivisiones) {
    
    if (cantidadDivisiones <= 0) {
        console.error("La cantidad de divisiones debe ser mayor que 0.");
        return null;
    }


    var valoresEscalados = Array.from({ length: cantidadDivisiones }, () => Math.floor((numeroInicial / cantidadDivisiones)) < 5 ? Math.floor((numeroInicial / cantidadDivisiones) + randomInRange(-1, 2)) : Math.floor((numeroInicial / cantidadDivisiones) - randomInRange(-5, 5)));


    return valoresEscalados;
}

var options = {
    series: [{
        name: "KWh",
        data: generarDatosAleatorios(30) // Generar datos aleatorios para 30 puntos
    }],
    chart: {
        type: 'area',
        zoom: {
            enabled: false
        },
        width: "100%",
        height: "70px",
        sparkline: {
            enabled: true // Utilizar sparkline para un gráfico más compacto
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 2 // Ancho de la línea del gráfico
    },
    fill: {
        opacity: 0.2 // Opacidad del área bajo la línea
    },
    xaxis: {
        labels: {
            show: false // Ocultar etiquetas x
        },

        categories: [
            'Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10',
            'Día 11', 'Día 12', 'Día 13', 'Día 14', 'Día 15', 'Día 16', 'Día 17', 'Día 18', 'Día 19', 'Día 20',
            'Día 21', 'Día 22', 'Día 23', 'Día 24', 'Día 25', 'Día 26', 'Día 27', 'Día 28', 'Día 29', 'Día 30', 'Día 31'
        ],

    },
    


    yaxis: {
        show: false,
        min: 0,
        max: 30,
    },
    legend: {
        horizontalAlign: 'left'
    }
};


// Función para generar datos aleatorios
function generarDatosAleatorios(numPuntos) {
    var datos = [];
    for (var i = 0; i < numPuntos; i++) {
        datos.push(Math.floor(Math.random() * 400)); // Generar números aleatorios entre 0 y 999
    }
    return datos;
}

$(document).ready(function () {

    $("#consumoInicial").text("Resumen del consumo desde " + fechaContratado.toLocaleDateString());

    var nuevoElemento;
    var consumoMes;
    var cosumoTotalMes;
    var precio_plan = parseFloat(obtenerDeLocalStorage("precio_plan"));
    const consumoElementos = [];
    const elementosReferencia = [];
    const newOptions = [];
    const precioElementos = [];
    const ahorroElementos = [];
    const planes = [0.25, 0.30, 65];

    while (fecha > fechaContratado) {
        nuevoElemento = $("#plantilla").clone().appendTo("#padre");
        nuevoElemento.attr("id", "");

        nuevoElemento.find(".mes").text(meses[fecha.getMonth()] + " " + fecha.getFullYear());
        nuevoElemento.find("#chart").attr("id", "chart" + fecha.getMonth() + "-" + fecha.getFullYear());

        // Poner cifras
        consumoMes = repartirNumero(kWhGenerado[fecha.getMonth()], obtenerLongitudMes(fecha.getFullYear(), fecha.getMonth()));
        cosumoTotalMes = consumoMes.reduce((acumulador, valorActual) => acumulador + valorActual, 0);

        nuevoElemento.find(".consumo").text(cosumoTotalMes + " KWh");

        consumoElementos.push(cosumoTotalMes);
        elementosReferencia.push(nuevoElemento);
        

        if (precio_plan < 2) {
            nuevoElemento.find(".gastado").text((cosumoTotalMes * precio_plan).toFixed(2) + " €");
            nuevoElemento.find(".precio_plan").text("(" + precio_plan + "€ / KWh)");
            precioElementos.push(cosumoTotalMes * precio_plan);
            ahorroElementos.push(randomInRange(5, 10));
        }else {
            nuevoElemento.find(".gastado").text(precio_plan + " €");
            nuevoElemento.find(".precio_plan").text("(" + precio_plan + "€ / mes)");
            precioElementos.push(precio_plan);

            if (Math.round(cosumoTotalMes * 0.30 - precio_plan, 2) > 0) {
                ahorroElementos.push(Math.round(cosumoTotalMes * 0.30 - precio_plan, 2));
            }else {
                ahorroElementos.push(0);
            }
        }

        // Grafica
        newOptions.push(JSON.parse(JSON.stringify(options)));
        newOptions[newOptions.length - 1].series[0].data = consumoMes;
        new ApexCharts(document.querySelector("#chart" + fecha.getMonth() + "-" + fecha.getFullYear()), newOptions[newOptions.length - 1]).render();

        // Restar mes
        fecha.setMonth(fecha.getMonth() - 1);

        if (randomInRange(1, 10) == 5) {
            precio_plan = planes[randomInRange(0, 2)];
        }
    }

    // Poner los badges
    const elementoMasAlto = elementosReferencia[consumoElementos.indexOf(Math.max(...consumoElementos))];
    const elementoMasBajo = elementosReferencia[consumoElementos.indexOf(Math.min(...consumoElementos))];

    console.log(elementoMasAlto);

    elementoMasAlto.append('<span class="badge text-bg-danger position-absolute top-0 end-0 w-auto m-0">Mes con más consumo</span>');
    elementoMasBajo.append('<span class="badge text-bg-success position-absolute top-0 end-0 w-auto m-0">Mes con menos consumo</span>');

    const mediaPrecio = precioElementos.reduce((a, b) => a + b, 0) / precioElementos.length;
    const mediaConsumo = consumoElementos.reduce((a, b) => a + b, 0) / consumoElementos.length;
    const totalAhorrado = ahorroElementos.reduce((a, b) => a + b, 0);

    console.log(precioElementos.reduce((a, b) => a + b, 0));

    $(".media_consumo").attr("akhi", mediaConsumo);
    $(".media_precio").attr("akhi", mediaPrecio);
    $(".total_ahorro").attr("akhi", totalAhorrado);


    $('.counter').each(function() {
        var $this = $(this);
        var countTo = parseInt($this.attr('akhi'));
    
        $({ countNum: $this.text() }).animate({
          countNum: countTo
        }, {
          duration: 2000,
          easing: 'linear',
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
          }
        });
    });


    $("#plantilla").css("display", "none");
});
