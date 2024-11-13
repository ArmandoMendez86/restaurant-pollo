$(document).ready(function () {
  let tablaContabilidad = $("#contabilidad").DataTable({
    ajax: {
      url: "controladores/contabilidad.controlador.php",
      type: "GET",
      data: function (d) {
        d.accion = "obtenerContabilidad";
      },
      dataType: "json",
    },
    language: {
      url: "assets/js/mx.json",
    },
    lengthMenu: [
      [5, 10, 15, -1],
      [5, 10, 15, "Todos"],
    ],
    order: [[6, "desc"]],
    columns: [
      { data: "id", visible: false }, // Índice o número
      {
        data: "producto",
      }, // Producto
      {
        data: "unidad",
      }, // Unidad
      {
        data: "especialidad",
      }, // Sabor
      {
        data: "cantidad",
      },
      {
        data: "unico",
      },
      {
        data: "fecha",
        render: function (data, type, row) {
          return moment(data).format("DD/MM/YYYY H:mm:ss");
        },
      },
    ],

    columnDefs: [
      { targets: 0, className: "align-middle" },
      { targets: 1, className: "align-middle text-center" },
      { targets: 2, className: "align-middle text-center" },
      { targets: 3, className: "align-middle text-center" },
      { targets: 4, className: "align-middle text-center" },
      { targets: 5, className: "align-middle text-center" },
      { targets: 6, className: "align-middle text-center" },
    ],

    footerCallback: function (row, data, start, end, display) {
      let api = this.api();
      let total = api
        .column(4, { page: "current" })
        .data()
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0);

      $(api.column(3).footer()).html("TOTAL");

      $(api.column(4).footer()).html(
        `<p style='width:7rem;margin:0 auto;font-size:1rem'>${total}</p>`
      );
    },
  });
});
