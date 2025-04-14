<?php 
include_once "connectionDB.php";

class BuscarDatos {
    public static function buscarBienes($idTipoBien) {
        try {
            $sqlSelect = "SELECT * FROM bien WHERE idtipBien = :idTipoBien";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':idTipoBien', $idTipoBien, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
    public static function buscActPorCompra($compra) {
        try {
            $sqlSelect = "SELECT a.idActivo,a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN procesocompra pc ON pc.idCompra = a.idCompra
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE pc.idCompra = :compras";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':compras', $compra, PDO::PARAM_STR);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function buscActTipoBien($tipoBien) {
        try {
            $sqlSelect = "SELECT a.idActivo,a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            INNER JOIN tipobien tb ON b.idtipBien=tb.idtipBien
                            WHERE tb.idtipBien= :tipobn";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':tipobn', $tipoBien, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }
    public static function buscActUbicacion($idUbicacion) {
        try {
            $sqlSelect = "SELECT a.idActivo,a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE u.idUbic= :ubi";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':ubi', $idUbicacion, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }
    public static function buscActEstado($idEstado) {
        try {
            $sqlSelect = "SELECT a.idActivo,a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE e.idEstado = :est";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':est', $idEstado, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }
    public static function buscActSerie($idSerie) {
        try {
            $sqlSelect = "SELECT a.idActivo,a.idActivo,a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE  a.serieAct LIKE :serie";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $likeSerie =  $idSerie."%" ; // Búsqueda parcial
            $result->bindParam(':serie', $likeSerie, PDO::PARAM_STR); // Vincular el parámetro
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }
    public static function buscObservacion($idObvs) {
        try {
            $sqlSelect = "SELECT campObvs
                            FROM observacion
                            WHERE  idmanAct = :id ";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':id', $idObvs, PDO::PARAM_STR);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }

    static function buscHistorialManSerie(){
        $data = json_decode(file_get_contents('php://input'), true);
        $idman = $data['idman'];
        $idserie = $data['idserie'];

        try {
            $sqlSelect = "SELECT a.idCompra,a.serieAct, GROUP_CONCAT(CASE WHEN md.tipoMD = 'act' THEN act.nomActi END SEPARATOR ', ') AS actividad, GROUP_CONCAT(CASE WHEN md.tipoMD = 'com' THEN c.nomCompo END SEPARATOR ', ') AS componente, MAX(CASE WHEN md.tipoMD = 'obs' THEN o.campObvs END) AS observacion 
                FROM mantenientodetalle md 
                INNER JOIN activo a ON a.idActivo = md.idActivo 
                LEFT JOIN actividad act ON act.idActi = md.idReferencia AND md.tipoMD = 'act' 
                LEFT JOIN componente c ON c.idCompo = md.idReferencia AND md.tipoMD = 'com' 
                LEFT JOIN observacion o ON o.idObvs = md.idReferencia AND md.tipoMD = 'obs' 
                WHERE md.idManten= :idmanten AND a.serieAct LIKE :idserie GROUP BY a.serieAct, a.idCompra";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $likeSerie =  $idserie."%" ; // Búsqueda parcial
            $result->bindParam(':idmanten', $idman, PDO::PARAM_INT); 
            $result->bindParam(':idserie', $likeSerie, PDO::PARAM_STR);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function buscarMantenimientos($nomManten){
        $sql="SELECT m.idManten, m.codManten, m.fechaInico, m.fechaFin, e.nomEstado,
                    CASE 
                        WHEN m.tipo = 'ex' THEN p.nomProveedor
                        WHEN m.tipo = 'in' THEN per.nomPers
                    END AS nombreResponsable
                FROM 
                    manteniento m
                INNER JOIN 
                    estado e ON e.idEstado = m.idEstado
                LEFT JOIN 
                    proveedor p ON m.idRespons = p.idProveedor AND m.tipo = 'ex'
                LEFT JOIN 
                    persona per ON m.idRespons = per.idPers AND m.tipo = 'in'
                WHERE m.codManten LIKE :id";
         $conn = Conexion::getInstance()->getConnection();
         $result = $conn->prepare($sql);
         $likeSerie =  $nomManten."%" ; // Búsqueda parcial
         $result->bindParam(':id', $likeSerie, PDO::PARAM_STR); // Vincular el parámetro
         $result->execute();
         $data = $result->fetchAll(PDO::FETCH_ASSOC);
         $dataJson = json_encode($data);
          echo ($dataJson); 
    }
    
    public static function buscarMantenEstado($estado){
        $sql="SELECT m.idManten, m.codManten, m.fechaInico, m.fechaFin, e.nomEstado,
                    CASE 
                        WHEN m.tipo = 'ex' THEN p.nomProveedor
                        WHEN m.tipo = 'in' THEN per.nomPers
                    END AS nombreResponsable
                FROM 
                    manteniento m
                INNER JOIN 
                    estado e ON e.idEstado = m.idEstado
                LEFT JOIN 
                    proveedor p ON m.idRespons = p.idProveedor AND m.tipo = 'ex'
                LEFT JOIN 
                    persona per ON m.idRespons = per.idPers AND m.tipo = 'in'
                 WHERE e.idEstado= :id";
         $conn = Conexion::getInstance()->getConnection();
         $result = $conn->prepare($sql);
         $result->bindParam(':id', $estado, PDO::PARAM_INT); // Vincular el parámetro
         $result->execute();
         $data = $result->fetchAll(PDO::FETCH_ASSOC);
         $dataJson = json_encode($data);
          echo ($dataJson); 
    }
    
    public static function buscarMantenRanFechas(){
        $data = json_decode(file_get_contents('php://input'), true);
        $fechaInicio=$data["busFechInio"];
        $fechaFinal=$data["busFechFinal"];
        $sql="SELECT m.idManten, m.codManten, m.fechaInico, m.fechaFin, e.nomEstado,
                    CASE 
                        WHEN m.tipo = 'ex' THEN p.nomProveedor
                        WHEN m.tipo = 'in' THEN per.nomPers
                    END AS nombreResponsable
                FROM 
                    manteniento m
                INNER JOIN 
                    estado e ON e.idEstado = m.idEstado
                LEFT JOIN 
                    proveedor p ON m.idRespons = p.idProveedor AND m.tipo = 'ex'
                LEFT JOIN 
                    persona per ON m.idRespons = per.idPers AND m.tipo = 'in'
                 WHERE 
                    m.fechaInico BETWEEN :fecInc AND :fecFin
                    OR m.fechaFin BETWEEN :fecInc AND :fecFin
                    OR (:fecInc BETWEEN m.fechaInico AND m.fechaFin)
                    OR (:fecFin BETWEEN m.fechaInico AND m.fechaFin)";
         $conn = Conexion::getInstance()->getConnection();
         $result = $conn->prepare($sql);
         $result->bindParam(':fecInc', $fechaInicio, PDO::PARAM_STR); 
         $result->bindParam(':fecFin', $fechaFinal, PDO::PARAM_STR);
         $result->execute();
         $data = $result->fetchAll(PDO::FETCH_ASSOC);
         $dataJson = json_encode($data);
          echo ($dataJson); 
    }
    
    public static function buscarMantenRespons(){
        $data = json_decode(file_get_contents('php://input'), true);
        $tipo=$data["tipo"];
        $idRespon=$data["idRespon"];
        $sql="SELECT m.idManten, m.codManten, m.fechaInico, m.fechaFin, e.nomEstado,
                    CASE 
                        WHEN m.tipo = 'ex' THEN p.nomProveedor
                        WHEN m.tipo = 'in' THEN per.nomPers
                    END AS nombreResponsable
                FROM 
                    manteniento m
                INNER JOIN 
                    estado e ON e.idEstado = m.idEstado
                LEFT JOIN 
                    proveedor p ON m.idRespons = p.idProveedor AND m.tipo = 'ex'
                LEFT JOIN 
                    persona per ON m.idRespons = per.idPers AND m.tipo = 'in'
                 WHERE m.tipo= :tip AND m.idRespons= :id";
         $conn = Conexion::getInstance()->getConnection();
         $result = $conn->prepare($sql);
         $result->bindParam(':id', $idRespon, PDO::PARAM_INT); 
         $result->bindParam(':tip', $tipo, PDO::PARAM_STR);
         $result->execute();
         $data = $result->fetchAll(PDO::FETCH_ASSOC);
         $dataJson = json_encode($data);
          echo ($dataJson); 
    }

    public static function cargarEditManten($id) {
        $sqlSelect = "SELECT * FROM manteniento WHERE idManten= :id";
        $conn = Conexion::getInstance()->getConnection();
        $result = $conn->prepare($sqlSelect);
        $result->bindParam(':id', $id, PDO::PARAM_INT); 
        $result->execute();
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        $dataJson = json_encode($data);
         echo ($dataJson); 
    }
    

    public static function buscarCantidadAcciones($id){
        $sql="SELECT mandet.tipoMD, COUNT(*) AS cantidad
         FROM mantenientodetalle mandet 
         JOIN manten_activ manact ON manact.idmanAct = mandet.idmanAct 
         WHERE manact.idManten = :id GROUP BY mandet.tipoMD";
         $conn = Conexion::getInstance()->getConnection();
         $result = $conn->prepare($sql);
         $result->bindParam(':id', $id, PDO::PARAM_INT); // Vincular el parámetro
         $result->execute();
         $data = $result->fetchAll(PDO::FETCH_ASSOC);
         $dataJson = json_encode($data);
          echo ($dataJson); 
    }
    public static function buscarCantidadActividades($id){
        $sql="SELECT a.idActi, COUNT(DISTINCT m.idManten) AS cantidad 
        FROM actividad a 
        JOIN mantenientodetalle md ON a.idActi = md.idReferencia AND md.tipoMD = 'act'
         JOIN manten_activ ma ON md.idmanAct = ma.idmanAct 
         JOIN manteniento m ON ma.idManten = m.idManten 
         WHERE a.idActi= :id
          GROUP BY a.idActi;";
         $conn = Conexion::getInstance()->getConnection();
         $result = $conn->prepare($sql);
         $result->bindParam(':id', $id, PDO::PARAM_INT); // Vincular el parámetro
         $result->execute();
         $data = $result->fetchAll(PDO::FETCH_ASSOC);
         $dataJson = json_encode($data);
          echo ($dataJson); 
    }
    public static function buscarCantidadComponentes($id){
        $sql="SELECT c.idCompo, COUNT(DISTINCT m.idManten) AS cantidad_mantenimientos
         FROM componente c 
         JOIN mantenientodetalle md ON c.idCompo = md.idReferencia AND md.tipoMD = 'act' 
         JOIN manten_activ ma ON md.idmanAct = ma.idmanAct
          JOIN manteniento m ON ma.idManten = m.idManten 
          WHERE c.idCompo=:id 
          GROUP BY c.idCompo;";
         $conn = Conexion::getInstance()->getConnection();
         $result = $conn->prepare($sql);
         $result->bindParam(':id', $id, PDO::PARAM_INT); // Vincular el parámetro
         $result->execute();
         $data = $result->fetchAll(PDO::FETCH_ASSOC);
         $dataJson = json_encode($data);
          echo ($dataJson); 
    }
   

}
?>
