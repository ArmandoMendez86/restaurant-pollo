<?php

class Conexion
{

	static public function conectar()
	{

		$link = new PDO(
			"mysql:host=localhost;dbname=tio_pollo",
			"root",
			""
		);
		$link->exec("SET time_zone = '-06:00'"); 
		$link->exec("set names utf8");
		return $link;
	}
}
