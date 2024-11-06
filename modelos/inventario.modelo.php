<?php
require_once 'conexion.php';

class ModeloInventario
{

    static public function mdlObtenerInventario($tabla)
    {
        $stmt = Conexion::conectar()->prepare("SELECT * FROM $tabla");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    static public function mdlEditarInventario($tabla, $datos)
    {

        $stmt = Conexion::conectar()->prepare("UPDATE $tabla SET almacen =:almacen WHERE id = :id");
        $stmt->bindParam(":id", $datos["id"], PDO::PARAM_INT);
        $stmt->bindParam(":almacen", $datos["almacen"], PDO::PARAM_STR);
        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }
    static public function mdlDescontarInventario($tabla, $datos)
    {
        // Decodificar el JSON en un array de objetos
        $items = json_decode($datos['descontar'], true);

        // Verificar si la decodificación fue exitosa
        if (!is_array($items)) {
            return 'error: datos no válidos';
        }

        // Conexión a la base de datos
        $conn = Conexion::conectar();

        // Iterar sobre cada objeto y actualizar la tabla
        foreach ($items as $item) {
            // Preparar la consulta
            $stmt = $conn->prepare("UPDATE $tabla SET  almacen = almacen - :almacen WHERE producto = :producto AND unico = :unico");

            $stmt->bindParam(":producto", $item["producto"], PDO::PARAM_STR);
            $stmt->bindParam(":almacen", $item["almacen"], PDO::PARAM_STR);
            $stmt->bindParam(":unico", $item["unico"], PDO::PARAM_STR);

            // Ejecutar la consulta y verificar el resultado
            if (!$stmt->execute()) {
                return 'error: fallo en la actualización';
            }
        }

        return 'ok';
    }
}
