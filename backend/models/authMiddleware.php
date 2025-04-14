<?php
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyToken() {
    $headers = apache_request_headers();
    error_log("Encabezados: " . json_encode($headers)); // Log para depuración

    if (isset($headers['Authorization'])) {
        $token = str_replace("Bearer ", "", $headers['Authorization']);
        
        try {
            $decoded = JWT::decode($token, new Key('Mantenimientoequipos', 'HS256'));
            return (array) $decoded; 
                } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                "message" => "Token no válido o ha expirado",
                "error" => $e->getMessage()
            ]);
            exit();
        }
    }

    http_response_code(401);
    echo json_encode(["message" => "Acceso denegado, no se proporcionó token"]);
    exit();
}

?>
