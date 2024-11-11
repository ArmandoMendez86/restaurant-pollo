$(document).ready(function () {
  let reciboVentas = $("#tabVentas").DataTable({
    ajax: {
      url: "controladores/ordenes.controlador.php",
      type: "GET",
      data: function (d) {
        d.accion = "obtenerOrdenes";
      },
      dataType: "json",
    },
    language: {
      url: "assets/js/mx.json",
    },
    lengthMenu: [
      [10, 15, 20, -1],
      [10, 15, 20, "Todos"],
    ],
    order: [[5, "desc"]],
    columns: [
      { data: "id", visible: false },
      { data: "producto", visible: false },
      { data: "n_orden" },
      { data: "empleado" },
      { data: "cliente" },
      {
        data: "fecha",
        render: function (data, type, row) {
          return moment(data).format("DD/MM/YYYY H:mm:ss");
        },
      },

      {
        data: "total",
        render: function (data, type, row) {
          let montoNumerico = parseFloat(data);
          if (isNaN(montoNumerico)) {
            return data;
          }
          return montoNumerico.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
          });
        },
      },
      {
        data: null,
        className: "dt-center",
        defaultContent: `<div class="d-flex justify-content-center align-items-center">
        ${
          $("#rol").text() == "admin"
            ? '<button type="button" class="btn btn-deletVentaEdit"><i class="fa fa-times text-secondary" aria-hidden="true" style="font-size:1.5rem;"></i></button>'
            : ""
        }
          <button type="button" class="btn btn-print-edit"><i class="fa fa-print text-secondary" aria-hidden="true" style="font-size:1.5rem;"></i></button>
          <button type="button" class="btn btn-edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-pencil text-secondary" aria-hidden="true" style="font-size:1.5rem;"></i></button>
          </div>`,
        orderable: false,
      },
    ],
    columnDefs: [
      { targets: 0, className: "text-center align-middle" },
      { targets: 1, className: "align-middle" },
      { targets: 2, className: "align-middle text-center" },
      { targets: 3, className: "text-center align-middle" },
      { targets: 4, className: "text-center align-middle" },
      { targets: 5, className: "text-center align-middle" },
      { targets: 6, className: "text-center align-middle" },
    ],
    footerCallback: function (row, data, start, end, display) {
      let api = this.api();
      let total = api
        .column(6, {
          page: "current",
        })
        .data()
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0);

      let formato = total.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      });

      $(api.column(5).footer()).html("TOTAL");
      $(api.column(6).footer()).html(
        "<p style='width:7rem;margin:0 auto;font-size:1rem'>" + formato + "</p>"
      );
    },

    rowCallback: function (row, data) {
      function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      const randomColor = getRandomColor();
      $($(row).find("td")[0]).css("color", randomColor);
      $($(row).find("td")[0]).css("font-weight", "bold");
    },
  });

  /* ############################# Variables ############################# */
  const listaItems = document.querySelector("#lista-items-edit");
  let articulosCarrito = [];
  let idRow = "";

  cargarListaMenu();

  /* ############################# Color para ordenes ############################# */
  let orderColors = {};
  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  /* ############################# Eliminar venta ############################# */
  $(document).on("click", ".btn-deletVentaEdit", function (e) {
    let row = $(this).closest("tr");
    let rowData = $("#tabVentas").DataTable().row(row).data();

    let idVenta = rowData.id;
    let productos = JSON.parse(rowData.producto);
   

    const cantidadProductos = productos.map((element) => {
      if (
        element.titulo == "pollo" ||
        element.titulo == "sirloin" ||
        element.titulo == "arrach." ||
        element.titulo == "costilla"
      ) {
        let cantidad = parseFloat(element.cantidad * element.porcion);
        return {
          producto: element.titulo,
          almacen: cantidad,
          unico: element.unico,
        };
      } else {
        return {
          producto: element.titulo,
          almacen: element.cantidad,
          unico: element.unico,
        };
      }
    });


    const restaurarAlmacen = JSON.stringify(cantidadProductos);

    $.ajax({
      url: "controladores/ordenes.controlador.php",
      type: "POST",
      data: {
        accion: "eliminarOrden",
        id: idVenta,
      },
      success: function (respuesta) {
        reciboVentas.ajax.reload(null, false);

        /* Restaurar inventario */
        $.ajax({
          url: "controladores/inventario.controlador.php",
          type: "POST",
          data: {
            accion: "restaurarAlmacen",
            restaurar: restaurarAlmacen,
          },
          success: function (respuesta) {
            console.log(respuesta);
          },
        });
      },
    });
  });

  /* ############################# Editar carrito ############################# */
  $(document).on("click", ".btn-edit", function (e) {
    e.preventDefault();
    let row = $(this).closest("tr");
    let rowData = $("#tabVentas").DataTable().row(row).data();

    idRow = rowData.id;
    let cliente = $("#nombreClienteEdit").val(rowData.cliente);
    let numeroOrden = $("#ordenEdit").text(rowData.n_orden);

    let productos = JSON.parse(rowData.producto);

    articulosCarrito = productos;
    carritoHTML();
    actualizarTotal();
  });

  /* ############################# Cargar lista de platillos ############################# */
  function cargarListaMenu() {
    $.ajax({
      url: "controladores/productos.controlador.php",
      type: "GET",
      data: {
        accion: "obtenerProductos",
      },
      success: function (respuesta) {
        let menu = JSON.parse(respuesta);
        html = "";
        menu.forEach((element) => {
          html += `
          <li>
            <div class="delicious" data-unico = ${element.unico}>
                <img class="rounded-circle" src="${
                  element.img
                }" alt="Product Image" style="width:50px;">
                <h1 hidden>${element.porcion}</h1>
                <h2 hidden>${element.unidad}</h2>
                <h6>${element.producto}</h6>
                <span>$${element.precio}</span>
            </div>
            <select name="especialidad" class="form-control" id="especialidad" ${
              element.producto != "pollo" ? "hidden" : ""
            }>
                <option selected value="N">Normal</option>
                <option value="A">Adobado</option>
                <option value="H">Habanero</option>
                <option velue="M">Mayonesa</option>
                <option value="BBQ">BBQ</option>
                <option value="BBP">BBQP</option>
                <option value="E">Enchilado</option>
                <option value="TC">Tamarindo - Chipotle</option>
                <option value="PH">Piña - Habanero</option>
                <option value="MH">Mango - Habanero</option>
            </select>
            <div class="box-items">
              <p>${element.descripcion}</p>
              <a href="#!" data-id =${element.id}>
              <i class="fa item-add-edit fa-plus-circle text-warning fa-2x" aria-hidden="true"></i>
              </a>
            </div>
          </li>
          `;
        });
        $(".menu-items").html(html);
      },
    });
  }

  /* ############################# Agregar platillo ############################# */

  $(".delicious-menu").on("click", function (e) {
    if (e.target.classList.contains("item-add-edit")) {
      const item = e.target.closest("li");
      leerDatosItem(item);
    }
  });

  function leerDatosItem(item) {
    const infoItem = {
      id: item.querySelector("a").getAttribute("data-id"),
      titulo: item.querySelector("h6").textContent,
      porcion: item.querySelector("h1").textContent,
      precio: item.querySelector("span").textContent,
      unidad: item.querySelector("h2").textContent,
      cantidad: 1,
      especialidad: item.querySelector("#especialidad").value,
      imagen: item.querySelector("img").src,
    };

    if (
      articulosCarrito.some(
        (item) =>
          item.id === infoItem.id && item.especialidad === infoItem.especialidad
      )
    ) {
      const items = articulosCarrito.map((item) => {
        if (
          item.id === infoItem.id &&
          item.especialidad === infoItem.especialidad
        ) {
          item.cantidad++;
          return item;
        } else {
          return item;
        }
      });
      articulosCarrito = [...items];
    } else {
      articulosCarrito = [...articulosCarrito, infoItem];
    }

    carritoHTML();
    actualizarTotal();

    const producto = item.querySelector("h6").textContent;
    let porcion = item.querySelector("h1").textContent;
    let unico =item.querySelector(".delicious").getAttribute("data-unico");
  

    /* Logica para mandar a actualizar del almacen */
    let objeto = {};

    if (
      producto == "sirloin" ||
      producto == "arrach." ||
      producto == "costilla"
    ) {
      objeto = {
        producto: producto,
        almacen: porcion,
        unico: "kg",
      };
    } else if (producto == "pollo") {
      objeto = {
        producto: producto,
        almacen: porcion,
        unico: "pz",
      };
    } else {
      objeto = {
        producto: producto,
        almacen: 1,
        unico: unico,
      };
    }

    const descontarProducto = JSON.stringify([objeto]);

    /* Falta ajustar logica  */

    $.ajax({
      url: "controladores/inventario.controlador.php",
      type: "POST",
      data: {
        accion: "descontarAlmacen",
        descontar: descontarProducto,
      },
      success: function (respuesta) {
        console.log(respuesta);
      },
    });





  }

  /* ############################# Redibujar carrito ############################# */

  function carritoHTML() {
    let porcion = "";
    limpiarCarrito();

    articulosCarrito.forEach((item) => {
      if (item.porcion == "0.25") {
        porcion = "1/4";
      } else if (item.porcion == "0.5") {
        porcion = "1/2";
      } else if (item.porcion == "0.75") {
        porcion = "3/4";
      } else if (item.porcion == "1") {
        porcion = "1";
      } else {
        porcion = item.porcion;
      }
      const li = document.createElement("li");
      li.innerHTML = `
                <div class="d-flex align-items-center position-relative justify-content-around item-li">
                    <div class="p-img light-bg">
                        <img class="rounded-circle" src="${item.imagen}" alt="Product Image">
                    </div>
                    <div class="p-data" data-porcion=${item.porcion}>
                    <span hidden>${item.especialidad}</span>
                      <h3 class="font-semi-bold">${item.titulo}</h3>
                      <p class="text-secondary" data-unico = ${item.unico}>
                        ${item.cantidad} x ${item.precio} -> ${porcion} ${item.unidad} ${item.especialidad}
                      </p>
                    </div>
                    <button type="button" class="close borrar-item-edit" data-id-edit=${item.id}>×</button>
                </div> 
            `;

      listaItems.appendChild(li);
    });
  }

  /* ############################# Limpiar carrito ############################# */
  function limpiarCarrito() {
    while (listaItems.firstChild) {
      listaItems.removeChild(listaItems.firstChild);
    }
  }

  /* ############################# Formatear cantidades ############################# */
  function formatearCantidad(cantidad) {
    let monedaMexicana = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(cantidad);

    return monedaMexicana;
  }

  /* ############################# Actualizar totales ############################# */
  function actualizarTotal() {
    let total = articulosCarrito.reduce((acumulador, item) => {
      let precio = item.precio;
      let precioNumerico = parseFloat(precio.replace(/[^0-9.-]+/g, ""));
      let cantidad = parseFloat(item.cantidad);
      return acumulador + precioNumerico * cantidad;
    }, 0);

    let totalFormat = formatearCantidad(total);

    $(".precioTotalEdit").text(totalFormat);
  }

  /* ############################# Eliminar platillo ############################# */
  $(document).on("click", ".borrar-item-edit", function (e) {
    e.preventDefault();

    const itemLi = e.target.closest(".item-li");

    let especialidad = itemLi.querySelector("span").textContent;
    const itemId = e.target.getAttribute("data-id-edit");
    const porcion = itemLi
      .querySelector(".p-data")
      .getAttribute("data-porcion");
    const unico = itemLi
      .querySelector(".text-secondary")
      .getAttribute("data-unico");

    const producto = itemLi.querySelector("h3").textContent;

    articulosCarrito.forEach((item) => {
      if (item.id == itemId && item.especialidad == especialidad) {
        if (item.cantidad > 1) {
          item.cantidad = item.cantidad - 1;
        } else {
          articulosCarrito = articulosCarrito.filter(
            (item) => !(item.id == itemId && item.especialidad == especialidad)
          );
        }
      }
    });

    carritoHTML();
    actualizarTotal();

    /* Logica para mandar a actualizar del almacen */
    let objeto = {};

    if (
      producto == "sirloin" ||
      producto == "arrach." ||
      producto == "costilla"
    ) {
      objeto = {
        producto: producto,
        almacen: porcion,
        unico: "kg",
      };
    } else if (producto == "pollo") {
      objeto = {
        producto: producto,
        almacen: porcion,
        unico: "pz",
      };
    } else {
      objeto = {
        producto: producto,
        almacen: 1,
        unico: unico,
      };
    }

    const restaurarProducto = JSON.stringify([objeto]);

    $.ajax({
      url: "controladores/inventario.controlador.php",
      type: "POST",
      data: {
        accion: "restaurarAlmacen",
        restaurar: restaurarProducto,
      },
      success: function (respuesta) {
        console.log(respuesta);
      },
    });
  });

  /* ############################# Generar ticket ############################# */
  $("#ticketEdit").on("click", function (e) {
    e.preventDefault();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [50, 297],
    });

    let total = $(".precioTotalEdit").text();
    let cliente = $("#nombreClienteEdit").val();
    let numeroOrden = $("#ordenEdit").text();
    let fechaFormat = moment().format("YYYY-MM-DD H:mm:ss");
    let fecha = moment().format("DD/MM/YYYY H:mm:ss");
    let empleado = $("#nameSesion").text();

    let productosHTML = `<table style="width:100%; font-size:6px;border-collapse: collapse;">
      <thead>
          <tr>
              <th style="text-align:center; border-bottom: 1px solid #000;padding:1px;">N°</th>
              <th style="text-align:center; border-bottom: 1px solid #000;padding:1px;">Prod.</th>
              <th style="text-align:center; border-bottom: 1px solid #000;padding:1px;">Porción</th>
              <th style="text-align:center; border-bottom: 1px solid #000;padding:1px;">Unid.</th>
              <th style="text-align:center; border-bottom: 1px solid #000;padding:1px;">Cant.</th>
              <th style="text-align:center; border-bottom: 1px solid #000;padding:1px;">Precio</th>
              <th style="text-align:center; border-bottom: 1px solid #000;padding:1px;">Sub.</th>
          </tr>
      </thead>
      <tbody>`;

    // Construir la cadena de productos
    articulosCarrito.forEach((element, index) => {
      let precioNumerico = parseFloat(element.precio.replace(/[^0-9.-]+/g, ""));
      productosHTML += `<tr>
          <td>${index + 1}</td>
          <td>${element.titulo}</td>
          <td>${element.porcion}</td>
          <td>${element.unidad}</td>
          <td>${element.cantidad}</td>
          <td>${element.precio}</td>
          <td>$${(element.cantidad * precioNumerico).toFixed(2)}</td>
      </tr>`;
    });

    productosHTML += `</tbody></table>`;

    // Renderizar el encabezado en el PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.text(`Orden N°. ${numeroOrden}`, 10, 18);

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total:${total}`, 27, 30);
    doc.setFontSize(8);
    doc.text(`Atendió: ${empleado}`, 1, 30);
    doc.text(`Cliente: ${cliente}`, 1, 40);
    doc.text(`Fecha: ${fecha}`, 1, 43);
    doc.text("Productos:", 1, 50);

    doc.html(productosHTML, {
      callback: function (doc) {
        // Guardar el PDF
        doc.save(`${numeroOrden}.pdf`);
      },
      x: 1,
      y: 55,
      html2canvas: { scale: 0.35 },
    });

    generarOrden(fechaFormat, numeroOrden, cliente, total, idRow, empleado);
  });

  /* ############################# Modificar orden ############################# */
  function generarOrden(fecha, numeroOrden, cliente, total, idRow, empleado) {
    let productos = JSON.stringify(articulosCarrito);
    $.ajax({
      url: "controladores/ordenes.controlador.php",
      type: "POST",
      data: {
        accion: "editarOrden",
        id: idRow,
        producto: productos,
        n_orden: numeroOrden,
        empleado: empleado,
        fecha: fecha,
        cliente: cliente,
        total: total,
      },
      success: function (respuesta) {
        reciboVentas.ajax.reload(null, false);
        $("#staticBackdrop").modal("hide");
      },
    });
  }

  /* ############################# Generar ticket desde tabla ############################# */
  $(document).on("click", ".btn-print-edit", function (e) {
    e.preventDefault();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [50, 297],
    });

    // Obtención de datos de la tabla
    let row = $(this).closest("tr");
    let rowData = $("#tabVentas").DataTable().row(row).data();
    let cliente = rowData.cliente;
    let numeroOrden = rowData.n_orden;
    let total = formatearCantidad(rowData.total);
    let fecha = rowData.fecha;
    let fechaFormat = moment(fecha).format("DD/MM/YYYY H:mm:ss");
    let articulos = JSON.parse(rowData.producto);
    let empleado = $("#nameSesion").text();

    // Crear tabla en HTML para ser renderizada en el PDF
    let productosHTML = `<table style="width:100%; font-size:6px;border-collapse: collapse;">
      <thead>
          <tr>
              <th style="text-align:center; border-bottom: 1px solid #000;">N°</th>
              <th style="text-align:center; border-bottom: 1px solid #000;">Prod.</th>
              <th style="text-align:center; border-bottom: 1px solid #000;">Porción</th>
              <th style="text-align:center; border-bottom: 1px solid #000;">Unid.</th>
              <th style="text-align:center; border-bottom: 1px solid #000;">Cant.</th>
              <th style="text-align:center; border-bottom: 1px solid #000;">Precio</th>
              <th style="text-align:center; border-bottom: 1px solid #000;">Sub.</th>
          </tr>
      </thead>
      <tbody>`;

    articulos.forEach((element, index) => {
      let precioNumerico = parseFloat(element.precio.replace(/[^0-9.-]+/g, ""));
      productosHTML += `<tr>
          <td>${index + 1}</td>
          <td>${element.titulo}</td>
          <td>${element.porcion}</td>
          <td>${element.unidad}</td>
          <td>${element.cantidad}</td>
          <td>${element.precio}</td>
          <td>$${(element.cantidad * precioNumerico).toFixed(2)}</td>
      </tr>`;
    });

    productosHTML += `</tbody></table>`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.text(`Orden N°. ${numeroOrden}`, 10, 18);

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${total}`, 27, 30);

    doc.setFontSize(7);
    doc.text(`Atendió: ${empleado}`, 1, 30);
    doc.text(`Cliente: ${cliente}`, 1, 40);
    doc.text(`Fecha: ${fechaFormat}`, 1, 45);
    doc.text("Productos:", 1, 50);

    doc.html(productosHTML, {
      callback: function (doc) {
        // Guardar el PDF
        doc.save(`${numeroOrden}.pdf`);
      },
      x: 1,
      y: 55,
      html2canvas: { scale: 0.35 },
    });
  });
});
