<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets/img/logo.jpg">
    <!-- CSS only -->
    <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/owl.carousel.min.css">
    <link rel="stylesheet" href="assets/css/owl.theme.default.min.css">
    <!-- fancybox -->
    <link rel="stylesheet" href="assets/css/jquery.fancybox.min.css">
    <!-- Font Awesome 6 -->
    <link rel="stylesheet" href="assets/css/fontawesome.min.css">
    <!-- style -->
    <link rel="stylesheet" href="assets/css/style.css">
    <!-- responsive -->
    <link rel="stylesheet" href="assets/css/responsive.css">
    <!-- color -->
    <link rel="stylesheet" href="assets/css/color.css">
    <!-- Datatables -->
    <link rel="stylesheet" href="https://cdn.datatables.net/2.1.8/css/dataTables.dataTables.css">
    <!-- Alertify -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css" />
    <!-- Default theme -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css" />
</head>

<body class="page-loaded">

    <!-- preloader -->
    <div class="preloader">
        <div class="container">
            <div class="dot dot-1"></div>
            <div class="dot dot-2"></div>
            <div class="dot dot-3"></div>
        </div>
    </div>
    <!-- end preloader -->

    <?php
    if (isset($_SESSION["iniciarSesion"]) && $_SESSION["iniciarSesion"] == "ok") {

        include "incluir/header.php";

        if (isset($_GET["ruta"])) {
            if (
                $_GET["ruta"] == "productos" || $_GET["ruta"] == "ventas" ||
                $_GET["ruta"] == "menu" || $_GET["ruta"] == "inventario" ||
                $_GET["ruta"] == "contabilidad" || $_GET["ruta"] == "usuarios" ||
                $_GET["ruta"] == "panel"
            ) {
                include $_GET["ruta"] . ".php";
            } else {
                include "404.php";
            }
        } else {
            include "vistas/productos.php";
        }
    } else {
        include "vistas/login.php";
    }
    ?>



    <?php if ($_GET['ruta'] !== "login"): ?>
        <footer>
            <div class="container">
                <div class="footer-bootem">
                    <h6><span>© 2023 Tio pollo express</span> | Restaurant</h6>
                    <div class="header-social-media">
                        <a href="#!">Facebook</a>
                        <a href="#!">Twitter</a>
                        <a href="#!">Instagram</a>
                        <a href="#!">Youtube</a>
                    </div>
                </div>
            </div>
        </footer>
    <?php endif  ?>
    <!-- progress -->
    <div id="progress" style="display: grid; background: conic-gradient(rgb(243, 39, 76) 34%, rgb(215, 215, 215) 34%);">
        <span id="progress-value"><i class="fa fa-arrow-up"></i></span>
    </div>



    <script src="assets/js/jquery-3.6.0.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/owl.carousel.min.js"></script>
    <script src="assets/js/jquery.fancybox.min.js"></script>
    <script src="assets/js/custom.js"></script>
    <script src="assets/js/moment.js"></script>
    <script src="assets/js/preloader.js"></script>
    <script src="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdn.datatables.net/2.1.8/js/dataTables.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.4/purify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <!-- Vistas js -->
    <script src="assets/js/productos.js"></script>
    <script src="assets/js/ventas.js"></script>
    <script src="assets/js/menu.js"></script>
    <script src="assets/js/inventario.js"></script>
    <script src="assets/js/contabilidad.js"></script>
    <script src="assets/js/usuarios.js"></script>
    <script src="assets/js/login.js"></script>


</body>

</html>