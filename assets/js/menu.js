$(document).ready(function () {
  let tablaMenu = $(".menu").DataTable({
    ajax: {
      url: "controladores/productos.controlador.php",
      type: "GET",
      data: function (d) {
        d.accion = "obtenerMenu";
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
    columns: [
      { data: "id", visible: false },
      {
        data: "producto",
        render: function (data, type, row) {
          let formato = capitalizeFirstLetter(data);
          return formato;
        },
      },
      {
        data: "porcion",
        render: function (data, type, row) {
          if (data == "0.25") {
            return `<span class="badge bg-dark">1/4</span>`;
          } else if (data == "0.5") {
            return `<span class="badge bg-dark">1/2</span>`;
          } else if (data == "0.75") {
            return `<span class="badge bg-dark">3/4</span>`;
          } else if (data == "1") {
            return `<span class="badge bg-dark">1</span>`;
          } else {
            return `<span class="badge bg-dark">${data}</span>`;
          }
        },
      },
      {
        data: "unidad",
        render: function (data, type, row) {
          let formato = capitalizeFirstLetter(data);
          return `<span class="badge bg-danger">${formato}</span>`;
        },
      },
      {
        data: "categoria",
        render: function (data, type, row) {
          let formato = capitalizeFirstLetter(data);
          return formato;
        },
      },
      {
        data: "precio",
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
      { data: "descripcion" },
      {
        data: "img",
        render: function (data, type, row) {
          let imagenPath = data.replace("../", "");
          return `<img class="img-producto" src="${imagenPath}" style="width:100px;height:80px;border-radius:5px;">`;
        },
      },
      {
        data: null,
        className: "dt-center",
        defaultContent:
          '<div class="d-flex justify-content-center align-items-center"><button type="button" class="btn btn-editProducto" data-bs-toggle="modal" data-bs-target="#productos"><i class="fa fa-pencil text-secondary" aria-hidden="true" style="font-size:1.5rem;"></i></button><button type="button" class="btn btn-deletProducto"><i class="fa fa-times text-secondary" aria-hidden="true" style="font-size:1.5rem;"></i></button></div>',
        orderable: false,
      },
    ],

    columnDefs: [
      { targets: 0, className: "align-middle text-center" },
      { targets: 1, className: "align-middle" },
      { targets: 2, className: "align-middle text-center" },
      { targets: 3, className: "align-middle text-center" },
      { targets: 4, className: "align-middle text-center" },
      { targets: 5, className: "align-middle text-center" },
      { targets: 6, className: "align-middle" },
      { targets: 7, className: "align-middle text-center" },
      { targets: 8, className: "align-middle text-center" },
    ],
  });

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /*=============================================
	QUITANDO Y AGREGANDO CLASES / RESET FORMULARIO
	=============================================*/

  $(document).on("click", ".btnAgregarProducto", function () {
    $("#guardarCambiosProducto").addClass("d-none");
    $("#agregarProducto").removeClass("d-none");
  });

  $("#productos").on("hidden.bs.modal", function (e) {
    $("#formProductos").trigger("reset");
    $(".imagen-producto").attr("src", "assets/img/market.jpg");
  });

  /*=============================================
      CARGAR VISTA PREVIA DE IMAGEN DESDE INPUT
      =============================================*/
  $("#img").change(function () {
    const input = this;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $(".imagen-producto").attr("src", e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  });

  /*=============================================
      EDITAR PRODUCTO
      =============================================*/
  $(document).on("click", ".btn-editProducto", function (e) {
    $("#guardarCambiosProducto").removeClass("d-none");
    $("#agregarProducto").addClass("d-none");
    let row = $(this).closest("tr");
    let rowData = $(".menu").DataTable().row(row).data();
    let imagenPath = rowData.img;
    $(".imagen-producto").attr("src", imagenPath);

    let id = rowData.id;
    let producto = rowData.producto;
    let porcion = rowData.porcion;
    let unidad = rowData.unidad;
    let categoria = rowData.categoria;
    let precio = rowData.precio;
    let descripcion = rowData.descripcion;
    let imagen = rowData.img;

    $("#idProducto").val(id);
    $("#producto").val(producto);
    $("#porcion").val(porcion);
    $("#unidad").val(unidad);
    $("#categoria").val(categoria);
    $("#precio").val(precio);
    $("#descripcion").val(descripcion);
  });

  //Guardar cambios producto
  $(document).on("click", "#guardarCambiosProducto", function (e) {
    e.preventDefault();

    // Crear un objeto FormData
    let formData = new FormData();
    formData.append("accion", "editarMenu");
    formData.append("id", $("#idProducto").val());
    formData.append("producto", $("#producto").val());
    formData.append("porcion", $("#porcion").val());
    formData.append("unidad", $("#unidad").val());
    formData.append("categoria", $("#categoria").val());
    formData.append("precio", $("#precio").val());
    formData.append("descripcion", $("#descripcion").val());

    // Agregar la imagen al FormData (si hay una imagen seleccionada)
    let imagenInput = document.getElementById("img");
    let nuevaImagen = imagenInput.files[0];
    if (nuevaImagen) {
      formData.append("imagen", nuevaImagen);
    }

    // Enviar los datos con AJAX
    $.ajax({
      url: "controladores/productos.controlador.php",
      type: "POST",
      data: formData,
      processData: false, // Evitar que jQuery procese los datos
      contentType: false, // Evitar que jQuery configure el content-type
      success: function (respuesta) {
        tablaMenu.ajax.reload(null, false);
        $("#productos").modal("hide");
        alertify.success("Cambios guardados!");
      },
      error: function (error) {
        console.error("Error en la solicitud AJAX:", error);
      },
    });
  });

  /*=============================================
      AGREGANDO PRODUCTO
      =============================================*/
  $(document).on("click", "#agregarProducto", function () {
    let producto = $.trim($("#producto").val()).toLowerCase();
    let porcion = $.trim($("#porcion").val()).toLowerCase();
    let unidad = $.trim($("#unidad").val()).toLowerCase();
    let categoria = $.trim($("#categoria").val()).toLowerCase();
    let precio = $("#precio").val();
    let descripcion = $.trim($("#descripcion").val()).toLowerCase();
    let imagenInput = document.getElementById("img");
    let imagen = imagenInput.files[0];

    let datos = new FormData();
    datos.append("accion", "agregarMenu");
    datos.append("producto", producto);
    datos.append("porcion", porcion);
    datos.append("unidad", unidad);
    datos.append("categoria", categoria);
    datos.append("precio", precio);
    datos.append("descripcion", descripcion);
    datos.append("imagen", imagen); // Aquí se añade la imagen

    $.ajax({
      url: "controladores/productos.controlador.php",
      method: "POST",
      data: datos,
      cache: false,
      contentType: false,
      processData: false,
      success: function (response) {
        tablaMenu.ajax.reload(null, false);
        $("#productos").modal("hide");
        $("#formProductos").trigger("reset");
        alertify.success("Producto agregado!");
      },
    });
  });

  /*=============================================
    ELIMINAR PRODUCTO
    =============================================*/
  $(document).on("click", ".btn-deletProducto", function (e) {
    e.preventDefault();
    let row = $(this).closest("tr");
    let rowData = $(".menu").DataTable().row(row).data();
    let id = rowData.id;

    let datos = new FormData();
    datos.append("accion", "eliminarMenu");
    datos.append("id", id);

    $.ajax({
      url: "controladores/productos.controlador.php",
      method: "POST",
      data: datos,
      cache: false,
      contentType: false,
      processData: false,
      dataType: "json",
      success: function (response) {
        tablaMenu.ajax.reload(null, false);
        alertify.error("Producto eliminado!");
      },
    });
  });
});
