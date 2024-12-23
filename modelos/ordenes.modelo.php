<?php
date_default_timezone_set('America/Mexico_City');
require_once 'conexion.php';

class ModeloOrdenes
{

    static public function mdlObtenerOrdenes($tabla)
    {
        $stmt = Conexion::conectar()->prepare("SELECT * FROM $tabla");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    static public function mdlCrearOrden($tabla, $datos)
    {
        $monto = str_replace(['$', ','], '', $datos['total']);
        $montoFloat = floatval($monto);
        $pdo = Conexion::conectar();
        $columns = "producto, fecha, n_orden, empleado, cliente, total";
        $sql = "INSERT INTO $tabla ($columns) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $values = [
            $datos['producto'],
            $datos['fecha'],
            $datos['n_orden'],
            $datos['empleado'],
            $datos['cliente'],
            $montoFloat
        ];


        if ($stmt->execute($values)) {
            return 'ok';
        } else {
            return 'error';
        }
    }

    static public function mdlContabilidadProductos($datos)
    {
        $pdo = Conexion::conectar();
        $productos = $datos['contabilidad'];

        $productos = json_decode($productos, true);

        if (is_array($productos)) {

            foreach ($productos as $producto) {

                $idProducto = $producto['id'];
                $especialidad = $producto['especialidad'];
                $cantidad = $producto['cantidad'];
                $fecha = $datos['fecha'];

                $sql = "INSERT INTO contabilidad (id_producto, especialidad, cantidad, fecha) VALUES (:id_producto, :especialidad, :cantidad, :fecha)";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':id_producto', $idProducto);
                $stmt->bindParam(':especialidad', $especialidad);
                $stmt->bindParam(':cantidad', $cantidad);
                $stmt->bindParam(':fecha', $fecha);

                if (!$stmt->execute()) {
                    throw new Exception("Error al insertar el producto: " . $idProducto);
                }
            }
        } else {
            throw new Exception("Formato de datos incorrecto en 'productos'.");
        }
    }



    static public function mdlEliminarOrden($tabla, $idVenta)
    {
        $stmt = Conexion::conectar()->prepare("DELETE FROM $tabla WHERE id =:id");
        $stmt->bindParam(":id", $idVenta, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }
    static public function mdlEditarOrden($tabla, $datos)
    {

        $monto = str_replace(['$', ','], '', $datos['total']);
        $montoFloat = floatval($monto);

        $stmt = Conexion::conectar()->prepare("UPDATE $tabla SET producto =:producto, empleado =:empleado, fecha=:fecha, cliente=:cliente, total=:total WHERE id = :id");
        $stmt->bindParam(":producto", $datos['producto'], PDO::PARAM_STR);
        $stmt->bindParam(":empleado", $datos['empleado'], PDO::PARAM_STR);
        $stmt->bindParam(":fecha", $datos['fecha'], PDO::PARAM_STR);
        $stmt->bindParam(":cliente", $datos['cliente'], PDO::PARAM_STR);
        $stmt->bindParam(":total", $montoFloat, PDO::PARAM_STR);
        $stmt->bindParam(":id", $datos['id'], PDO::PARAM_INT);
        if ($stmt->execute()) {
            return 'ok';
        } else {
            return 'error';
        }
    }

    static public function mdlTotalVenta($tabla)
    {
        $fecha_actual = date('Y-m-d');
        $stmt = Conexion::conectar()->prepare("SELECT SUM(total) AS total_monto
        FROM $tabla
        WHERE DATE(fecha) = '$fecha_actual'");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
