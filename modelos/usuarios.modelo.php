<?php
require_once 'conexion.php';

class ModeloUsuario
{

    static public function mdlObtenerUsuarios($tabla)
    {
        $stmt = Conexion::conectar()->prepare("SELECT * FROM $tabla");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function mdlActualizarEstado($tabla, $datos)
    {
        $stmt = Conexion::conectar()->prepare("UPDATE $tabla SET estado = :estado WHERE id = :id");
        $stmt->bindParam(":estado", $datos['estado'], PDO::PARAM_INT);
        $stmt->bindParam(":id", $datos['id'], PDO::PARAM_INT);
        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }

    public static function mdlActualizarUsuario($tabla, $datos)
    {
        $password = $datos["password"];
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = Conexion::conectar()->prepare("UPDATE $tabla SET nombre =:nombre, apellido=:apellido, usuario=:usuario, password=:password WHERE id = :id");
        $stmt->bindParam(":id", $datos["id"], PDO::PARAM_INT);
        $stmt->bindParam(":nombre", $datos["nombre"], PDO::PARAM_STR);
        $stmt->bindParam(":apellido", $datos["apellido"], PDO::PARAM_STR);
        $stmt->bindParam(":usuario", $datos["usuario"], PDO::PARAM_STR);
        $stmt->bindParam(":password", $hash, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }

    static public function mdlAgregarUsuario($tabla, $datos)
    {
        $password = $datos["password"];
        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = Conexion::conectar()->prepare("INSERT INTO $tabla(nombre, apellido, usuario, password) VALUES(:nombre, :apellido, :usuario, :password)");
        $stmt->bindParam(":nombre", $datos['nombre'], PDO::PARAM_STR);
        $stmt->bindParam(":apellido", $datos['apellido'], PDO::PARAM_STR);
        $stmt->bindParam(":usuario", $datos['usuario'], PDO::PARAM_STR);
        $stmt->bindParam(":password", $hash, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }

    public static function mdlEliminarUsuario($tabla, $id)
    {
        $stmt = Conexion::conectar()->prepare("DELETE FROM $tabla WHERE id =:id");
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }
}
