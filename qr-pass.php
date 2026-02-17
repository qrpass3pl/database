<?php
// qr-pass.php - Modified security section to use current user's password

require_once 'config.php';
require_once 'db.php';


?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($myDatabase); ?> - QR Pass</title>
  <link rel="icon" href="res/icon/scan-icon.png" type="image/png">
  <link rel="stylesheet" href="qp.css">
  <link rel="stylesheet" href="ptl.css">
  <link rel="stylesheet" href="sbar.css">
</head>

<body>

  <main class="main-content">
    <iframe src="qr.php" class="sec-frames" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
  </main>

  <script src="req.js"></script>
</body>

</html>
