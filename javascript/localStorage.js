// Guardar un valor en localStorage
function guardarEnLocalStorage(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// Obtener un valor de localStorage
function obtenerDeLocalStorage(clave) {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : null;
}

// Eliminar un valor de localStorage
function eliminarDeLocalStorage(clave) {
    localStorage.removeItem(clave);
}

// Limpiar todos los datos de localStorage
function limpiarLocalStorage() {
    localStorage.clear();
}

function existeEnLocalStorage(clave) {
    return localStorage.getItem(clave) !== null;
}