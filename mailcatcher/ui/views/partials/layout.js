module.exports = body => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Mailcatcher UI</title>
  <meta name="description" content="Mailcatcher UI">
  <meta name="author" content="Daniel Reszka">

  <script src="/scripts/socket.io.js"></script>
  <script type="text/javascript">
    const socket = io();
    socket.on('browserReload', (data) => location.reload());
  </script>
</head>

<body>
  ${body}
</body>
</html>
`;
