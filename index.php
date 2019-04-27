<?php

include 'includes/top.inc.php';

$schema = array();
if(isset($_GET['schema']) && $_GET['schema'] > 0)
{
    $schema = get_schema($_GET['schema']);
}

$schemas = get_schemas();

?>
<!doctype html>
<html>
<head>
	<title>ZDesigner<?php echo ($schema ? ' - ' . $schema['name']:''); ?></title>
 	<meta charset="utf-8" />
	<link rel="stylesheet" href="css/Zdesigner.css" media="all" />     
    <link rel="icon" type="image/png" href="images/favicon.png" />


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="js/jquery-ui.min.js"></script>
    
	<script src="js/utils.js"></script>
	<script src="js/dbd.js"></script>
    
	<script src="js/Menu.js"></script>
	<script src="js/Renderable.js"></script>
	<script src="js/Notification.js"></script>
	<script src="js/Connexion.js"></script>
	<script src="js/Container.js"></script>
    <script src="js/Link.js"></script>
    <script src="js/Column.js"></script>
	<script src="js/Table.js"></script>
    <script src="js/Schema.js"></script>
    <script src="js/HTMLelements.js"></script>
    
    
    <script>
        var load_schema = <?php echo json_encode($schema); ?>;
        var schemas = <?php echo json_encode($schemas); ?>;
        var statics = <?php echo json_encode(get_static_datas()); ?>;
        var connexions = <?php echo json_encode(get_connexions()); ?>;
        var directories = <?php echo json_encode(get_directories()); ?>;
        
        dbd.init();
    </script>
</head>

<body>
    <nav></nav>
    <div id="canvas-grid"><canvas id="canvas"></canvas></div>
</body>
</html>