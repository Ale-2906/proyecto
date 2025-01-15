<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link type="text/css" rel="shortcut icon" href="img/logo-mywebsite-urian-viera.svg"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/cargando.css">
    <link rel="stylesheet" type="text/css" href="css/cssGenerales.css">
</head>
<body>

<div class="cargando">
    <div class="loader-outter"></div>
    <div class="loader-inner"></div>
</div>

<nav class="navbar navbar-expand-lg navbar-light navbar-dark fixed-top" style="background-color: #563d7c !important;">
    <ul class="navbar-nav mr-auto collapse navbar-collapse">
        <li class="nav-item active">
            
        </li>
    </ul>
    <div class="my-2 my-lg-0">
        <h5 class="navbar-brand">Web Developer Urian Viera</h5>
    </div>
</nav>

<div class="container">
    <br><br><br><br><br><br>

    <div class="row">
        <div class="col-md-7">
            <form id="uploadForm" enctype="multipart/form-data">
                <div class="file-input text-center">
                    <input type="file" name="actLotes" id="file-input" class="file-input__input" />
                    <label class="file-input__label" for="file-input">
                        <i class="zmdi zmdi-upload zmdi-hc-2x"></i>
                        <span>Elegir Archivo Excel</span>
                    </label>
                </div>
                <div class="text-center mt-5">
                    <button type="submit" class="btn-enviar">Subir Excel</button>
                </div>
            </form>
        </div>

        <div class="col-md-5">
            <?php
            include('config.php');
            $sqlClientes = "SELECT * FROM activos ORDER BY id ASC";
            $queryData = mysqli_query($con, $sqlClientes);
            $total_client = mysqli_num_rows($queryData);
            ?>

            <h6 class="text-center">
                Lista de Activos <strong>(<?php echo $total_client; ?>)</strong>
            </h6>

            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Proceso Compra</th>
                        <th>Serie</th>
                        <th>Codigo Barras</th>
                        <th>Activo</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Color</th>
                        <th>Responsable</th>
                        <th>Ubicación</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $i = 1;
                    while ($data = mysqli_fetch_array($queryData)) { ?>
                        <tr>
                            <th scope="row"><?php echo $i++; ?></th>
                            <td><?php echo $data['procesoCompra']; ?></td>
                            <td><?php echo $data['serie']; ?></td>
                            <td><?php echo $data['codBarras']; ?></td>
                            <td><?php echo $data['activo']; ?></td>
                            <td><?php echo $data['marca']; ?></td>
                            <td><?php echo $data['modelo']; ?></td>
                            <td><?php echo $data['color']; ?></td>
                            <td><?php echo $data['responsable']; ?></td>
                            <td><?php echo $data['ubicacion']; ?></td>
                            <td><?php echo $data['estado']; ?></td>
                            <td><?php echo $data['acciones']; ?></td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="resultModal" tabindex="-1" role="dialog" aria-labelledby="resultModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="resultModalLabel">Resultado</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="resultMessage">
        <!-- Mensaje dinámico aquí -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<script>
document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('recibe_excel_validando.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const message = data.success
            ? `Registros agregados: ${data.total}. Duplicados: ${data.duplicados}.`
            : 'Error al procesar el archivo.';
        document.getElementById('resultMessage').textContent = message;
        $('#resultModal').modal('show'); // Mostrar el modal
    })
    .catch(error => console.error('Error:', error));
});
</script>

<script src="js/jquery.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        $(window).load(function() {
            $(".cargando").fadeOut(1000);
        });
    });
</script>

</body>
</html>
