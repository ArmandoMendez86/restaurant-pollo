<?php
require_once 'conexion.php';

class ModeloOrdenes
{

    static public function mdlObtenerOrdenes($tabla)
    {
        $stmt = Conexion::conectar()->prepare("SELECT * FROM venta_dos");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    static public function mdlCrearOrden($tabla, $datos)
    {
        $monto = str_replace(['$', ','], '', $datos['total']);
        $montoFloat = floatval($monto);

        // Conectar a la base de datos usando PDO
        $pdo = Conexion::conectar();

        // Especificar los nombres de las columnas
        $columns = "producto, fecha, n_orden, empleado, cliente, total";

        // Preparar la consulta SQL
        $sql = "INSERT INTO $tabla ($columns) VALUES (?, ?, ?, ?, ?, ?)";

        // Preparar la consulta
        $stmt = $pdo->prepare($sql);

        // Configurar los valores (producto es el JSON como texto)
        $values = [
            $datos['producto'],
            $datos['fecha'],
            $datos['n_orden'],
            $datos['empleado'],
            $datos['cliente'],
            $montoFloat
        ];

        // Ejecutar la consulta con los valores
        if ($stmt->execute($values)) {
            return 'ok';  // Si la inserción fue exitosa
        } else {
            return 'error';  // Si algo salió mal
        }
    }

    static public function mdlContabilidadProductos($datos)
    {
        $pdo = Conexion::conectar();
        $productos = $datos['producto'];

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
}
