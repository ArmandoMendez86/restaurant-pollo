<?php
require_once '../modelos/contabilidad.modelo.php';


class ControladorContabilidad
{

    static public $tabla = "contabilidad";

    /* ############################# Obetner contabilidad ############################# */
    static public function ctrObtenerContabilidad()
    {
        $respuesta = ModeloContabilidad::mdlObtenerContabilidad(self::$tabla);
        return $respuesta;
    }
}


if (isset($_GET['accion']) && $_GET['accion'] == 'obtenerContabilidad') {
    $respuesta = ControladorContabilidad::ctrObtenerContabilidad();
    echo json_encode(['data' => $respuesta]);
}
