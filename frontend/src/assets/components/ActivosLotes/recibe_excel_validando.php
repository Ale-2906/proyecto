<?php
require('config.php');

if ($_FILES['actLotes']['error'] === UPLOAD_ERR_OK) {
    $archivotmp = $_FILES['actLotes']['tmp_name'];
    $lineas = file($archivotmp);

    $i = 0;
    $total_exitos = 0;
    $duplicados = 0;

    foreach ($lineas as $linea) {
        if ($i != 0) {
            $datos = explode(";", $linea);

            $proceso_compra = !empty($datos[0]) ? trim($datos[0]) : '';
            $serie = !empty($datos[1]) ? trim($datos[1]) : '';
            $codigo_barras = !empty($datos[2]) ? trim($datos[2]) : '';

            // Verificar si el registro ya existe
            $verificar = "SELECT COUNT(*) AS total FROM activos WHERE serie = '$serie' AND codBarras = '$codigo_barras'";
            $resultado = mysqli_query($con, $verificar);
            $fila = mysqli_fetch_assoc($resultado);

            if ($fila['total'] > 0) {
                $duplicados++;
            } else {
                // Insertar el registro
                $insertar = "INSERT INTO activos(
                    procesoCompra, serie, codBarras, activo, marca, modelo, color, responsable, ubicacion, estado, acciones
                ) VALUES (
                    '$proceso_compra', '$serie', '$codigo_barras',
                    '" . trim($datos[3]) . "', '" . trim($datos[4]) . "',
                    '" . trim($datos[5]) . "', '" . trim($datos[6]) . "',
                    '" . trim($datos[7]) . "', '" . trim($datos[8]) . "',
                    '" . trim($datos[9]) . "', '" . trim($datos[10]) . "'
                )";

                if (mysqli_query($con, $insertar)) {
                    $total_exitos++;
                }
            }
        }
        $i++;
    }

    // Resultado en JSON
    echo json_encode([
        'success' => true,
        'total' => $total_exitos,
        'duplicados' => $duplicados,
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al subir el archivo.']);
}
?>
