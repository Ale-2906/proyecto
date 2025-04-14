<?php 
include_once "connectionDB.php";
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer


use PhpOffice\PhpSpreadsheet\IOFactory;
class Activo {
    public static function nuevoActivo() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['procesoCompra']) || !isset($data['bien']) || !isset($data['serie'])||
        !isset($data['marca']) || !isset($data['modelo']) || !isset($data['color'])||
        !isset($data['codigoBarra']) || !isset($data['responsable']) || !isset($data['estado'])|| !isset($data['ubicacion'])) {
       
            http_response_code(400); // Solicitud incorrecta
            echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
            return;
        }
        $serie = $data['serie'];
        $marca = $data['marca'];
        $modelo = $data['modelo'];
        $color = $data['color'];
        $codBarras = $data['codigoBarra'];
        $idCompra = $data['procesoCompra'];
        $idUbic = $data['ubicacion'];
        $idPers = $data['responsable'];
        $idbien = $data['bien'];
        $idEstado = $data['estado'];
    //    echo "Serie: $serie\nMarca: $marca\nModelo: $modelo\nColor: $color\nCódigo de Barras: $codBarras\n" .
   // "Proceso de Compra: $idCompra\nUbicación: $idUbic\nResponsable: $idPers\nBien: $idbien\nEstado: $idEstado\n";


        if (empty($serie) || empty($marca) || empty($modelo)||
            empty($color) || empty($codBarras) || empty($idCompra)||
            empty($idUbic) || empty($idPers) || empty($idbien)||empty($idEstado)) {
            http_response_code(400); // Solicitud incorrecta
            echo json_encode(['success' => false, 'message' => 'Los campos no pueden estar vacíos']);
            return;
        }
        try {
            $query = "INSERT INTO activo
                     (serieAct, marcaAct, modeloAct,colorAct,codigoBarraAct,idCompra,idUbic,idPers,idbien,idEstado)
                      VALUES (:serie, :marca, :modelo, :color, :codBarras,:idCompra, :idUbic, :idPers, :idbien, :idEstado )";
            $conn = Conexion::getInstance()->getConnection();
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':serie' => $serie,
                ':marca' => $marca,
                ':modelo' => $modelo,
                ':color' => $color,
                ':codBarras' => $codBarras,
                ':idCompra' => $idCompra,
                ':idUbic' => $idUbic,
                ':idPers' => $idPers,
                ':idbien' => $idbien,
                ':idEstado' => $idEstado,
            ]);
            echo json_encode(['success' => true, 'message' => 'Proceso de compra guardado']);
        } catch (PDOException $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode(['success' => false, 'message' => 'Error al guardar el proceso de compra: ' . $e->getMessage()]);
        }
            
    }
    public static function actualizarActivo() {
        $data = json_decode(file_get_contents('php://input'), true);
        $serie = $data['serieAct'];
        $marca = $data['marcaAct'];
        $modelo = $data['modeloAct'];
        $color = $data['colorAct'];
        $codBarras = $data['codigoBarraAct'];
        $idCompra = $data['idCompra'];
        $idUbic = $data['idUbic'];
        $idPers = $data['idPers'];
        $idbien = $data['idbien'];
        $idEstado = $data['idEstado'];
        $idact = $data['idActivo'];
        try {
            $query = "UPDATE activo SET
                     serieAct = :serie, marcaAct= :marca, modeloAct= :modelo ,
                     colorAct= :color,codigoBarraAct= :codBarras,idCompra= :idCompra,
                     idUbic= :idUbic ,idPers= :idPers,idbien=:idbien,idEstado= :idEstado
                      WHERE idActivo = :idactiv";
            $conn = Conexion::getInstance()->getConnection();
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':serie' => $serie,
                ':marca' => $marca,
                ':modelo' => $modelo,
                ':color' => $color,
                ':codBarras' => $codBarras,
                ':idCompra' => $idCompra,
                ':idUbic' => $idUbic,
                ':idPers' => $idPers,
                ':idbien' => $idbien,
                ':idEstado' => $idEstado,
                ':idactiv' => $idact,
            ]);
            echo json_encode(['success' => true, 'message' => 'Proceso de compra guardado']);
        } catch (PDOException $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode(['success' => false, 'message' => 'Error al guardar el proceso de compra: ' . $e->getMessage()]);
        }
            
    }
   /* public static function cargarExcelActivos() {
        if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Archivo no recibido correctamente']);
            return;
        }
    
        // Verificar el tipo de archivo
        $fileType = pathinfo($_FILES['archivo']['name'], PATHINFO_EXTENSION);
        if (!in_array($fileType, ['xls', 'xlsx'])) {
            http_response_code(400); 
            echo json_encode(['success' => false, 'message' => 'Solo se permiten archivos Excel (.xls, .xlsx)']);
            return;
        }
    
        $archivo = $_FILES['archivo']['tmp_name'];
    
        try {
            $spreadsheet = IOFactory::load($archivo);
            $sheet = $spreadsheet->getActiveSheet();
            $datos = $sheet->toArray();
    
            $conn = Conexion::getInstance()->getConnection();
            $insertados = 0;
            $duplicados = 0;
            $mensajesDuplicados = [];
    
            // Omitir la cabecera
            for ($i = 1; $i < count($datos); $i++) {
                $fila = $datos[$i];
    
                $serie = trim($fila[0]);
                $marca = trim($fila[1]);
                $modelo = trim($fila[2]);
                $color = trim($fila[3]);
                $codBarras = trim($fila[4]);
                $idCompra = trim($fila[5]);
                $idUbic = trim($fila[6]);
                $idPers = trim($fila[7]);
                $idbien = trim($fila[8]);
                $idEstado = trim($fila[9]);
    
                // Validación básica
                if (empty($serie) || empty($marca) || empty($modelo) || empty($codBarras)) {
                    continue;
                }
    
                // Verificar si ya existe el activo con esa serie y código de barras
                $verificar = "SELECT COUNT(*) FROM activo WHERE serieAct = :serie AND codigoBarraAct = :codBarras";
                $stmtVerificar = $conn->prepare($verificar);
                $stmtVerificar->execute([
                    ':serie' => $serie,
                    ':codBarras' => $codBarras
                ]);
    
                if ($stmtVerificar->fetchColumn() > 0) {
                    $duplicados++;
                    $mensajesDuplicados[] = "Fila " . ($i + 1) . ": duplicado - serie='$serie', códigoBarras='$codBarras'";
                    continue;
                }
    
                // Insertar si no existe
                $query = "INSERT INTO activo
                    (serieAct, marcaAct, modeloAct, colorAct, codigoBarraAct, idCompra, idUbic, idPers, idbien, idEstado)
                    VALUES (:serie, :marca, :modelo, :color, :codBarras, :idCompra, :idUbic, :idPers, :idbien, :idEstado)";
    
                $stmt = $conn->prepare($query);
                $stmt->execute([
                    ':serie' => $serie,
                    ':marca' => $marca,
                    ':modelo' => $modelo,
                    ':color' => $color,
                    ':codBarras' => $codBarras,
                    ':idCompra' => $idCompra,
                    ':idUbic' => $idUbic,
                    ':idPers' => $idPers,
                    ':idbien' => $idbien,
                    ':idEstado' => $idEstado
                ]);
    
                $insertados++;
            }
    
            echo json_encode([
                'success' => true,
                'message' => 'Carga finalizada',
                'insertados' => $insertados,
                'duplicados' => $duplicados,
                'detallesDuplicados' => $mensajesDuplicados
            ]);
    
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al procesar el archivo Excel: ' . $e->getMessage()]);
        }
    }*/
    public static function cargarExcelActivos() {
        if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Archivo no recibido correctamente']);
            return;
        }
    
        $fileType = pathinfo($_FILES['archivo']['name'], PATHINFO_EXTENSION);
        if (!in_array($fileType, ['xls', 'xlsx'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Solo se permiten archivos Excel (.xls, .xlsx)']);
            return;
        }
    
        $archivo = $_FILES['archivo']['tmp_name'];
    
        try {
            $spreadsheet = IOFactory::load($archivo);
            $sheet = $spreadsheet->getActiveSheet();
            $datos = $sheet->toArray();
    
            $conn = Conexion::getInstance()->getConnection();
    
            $insertados = 0;
            $duplicados = 0;
            $mensajesDuplicados = [];
    
            // Saltamos la cabecera
            for ($i = 1; $i < count($datos); $i++) {
                $fila = $datos[$i];
    
                $serie = trim($fila[0]);
                $marca = trim($fila[1]);
                $modelo = trim($fila[2]);
                $color = trim($fila[3]);
                $codBarras = trim($fila[4]);
    
                // Suponiendo que vienen los nombres:
                $nombreCompra = trim($fila[5]);
                $nombreUbic = trim($fila[6]);
                $nombrePers = trim($fila[7]);
                $nombreBien = trim($fila[8]);
                $nombreEstado = trim($fila[9]);
    
                if (empty($serie) || empty($marca) || empty($modelo)) {
                    continue;
                }
    
                // Verificar si ya existe un activo con esa serie
                $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM activo WHERE serieAct = ?");
                $stmtCheck->execute([$serie]);
                if ($stmtCheck->fetchColumn() > 0) {
                    $duplicados++;
                    $mensajesDuplicados[] = "Activo con serie '{$serie}' ya existe.";
                    continue;
                }
    
                // Obtener IDs desde nombres
                $idCompra = self::obtenerIdPorNombre($conn, 'procesocompra', 'idCompra', 'idCompra', $nombreCompra);
                $idUbic = self::obtenerIdPorNombre($conn, 'ubicacion', 'idUbic', 'nomUbic', $nombreUbic);
    $idPers = self::obtenerIdPorNombre($conn, 'persona', 'idPers', 'nomPers', $nombrePers);
    $idBien = self::obtenerIdPorNombre($conn, 'bien', 'idbien', 'nombien', $nombreBien);
    $idEstado = self::obtenerIdPorNombre($conn, 'estado', 'idEstado', 'nomEstado', $nombreEstado);
    
                $query = "INSERT INTO activo
                    (serieAct, marcaAct, modeloAct, colorAct, codigoBarraAct, idCompra, idUbic, idPers, idbien, idEstado)
                    VALUES (:serie, :marca, :modelo, :color, :codBarras, :idCompra, :idUbic, :idPers, :idbien, :idEstado)";
    
                $stmt = $conn->prepare($query);
                $stmt->execute([
                    ':serie' => $serie,
                    ':marca' => $marca,
                    ':modelo' => $modelo,
                    ':color' => $color,
                    ':codBarras' => $codBarras,
                    ':idCompra' => $idCompra,
                    ':idUbic' => $idUbic,
                    ':idPers' => $idPers,
                    ':idbien' => $idBien,
                    ':idEstado' => $idEstado
                ]);
    
                $insertados++;
            }
    
            echo json_encode([
                'success' => true,
                'insertados' => $insertados,
                'duplicados' => $duplicados,
                'detallesDuplicados' => $mensajesDuplicados
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al procesar el archivo Excel: ' . $e->getMessage()]);
        }
    }
    
    private static function obtenerIdPorNombre($conn, $tabla, $campoId, $campoNombre, $valorNombre) {
        if (empty($valorNombre)) return null;
    
        $stmt = $conn->prepare("SELECT {$campoId} FROM {$tabla} WHERE {$campoNombre} = ?");
        $stmt->execute([$valorNombre]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado ? $resultado[$campoId] : null;
    }
    
    }
    

?>
