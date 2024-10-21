
var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
var fechaActual = new Date();
var mesActual = fechaActual.getMonth();
var mesYear = [];
var precioPorKWh = obtenerDeLocalStorage("precio_plan");
var years = [];
var diaMaximo;
var mesesConConsumoDiario = [];


// graficos
var chartDays;
var chartDaysOptions = {};
var chartHours;
var chartHoursOptions = {};
var chartWeeks;
var chartWeeksOptions = {};
var chartDaysYear;
var chartDaysYearOptions = {};
var chartMonths;
var chartMonthsOptions = {};
var chartRealTime;
var chartRealTimeOptions = {};

// Generar cosas por meses
var kWhGenerado = [295, 217, 240, 232, 141, 114, 157, 145, 282, 289, 304, 358];
var kWhAhorrado = Array(12).fill().map(function() {return randomInRange(10, 90)});

$.each(meses, function (index, element) {
  if (index > mesActual) {
      years.push(fechaActual.getFullYear() - 1);
  }else {
      years.push(fechaActual.getFullYear());
  }

  mesYear.push(meses[index] + " " + years[index]);
});

// Dias con consumo
for (let i = 0; i < kWhGenerado.length; i++) {
  if (i == mesActual && mesActual == fechaActual.getMonth()) {
    mesesConConsumoDiario.push(repartirNumero(Math.floor(kWhGenerado[i] /  obtenerLongitudMes(years[i], i)) * fechaActual.getDate(), fechaActual.getDate()));
    console.log("actual");
  }else {
    mesesConConsumoDiario.push(repartirNumero(kWhGenerado[i], obtenerLongitudMes(years[i], i)));
  }
  
}



for (let i = 0; i < mesesConConsumoDiario.length; i++) {
  kWhGenerado[i] = mesesConConsumoDiario[i].reduce((a, b) => a + b, 0);
}


function formatDate (fecha) {
    var dia = agregarCeroDelante(fecha.getDate());
    var mes = agregarCeroDelante(fecha.getMonth() + 1);
    var año = fecha.getFullYear();

    var fechaFormateada = dia + "/" + mes + "/" + año;

    return fechaFormateada;
};

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

    // if (mesActual == fechaActual.getMonth()) {
    //   cantidadDivisiones = fechaActual.getDate();
    // }

    var valoresEscalados = Array.from({ length: cantidadDivisiones }, () => Math.floor((numeroInicial / cantidadDivisiones)) < 5 ? Math.floor((numeroInicial / cantidadDivisiones) + randomInRange(-1, 2)) : Math.floor((numeroInicial / cantidadDivisiones) - randomInRange(-5, 5)));

    // for (let index = 0; index < (obtenerLongitudMes(years[mesActual], mesActual) - cantidadDivisiones); index++) {
    //   valoresEscalados.push(0);
      
    // }

    return valoresEscalados;
}


function agregarCeroDelante(numero) {
    return numero < 10 ? '0' + numero : numero;
}

function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

function sumarElementosEnRango(lista, indiceInicio, indiceFin) {

    var sublista = lista.slice(indiceInicio, indiceFin + 1);

    var suma = sublista.reduce((acumulador, elemento) => acumulador + elemento, 0);

    return suma;
}

function generateData(cantidad, propiedades) {
  resultado = [];
  minimo = propiedades["min"];
  maximo = propiedades["max"];

  for (let index = 0; index < cantidad; index++) {
    resultado.push(randomInRange(minimo, maximo));
  }

  return resultado;
}

function actualizeData () {
    $("#kWhGenerado").attr("akhi",kWhGenerado[mesActual] + " ");

    if (precioPorKWh < 5) {
      $("#kWhAhorrado").attr("akhi", Math.round(kWhAhorrado[mesActual] * precioPorKWh, 2));
      $("#dineroGastado").attr("akhi", Math.round(kWhGenerado[mesActual] * precioPorKWh, 2));
    }else {
      if (Math.round(kWhGenerado[mesActual] * 0.30 - precioPorKWh, 2) > 0) {
        $("#kWhAhorrado").attr("akhi", Math.round(kWhGenerado[mesActual] * 0.30 - precioPorKWh, 2));
      }else {
        $("#kWhAhorrado").attr("akhi", 0);
      }
      
      $("#dineroGastado").attr("akhi", Math.round(precioPorKWh, 2));
    }
    

    // counters animacion
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


    $("#modalMes .modal-header h1").text("Mes de " + meses[mesActual] + " " + years[mesActual]);

    if (mesActual == fechaActual.getMonth()) {
        $("#tituloMes").text("Este mes de " + meses[mesActual] + " " + years[mesActual]);
    }else {
        $("#tituloMes").text("Mes de " + meses[mesActual] + " " + years[mesActual]);
    }

    diasMes = Array.from({ length: obtenerLongitudMes(years[mesActual], mesActual) }, (_, index) => index + 1);
    // console.log(obtenerLongitudMes(years[mesActual], mesActual));
    valuesKwhFromDays = mesesConConsumoDiario[mesActual];

    chartDaysOptions =  {
        series: [{
          name: "Kwh",
          data: valuesKwhFromDays
      }],
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Consumo de KWh por días',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: diasMes,
      }
    };

    if (!chartDays) {
      chartDays = new ApexCharts(document.querySelector("#chartDays"), chartDaysOptions);
      chartDays.render();
    }else {
      chartDays.updateOptions(chartDaysOptions);
    }
    

    diaMaximo = Math.max(...valuesKwhFromDays);
    diaMaximo = valuesKwhFromDays.indexOf(diaMaximo) + 1;

    consumoHoras =  Array.from({ length: 24 }, () => randomInRange(10, 25));


    $("#diaConsumoMaximo").text(diaMaximo + "/" + (mesActual+1) + "/" + years[mesActual]);

    chartHoursOptions = {
        series: [{
        name: 'kWh',
        data: consumoHoras,
      }],
        chart: {
        height: 400,
        type: 'radar',
      },
      title: {
        text: 'Consumo de KWh por horas'
      },
      xaxis: {
        categories: ['1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 am', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 am', '8 pm', '9 pm', '10 pm', '11 pm', '12 pm']
      }
    };

    if (!chartHours) {
      chartHours = new ApexCharts(document.querySelector("#chartHours"), chartHoursOptions);
      chartHours.render();
    }else {
      chartHours.updateOptions(chartHoursOptions);
    }
    

    var consumoSemanas = [sumarElementosEnRango(valuesKwhFromDays, 0, 6), sumarElementosEnRango(valuesKwhFromDays, 7, 13), sumarElementosEnRango(valuesKwhFromDays, 14, 20), sumarElementosEnRango(valuesKwhFromDays, 21, 31)];
    chartWeeksOptions = {
        series: [{
        name: 'Consumo',
        data: consumoSemanas
      }],
        chart: {
        type: 'bar',
        height: 400
      },

      title: {
        text: 'Consumo de KWh por semanas'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ["1º semana", "2º semana", "3º semana", "4º semana"],
      },
    //   yaxis: {
    //     title: {
    //       text: '$ (thousands)'
    //     }
    //   },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " KWh"
          }
        }
      }
    };

    if (!chartWeeks) {
      chartWeeks = new ApexCharts(document.querySelector("#chartWeeks"), chartWeeksOptions);
      chartWeeks.render();
    }else {
      chartWeeks.updateOptions(chartWeeksOptions);
    }
    

}

function actualizeUser() {
  if (existeEnLocalStorage("user")) {
    var user = obtenerDeLocalStorage("user").split(" ")[0];
    var letra = user.slice(-1);

    $(".titulo").text("¡Bienvenid" + (letra == "a" ? "a" : "o") + " de nuevo " + user + "!");
  }
  
}

$(document).ready(function () {
   actualizeUser();
    

    $.each(meses, function (index, element) {
        $("#selectMeses").append(`<option value="${index}" ${index == mesActual ? "selected": ""}>${capitalizarPrimeraLetra(element) + " " + years[index]}</option>`)
    });

    $("#fechaActual").text("Hoy es " + formatDate(fechaActual));

    $("#comparacion_gastos").attr("akhi", randomInRange(5, 95));

    if ($("#comparacion_gastos").attr("akhi") < 50) {
      $("#comparacion_gastos").addClass("text-success");
    }else {
      $("#comparacion_gastos").addClass("text-danger");
    }

    $("#comparacion_ahorro").attr("akhi", randomInRange(10, 95));

    if ($("#comparacion_ahorro").attr("akhi") > 50) {
      $("#comparacion_ahorro").addClass("text-success");
    }else {
      $("#comparacion_ahorro").addClass("text-danger");
    }

    actualizeData();

    $("#selectMeses").change(function () {
        mesActual = parseInt($("#selectMeses").val());
        // console.log(mesActual);
        actualizeData();
    });

    chartDaysYearOptions = {
      series: [{
      name: meses[0] + " " + years[0],
      data: mesesConConsumoDiario[0]
    },
    {
      name:  meses[1] + " " + years[1],
      data: mesesConConsumoDiario[1]
    },
    {
      name:  meses[2] + " " + years[2],
      data: mesesConConsumoDiario[2]
    },
    {
      name:  meses[3] + " " + years[3],
      data: mesesConConsumoDiario[3]
    },
    {
      name:  meses[4] + " " + years[4],
      data: mesesConConsumoDiario[4]
    },
    {
      name:  meses[5] + " " + years[5],
      data: mesesConConsumoDiario[5]
    },
    {
      name:  meses[6] + " " + years[6],
      data: mesesConConsumoDiario[6]
    },
    {
      name:  meses[7] + " " + years[7],
      data: mesesConConsumoDiario[7]
    },
    {
      name:  meses[8] + " " + years[8],
      data: mesesConConsumoDiario[8]
    },
    {
      name:  meses[9] + " " + years[9],
      data: mesesConConsumoDiario[9]
    },
    {
      name:  meses[10] + " " + years[10],
      data: mesesConConsumoDiario[10]
    },
    {
      name:  meses[11] + " " + years[11],
      data: mesesConConsumoDiario[11]
    }
    ],
      chart: {
      height: 350,
      type: 'heatmap',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },

  //   responsive: [{
  //     breakpoint: 768, // Puedes ajustar este valor según tus necesidades
  //     options: {
  //         chart: {
  //             width: '100%', // Ajusta el ancho del gráfico al 100% del contenedor
  //             height: 'auto' // Permite que la altura del gráfico se ajuste automáticamente
  //         }
  //     }
  // }],

    tooltip: {
      y: {
        formatter: function (val) {
          return val + " KWh"
        }
      }
    },
    colors: ["#008FFB"],
    title: {
      text: 'Consumo de KWh por dias del año'
    },
    };

    chartDaysYear = new ApexCharts(document.querySelector("#chartDaysYear"), chartDaysYearOptions);
    chartDaysYear.render();

    chartMonthsOptions = {
      series: [{
      name: "KWh",
      data: kWhGenerado
    }],
      chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    
    
    title: {
      text: 'Consumo de KWh por meses',
      
    },
    labels: mesYear,
  
    };

    chartMonths = new ApexCharts(document.querySelector("#chartMonths"), chartMonthsOptions);
    chartMonths.render();
  

    // Grafico RealTime
    // Inicializamos los datos
var data = [];
var series = [{
  name: "KWh gastados",
  data: data
}];
var lastDate = new Date();
var lastValue = 0;
var ultimo = 1;

// Creamos el gráfico de línea con ApexCharts
chartRealTimeOptions = {
  chart: {
    id: 'realtime',
    height: 350,
    type: 'line',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  series: series,
  title: {
    text: 'Consumo en tiempo real',
    align: 'left'
  },
  markers: {
    size: 0,
  },
  
  xaxis: {
    type: 'datetime',
    range: 20000
  },
  
  legend: {
    show: false
  },

  yaxis: {
    max: 2,
    min: 0
  },

  tooltip: {
    x: {
        format: 'HH:mm:ss' // Formato de hora
    }
  }
};

chartRealTime = new ApexCharts(document.querySelector("#chartRealTime"), chartRealTimeOptions);
chartRealTime.render();

function generarValor() {
  var variacion;
  
  // Si el valor anterior es mayor que 1.0, la variación puede ser positiva o negativa con igual probabilidad
  if (lastValue > 0.2) {
      variacion = (Math.random() > 0.5 ? 1 : -1) * (Math.random() - 0.4) * 0.2;
  } else {
      variacion = (Math.random() - 0.4) * 0.2;
  }
  
  var nuevoValor = lastValue + variacion;

  // Limitar el rango entre 0.0 y 2.0
  if (nuevoValor < 0.0) {
      nuevoValor = 0.0;
  } else if (nuevoValor > 2.0) {
      nuevoValor = 2.0;
  }

  return parseFloat(nuevoValor.toFixed(2)); // Devuelve el valor generado como número flotante
}
// Generamos nuevos datos aleatorios
function getRandomData() {
  var currentDate = new Date(); // Obtener la hora actual

  // Sumar una hora y un segundo en milisegundos
  var unaHoraEnMilisegundos = 3600 * 1000;
  var unSegundoEnMilisegundos = 1 * 1000;

  // Sumar una hora y un segundo a la hora actual
  lastDate = new Date(currentDate.getTime() + unaHoraEnMilisegundos + unSegundoEnMilisegundos);


  lastValue = generarValor();

  if (lastValue < 0.1) {
    lastValue = 0.1;
  }
  

  data.push({
    x: lastDate,
    y: lastValue
  });

  chartRealTime.updateSeries([{ data: data }]);
}

// Actualizamos los datos cada segundo
window.setInterval(function () {
  getRandomData()
}, 1000);

if (obtenerDeLocalStorage("precio_plan") < 0.26) {
  $("#chartRealTime").css("filter", "blur(5px)");
  $("#tarjetaPagaMas").css("display", "flex");
}

});

