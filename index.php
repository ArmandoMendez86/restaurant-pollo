<?php
require_once "controladores/plantilla.controlador.php";
/* require_once "controladores/menu.controlador.php";
require_once "controladores/pedidos.controlador.php";
require_once "controladores/recibos.controlador.php";
require_once "controladores/empleados.controlador.php";
require_once "controladores/marca.controlador.php";


require_once "modelos/marca.modelo.php";
require_once "modelos/menu.modelo.php";
require_once "modelos/pedidos.modelo.php";
require_once "modelos/recibos.modelo.php";
require_once "modelos/empleados.modelo.php"; */
$plantilla = new ControladorPlantilla();
$plantilla->ctrPlantilla();
