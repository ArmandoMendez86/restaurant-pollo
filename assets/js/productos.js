$(document).ready(function () {
  let table = $("#menuTable").DataTable({
    dom: '<"top"f>rt<"bottom"pl><"clear">',
    scrollY: "550px",
    paging: true,
    searching: true,
    info: false,
    hover: false,
    columnDefs: [
      {
        targets: "_all",
        orderable: false,
      },
    ],
    ajax: {
      url: "controladores/productos.controlador.php",
      dataSrc: function (json) {
        let porcion = "";
        return json.map(function (item) {
          if (
            item.categoria == "pollo" ||
            item.categoria == "carne" ||
            item.categoria == "extras" ||
            item.categoria == "mesa"
          ) {
            if (item.porcion == "0.25") {
              porcion = "1/4";
            }
            if (item.porcion == "0.5") {
              porcion = "1/2";
            }
            if (item.porcion == "0.75") {
              porcion = "3/4";
            }
            if (item.porcion == "1") {
              porcion = "1";
            }
          } else {
            porcion = item.porcion;
          }

          return [
            `   <div class="fast-food-menus">
                    <div class="fast-food-img">
                     <img alt="fast-food-img" src="${item.img}">
                </div>
                <div>
                <button type="button" class="apply-coupon rounded-circle" style="width:50px;height:50px;padding:8px;position:absolute;top:5px;right:10px;font-size:13px;" value="${porcion}">${porcion}${
              item.unidad
            }</button>
                    <h3>${
                      item.producto == "pollo"
                        ? item.descripcion
                        : item.producto
                    }</h3>
                    <h2 hidden>${item.producto}</h2>
                    <h5 hidden>${item.porcion}</h5>
                    <h6 hidden>${item.unidad}</h6>
                    <p hidden>${item.categoria}</p>
                    <span>$${item.precio}</span>
                    <select name="especialidad" class="form-control" id="especialidad" ${
                      item.producto != "pollo" ? "hidden" : ""
                    }>
                        <option selected value="N">Normal</option>
                        <option value="A">Adobado</option>
                        <option value="H">Habanero</option>
                        <option value="M">Mayonesa</option>
                        <option value="BBQ">BBQ</option>
                        <option value="BBP">BBQP</option>
                        <option value="E">Enchilado</option>
                        <option value="TC">Tamarindo - Chipotle</option>
                        <option value="PH">Piña - Habanero</option>
                        <option value="MH">Mango - Habanero</option>
                    </select>
                       
                
                </div>
                    <a href="#!" data-id =${item.id}>
                    <i class="fa btn-add fa-cart-plus fa-2x text-white" aria-hidden="true"></i>
                    </a>
                </div>`,
          ];
        });
      },
      data: function (d) {
        d.accion = "obtenerProductos"; // Enviar datos adicionales
      },
    },
    language: {
      url: "assets/js/mx.json",
    },
    lengthMenu: [
      [6, 12, 18, -1],
      [6, 12, 18, "Todos"],
    ],
  });

  // Funcionalidad para botónes de búsqueda
  $("#carne").on("click", function () {
    table.search("carne").draw(); // Realizar búsqueda con el texto "Chicken"
  });
  $("#pollo").on("click", function () {
    table.search("pollo").draw(); // Realizar búsqueda con el texto "Chicken"
  });
  $("#extras").on("click", function () {
    table.search("extras").draw(); // Realizar búsqueda con el texto "Chicken"
  });
  $("#bebidas").on("click", function () {
    table.search("bebidas").draw(); // Realizar búsqueda con el texto "Chicken"
  });
  $("#mesa").on("click", function () {
    table.search("mesa").draw(); // Realizar búsqueda con el texto "Chicken"
  });

  /* ############################# Variables ############################# */
  const listaItems = document.querySelector("#lista-items");
  let articulosCarrito = [];
  onOfCarrito();

  /* ############################# Formatear cantidad ############################# */
  function formatearCantidad(cantidad) {
    let monedaMexicana = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(cantidad);

    return monedaMexicana;
  }

  /* ############################# Eventos click ############################# */
  $("#menuTable").on("click", function (e) {
    if (e.target.classList.contains("btn-add")) {
      const item = e.target.closest(".fast-food-menus");
      leerDatosItem(item);
      $(".cart-popup").addClass("show-cart");
    }
  });
  $("#vaciar-carrito").on("click", function (e) {
    vaciarCarrito();
  });

  /* ############################# Generar id venta ############################# */
  function generarIdVenta() {
    const randomPart = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    const timePart = Date.now().toString().slice(-2);
    const numeroOrden = randomPart + timePart;

    return numeroOrden;
  }

  /* ############################# Generar ticket ############################# */
  $("#ticket").on("click", function (e) {
    e.preventDefault();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 297],
    });

    let total = $(".precioTotal").text();
    let cliente = $("#nombreCliente").val();
    let fecha = moment().format("DD/MM/YYYY H:mm:ss");
    let fechaFormat = moment().format("YYYY-MM-DD H:mm:ss");
    let numOrden = generarIdVenta();

    if (cliente == "") return;

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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text(`Orden N°. ${numOrden}`, 17, 20);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total:${total}`, 45, 30);
    doc.setFontSize(8);
    doc.text(`Atendió: xxxxx`, 5, 30);
    doc.text(`Cliente: ${cliente}`, 5, 40);
    doc.text(`Fecha: ${fecha}`, 5, 45);
    doc.text("Productos:", 5, 50);

    doc.html(productosHTML, {
      callback: function (doc) {
        doc.save(`${numOrden}.pdf`);
      },
      x: 5,
      y: 55,
      html2canvas: { scale: 0.5 },
    });
    generarOrden(fechaFormat, numOrden, cliente, total);
  });

  /* ############################# Eliminar orden ############################# */
  $(document).on("click", ".borrar-item", function (e) {
    e.preventDefault();

    const itemLiP = e.target.closest(".item-li-p");

    const itemId = e.target.getAttribute("data-id");
    let especialidad = itemLiP.querySelector("span").textContent;

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
    cantidadArticulos();
    if (articulosCarrito.length == 0) {
      ocultarCarro();
    }
  });

  /* ############################# Leer orden ############################# */
  function leerDatosItem(item) {
    const infoItem = {
      id: item.querySelector("a").getAttribute("data-id"),
      titulo: item.querySelector("h2").textContent,
      porcion: item.querySelector("h5").textContent,
      precio: item.querySelector("span").textContent,
      unidad: item.querySelector("h6").textContent,
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
    cantidadArticulos();
  }

  /* ############################# Regenerar HTML ############################# */
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
                <div class="d-flex align-items-center position-relative justify-content-around item-li-p">
                <div class="p-img light-bg">
                    <img src="${item.imagen}" alt="Product Image">
                </div>
                <div class="p-data">
                <span hidden>${item.especialidad}</span
                    <h3 class="font-semi-bold">${item.titulo}</h3>
                    <p class="text-secondary">
                      ${item.cantidad} x ${item.precio} -> ${porcion} ${item.unidad} ${item.especialidad}
                    </p>
                </div>
                <button type="button" class="close borrar-item" data-id=${item.id}>×</button>
                </div> 
            `;
      listaItems.appendChild(li);
    });
  }

  /* ############################# Vaciar carrito ############################# */
  function vaciarCarrito() {
    while (listaItems.firstChild) {
      listaItems.removeChild(listaItems.firstChild);
    }
    articulosCarrito = [];
    actualizarTotal();
    ocultarCarro();
    cantidadArticulos();
  }

  /* ############################# Limpiar carrito ############################# */
  function limpiarCarrito() {
    // forma rapida (recomendada)
    while (listaItems.firstChild) {
      listaItems.removeChild(listaItems.firstChild);
    }
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

    $(".precioTotal").text(totalFormat);
  }

  /* ############################# Ocultar carrito vacio ############################# */
  function ocultarCarro() {
    $("#nombreCliente").val("");
    setTimeout(() => {
      $(".cart-popup").removeClass("show-cart");
    }, 1500);
  }

  /* ############################# Número de articulos ############################# */
  function cantidadArticulos() {
    let numeroArticulos = articulosCarrito.reduce(
      (acumulador, item, cliente) => {
        return acumulador + item.cantidad;
      },
      0
    );
    $(".donation").attr("data-count", numeroArticulos);

    onOfCarrito();
  }

  /* ############################# Registrar orden ############################# */
  function generarOrden(fecha, numeroOrden, cliente, total) {
    let productos = JSON.stringify(articulosCarrito);

    $.ajax({
      url: "controladores/ordenes.controlador.php",
      type: "POST",
      data: {
        accion: "crearOrden",
        producto: productos,
        n_orden: numeroOrden,
        empleado: "oswaldo",
        fecha: fecha,
        cliente: cliente,
        total: total,
      },
      success: function (respuesta) {
        alertify.success("Orden registrada!");
      },
    });
  }

  /* ############################# Efecto pointer a botton ############################# */
  function onOfCarrito() {
    if (articulosCarrito.length == 0) {
      $("#ticket").css("pointer-events", "none");
    } else {
      $("#ticket").css("pointer-events", "auto");
    }
  }
});
