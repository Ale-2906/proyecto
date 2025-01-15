<?php
require('config.php');
$tipo       = $_FILES['actLotes']['type'];
$tamanio    = $_FILES['actLotes']['size'];
$archivotmp = $_FILES['actLotes']['tmp_name'];
$lineas     = file($archivotmp);

$i = 0;

foreach ($lineas as $linea) {
    $cantidad_registros = count($lineas);
    $cantidad_regist_agregados = ($cantidad_registros - 1);

    if ($i != 0) {
        $datos = explode(";", $linea);

        $proceso_compra       = !empty($datos[0]) ? trim($datos[0]) : '';
        $serie                = !empty($datos[1]) ? trim($datos[1]) : '';
        $codigo_barras        = !empty($datos[2]) ? trim($datos[2]) : '';
        $activo               = !empty($datos[3]) ? trim($datos[3]) : '';
        $marca                = !empty($datos[4]) ? trim($datos[4]) : '';
        $modelo               = !empty($datos[5]) ? trim($datos[5]) : '';
        $color                = !empty($datos[6]) ? trim($datos[6]) : '';
        $responsable          = !empty($datos[7]) ? trim($datos[7]) : '';
        $ubicacion            = !empty($datos[8]) ? trim($datos[8]) : '';
        $estado               = !empty($datos[9]) ? trim($datos[9]) : '';
        $acciones             = !empty($datos[10]) ? trim($datos[10]) : '';

        $insertar = "INSERT INTO activos(
            procesoCompra,
            serie,
            codBarras,
            activo,
            marca,
            modelo,
            color,
            responsable,
            ubicacion,
            estado,
            acciones
        ) VALUES (
            '$proceso_compra',
            '$serie',
            '$codigo_barras',
            '$activo',
            '$marca',
            '$modelo',
            '$color',
            '$responsable',
            '$ubicacion',
            '$estado',
            '$acciones'
        )";

        mysqli_query($con, $insertar);
    }

    echo '<div>' . $i . "). " . htmlspecialchars($linea) . '</div>';
    $i++;
}

echo '<p style="text-align:center; color:#333;">Total de Registros: ' . $cantidad_regist_agregados . '</p>';
?>

<a href="index.php">Atrás</a>
