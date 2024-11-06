<?php
require_once '../modelos/usuarios.modelo.php';


class ControladorUsuarios
{

    static public $tabla = "empleados";

    /* ############################# Obetner usuarios ############################# */
    static public function ctrObtenerUsuarios()
    {
        $respuesta = ModeloUsuario::mdlObtenerUsuarios(self::$tabla);
        return $respuesta;
    }

    /* ############################# Actualizar estado de usuarios ############################# */
    static  public function ctrActualizarEstado($datos)
    {
        unset($datos['accion']);
        $respuesta = ModeloUsuario::mdlActualizarEstado(self::$tabla, $datos);
        return $respuesta;
    }
    /* ############################# Actualizar datos de usuario ############################# */
    static  public function ctrActualizarUsuario($datos)
    {
        unset($datos['accion']);
        $datos = json_decode($datos['info'], true);
        $respuesta = ModeloUsuario::mdlActualizarUsuario(self::$tabla, $datos);
        return $respuesta;
    }
    /* ############################# Agregar usuario ############################# */
    static  public function ctrAgregarUsuario($datos)
    {
        unset($datos['accion']);
        $datos = json_decode($datos['usuario'], true);
        $respuesta = ModeloUsuario::mdlAgregarUsuario(self::$tabla, $datos);
        return $respuesta;
    }

    public static function ctrEliminarUsuario($datos)
    {
        unset($datos['accion']);
        $id = $datos['id'];
        $respuesta = ModeloUsuario::mdlEliminarUsuario(self::$tabla, $id);
        return $respuesta;
    }
}


if (isset($_GET['accion']) && $_GET['accion'] == 'obtenerUsuarios') {
    $respuesta = ControladorUsuarios::ctrObtenerUsuarios();
    echo json_encode(['data' => $respuesta]);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'actualizarStatusUsuario') {
    $respuesta = ControladorUsuarios::ctrActualizarEstado($_POST);
    echo json_encode($respuesta);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'actualizarDatosUsuario') {
    $respuesta = ControladorUsuarios::ctrActualizarUsuario($_POST);
    echo json_encode($respuesta);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'nuevoUsuario') {
    $respuesta = ControladorUsuarios::ctrAgregarUsuario($_POST);
    echo json_encode($respuesta);
}
if (isset($_POST['accion']) && $_POST['accion'] == 'eliminarUsuario') {
    $respuesta = ControladorUsuarios::ctrEliminarUsuario($_POST);
    echo json_encode($respuesta);
}
