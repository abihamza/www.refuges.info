<?php
/********************************************************************************************************
Ceci est un pré-formulaire avant d'appeler point_modification, ceci afin de demande quel type
de point l'internaute souhaite rentrer (cabane, sommet, ...) et ainsi, lui préparer le formulaire mutant de
son choix
********************************************************************************************************/

require_once ("point.php");
require_once ("wiki.php");
require_once ("meta_donnee.php");

$vue->etapes = new stdClass; // les etapes, les titres complementaires affiches en haut
$vue->infos_base = infos_base (); // pour récupérer les types de points possibles

$vue->types_point_affichables=types_point_affichables();

$vue->etapes->licence = new stdClass;
$vue->etapes->licence->titre = "Licence des contenus";
$vue->etapes->licence->texte = "<p>L'information que vous allez rentrer <a href=\"".lien_wiki("restriction_licence")."\">sera soumise à la licence creative commons by-sa</a></p>";

$vue->etapes->quoimettre = new stdClass;
$vue->etapes->quoimettre->titre = "Que mettre ou ne pas mettre ?";
$vue->etapes->quoimettre->texte = "<p>Tout ne trouve pas sa place sur le site, merci de prendre connaissance de
<a href='" .lien_wiki('que_mettre') ."'>ce qui est attendu ou pas sur le site</a></p>";


$vue->titre = 'Ajout d\'un point sur le site '.$config['nom_hote'];
?> 
