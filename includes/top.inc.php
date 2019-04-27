<?php

session_start();

set_time_limit(120);

define('ROOT_PATH', dirname(__FILE__).'/../');

include ROOT_PATH . 'config.php';

include ROOT_PATH . 'includes/functions.inc.php';

setlocale(LC_TIME, 'fr_FR.utf8');

function __autoload($class_name)
{
    include ROOT_PATH.'includes/'.$class_name . '.class.php';
}
    
?>
