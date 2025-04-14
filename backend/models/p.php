
<?php 
echo __DIR__ . '..\vendor\autoload.php';
require __DIR__ . '..\vendor\autoload.php'; // Ajusta la ruta según tu proyecto
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = 'Mantenimientoequipos';
$payload = [
    'iss' => 'http://yourdomain.com',
    'iat' => time(),
    'exp' => time() + 3600, // 1 hora
    'data' => ['username' => 'admin']
];

// Generar el token
$jwt = JWT::encode($payload, $key, 'HS256');
echo "Token generado: " . $jwt . "\n";

// Decodificar el token
$decoded = JWT::decode($jwt, new Key($key, 'HS256'));
print_r($decoded);

?>