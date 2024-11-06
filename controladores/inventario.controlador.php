<?php
require_once '../modelos/inventario.modelo.php';


class ControladorInventario
{

    static public $tabla = "inventario";

    /* ############################# Obetner inventario ############################# */
    static public function ctrObtenerInventario()
    {
        $respuesta = ModeloInventario::mdlObtenerInventario(self::$tabla);
        return $respuesta;
    }


    /* ############################# Editar inventario ############################# */
    static public function ctrEditarInventario($datos)
    {
        unset($datos['accion']);
        $respuesta = ModeloInventario::mdlEditarInventario(self::$tabla, $datos);
        return $respuesta;
    }
    /* ############################# Editar inventario ############################# */
    static public function ctrDescontarInventario($datos)
    {
        unset($datos['accion']);
        $respuesta = ModeloInventario::mdlDescontarInventario(self::$tabla, $datos);
        return $respuesta;
    }
}


if (isset($_GET['accion']) && $_GET['accion'] == 'obtenerInventario') {
    $respuesta = ControladorInventario::ctrObtenerInventario();
    echo json_encode(['data' => $respuesta]);
}

if (isset($_POST['accion']) && $_POST['accion'] == 'editarInventario') {
    $respuesta = ControladorInventario::ctrEditarInventario($_POST);
    //echo json_encode($respuesta);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'descontarAlmacen') {
    $respuesta = ControladorInventario::ctrDescontarInventario($_POST);
    //echo json_encode($respuesta);
}
