<?php
require_once 'conexion.php';

class ModeloProductos
{

    static public function mdlObtenerProductos($tabla)
    {
        $stmt = Conexion::conectar()->prepare("SELECT * FROM $tabla");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    static public function mdlObtenerMenu($tabla)
    {
        $stmt = Conexion::conectar()->prepare("SELECT * FROM $tabla");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    static public function mdlAgregarMenu($tabla, $datos)
    {
        $imagen = $datos['img'] !== '' ? $datos['img'] : 'assets/img/generic_product.png';
        $stmt = Conexion::conectar()->prepare("INSERT INTO $tabla(producto, porcion, unidad, categoria, precio, descripcion, img) VALUES(:producto, :porcion, :unidad, :categoria, :precio, :descripcion, :img)");
        $stmt->bindParam(":producto", $datos['producto'], PDO::PARAM_STR);
        $stmt->bindParam(":porcion", $datos['porcion'], PDO::PARAM_STR);
        $stmt->bindParam(":unidad", $datos['unidad'], PDO::PARAM_STR);
        $stmt->bindParam(":categoria", $datos['categoria'], PDO::PARAM_STR);
        $stmt->bindParam(":precio", $datos['precio'], PDO::PARAM_STR);
        $stmt->bindParam(":descripcion", $datos['descripcion'], PDO::PARAM_STR);
        $stmt->bindParam(":img", $imagen, PDO::PARAM_STR);

        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }

    static public function mdlEditarMenu($tabla, $datos)
    {

        if ($datos["img"] != '') {
            $stmt = Conexion::conectar()->prepare("UPDATE $tabla SET producto =:producto, porcion=:porcion, unidad=:unidad, categoria=:categoria, precio=:precio, descripcion=:descripcion, img=:img WHERE id = :id");
            $stmt->bindParam(":id", $datos["id"], PDO::PARAM_INT);
            $stmt->bindParam(":producto", $datos["producto"], PDO::PARAM_STR);
            $stmt->bindParam(":porcion", $datos["porcion"], PDO::PARAM_STR);
            $stmt->bindParam(":unidad", $datos["unidad"], PDO::PARAM_STR);
            $stmt->bindParam(":categoria", $datos["categoria"], PDO::PARAM_STR);
            $stmt->bindParam(":precio", $datos["precio"], PDO::PARAM_STR);
            $stmt->bindParam(":descripcion", $datos["descripcion"], PDO::PARAM_STR);
            $stmt->bindParam(":img", $datos["img"], PDO::PARAM_STR);
        } else {
            $stmt = Conexion::conectar()->prepare("UPDATE $tabla SET producto =:producto, porcion=:porcion, unidad=:unidad, categoria=:categoria, precio=:precio, descripcion=:descripcion WHERE id = :id");
            $stmt->bindParam(":id", $datos["id"], PDO::PARAM_INT);
            $stmt->bindParam(":producto", $datos["producto"], PDO::PARAM_STR);
            $stmt->bindParam(":porcion", $datos["porcion"], PDO::PARAM_STR);
            $stmt->bindParam(":unidad", $datos["unidad"], PDO::PARAM_STR);
            $stmt->bindParam(":categoria", $datos["categoria"], PDO::PARAM_STR);
            $stmt->bindParam(":precio", $datos["precio"], PDO::PARAM_STR);
            $stmt->bindParam(":descripcion", $datos["descripcion"], PDO::PARAM_STR);
        }

        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }

    public static function mdlEliminarMenu($tabla, $id)
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
