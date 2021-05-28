<?php

$name = $_POST['name'];
$visitor_email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];


if($_POST["name"] && $_POST["email"] && ) {

mail("tej0000001@gmail.com", $subject,
$message. "From: $visitor_email");


}


?>