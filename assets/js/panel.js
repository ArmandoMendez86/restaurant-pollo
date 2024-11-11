$(document).ready(function () {
  const gastos = $("#gastosCantidad");
  const venta = $("#ventaCantidad");
  const caja = $("#cajaApertura");
  const neto = $("#netoCantidad");

  // Llamada a ambas funciones AJAX usando Promise.all
  Promise.all([obtenerTotalGasto(), obtenerCaja(), obtenerTotalVenta()])
    .then(([totalGastos, montoCaja, totalVentas]) => {
      // Formatear las cantidades en moneda mexicana
      const formatoGastos = totalGastos.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      });
      const formatoCaja = montoCaja.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      });
      const formatoVentas = totalVentas.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      });
      const totalNeto = totalVentas - totalGastos;
      const formatoNeto = totalNeto.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      });

      // Mostrar los resultados en la interfaz con formato de moneda
      gastos.html(formatoGastos);
      caja.html(formatoCaja);
      venta.html(formatoVentas);
      neto.html(formatoNeto);
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });

  function obtenerTotalGasto() {
    return $.ajax({
      url: "controladores/gastos.controlador.php",
      type: "POST",
      data: {
        accion: "obtenerTotalGasto",
      },
    }).then((respuesta) => {
      let datos = JSON.parse(respuesta);
      return parseFloat(datos[0].total_monto); // Retornar el monto como número
    });
  }
  function obtenerCaja() {
    return $.ajax({
      url: "controladores/gastos.controlador.php",
      type: "POST",
      data: {
        accion: "obtenerCaja",
      },
    }).then((respuesta) => {
      let datos = JSON.parse(respuesta);
      return parseFloat(datos[0].monto);
    });
  }

  function obtenerTotalVenta() {
    return $.ajax({
      url: "controladores/ordenes.controlador.php",
      type: "POST",
      data: {
        accion: "totalVentaOrdenes",
      },
    }).then((respuesta) => {
      let datos = JSON.parse(respuesta);
      return parseFloat(datos[0].total_monto); // Retornar el monto como número
    });
  }
});
