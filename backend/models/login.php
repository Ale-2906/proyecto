<?php
include_once 'connectionDB.php';
require '../vendor/autoload.php'; // Asegúrate de incluir el autoload de Composer

use Firebase\JWT\JWT;

class Login {
    private static $secret_key = "Mantenimientoequipos"; // Cambia esto por una clave secreta segura
    private static $algorithm = "HS256"; // Algoritmo de encriptación

    public static function login() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['username']) || !isset($data['pass'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Faltan parámetros obligatorios']);
            return;
        }

        $user = $data['username'];
        $pass = $data['pass'];

        try {
            $conn = Conexion::getInstance()->getConnection();
            $sql = "SELECT * FROM user WHERE username = :user AND pass = :pass";
            $result = $conn->prepare($sql);
            $result->execute([':user' => $user, ':pass' => $pass]);
            $data = $result->fetch(PDO::FETCH_ASSOC);

            if ($data) {
                $payload = [
                    'iss' => "http://yourdomain.com",
                    'iat' => time(),
                    'exp' => time() + (60 * 60), 
                    'data' => [
                        'username' => $data['username']
                    ]
                ];
                $jwt = JWT::encode($payload, self::$secret_key, self::$algorithm);

                echo json_encode(['success' => true, 'token' => $jwt]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
        }
    }
}
?>
