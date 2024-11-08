<?php

require_once '../modelos/ordenes.modelo.php';

class ControladorOrdenes
{

    static public $tabla = "venta_dos";

    static public function ctrObtenerOrdenes()
    {
        $respuesta = ModeloOrdenes::mdlObtenerOrdenes(self::$tabla);
        return $respuesta;
    }

    static public function ctrCrearOrden($datos)
    {
        $respuesta = ModeloOrdenes::mdlCrearOrden(self::$tabla, $datos);
        $contabilidad = ModeloOrdenes::mdlContabilidadProductos($datos);
        return $respuesta;
    }

    static public function ctrEliminarOrden($idVenta)
    {
        $respuesta = ModeloOrdenes::mdlEliminarOrden(self::$tabla, $idVenta);
        return $respuesta;
    }

    static public function ctrEditarOrden($datos)
    {
        $respuesta = ModeloOrdenes::mdlEditarOrden(self::$tabla, $datos);
        return $respuesta;
    }

    static public function ctrTotalVenta()
    {
        $respuesta = ModeloOrdenes::mdlTotalVenta(self::$tabla);
        return $respuesta;
    }
}


if (isset($_GET['accion']) && $_GET['accion'] == 'obtenerOrdenes') {
    $respuesta = ControladorOrdenes::ctrObtenerOrdenes();
    echo json_encode(['data' => $respuesta]);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'crearOrden') {
    unset($_POST["accion"]);
    $datos = $_POST;
    $respuesta = ControladorOrdenes::ctrCrearOrden($datos);
    echo json_encode($respuesta);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'eliminarOrden') {
    $respuesta = ControladorOrdenes::ctrEliminarOrden($_POST['id']);
    echo json_encode($respuesta);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'editarOrden') {
    $respuesta = ControladorOrdenes::ctrEditarOrden($_POST);
    echo json_encode($respuesta);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'totalVentaOrdenes') {
    $respuesta = ControladorOrdenes::ctrTotalVenta();
    echo json_encode($respuesta);
}
