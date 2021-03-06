<?php
/**
Fichier regroupant les paramètres + config du site
des dossiers, des chemins, des options par défaut, etc.
tout dans un gros tableau $config qu'il suffit de récupérer en déclarant 
global $config; dans les fonctions

**/

// Permet d'ajouter le chemin dans lequel se trouve le config.php au path de recherche, ainsi, il suffit d'inclure le config.php afin de pouvoir faire des require_once('modele.php');
// J'inclus également le fichier /includes + /modeles donc
ini_set('include_path',ini_get('include_path').PATH_SEPARATOR.__DIR__.PATH_SEPARATOR.__DIR__."/../modeles/".PATH_SEPARATOR);

/** Auto chargement des déclarations de classes
    les classes ModeleClasse sont déclarées dans modeles/Classe.php
    les classes ControleurClasse sont déclarése dans controleurs/Classe.php
    les autres classes Classe sont déclarées dans includes/Classe.php
**/
spl_autoload_register(function ($class) {
	if (preg_match ('/([A-Z][a-z]+)(.*)/', $class, $c))
        require_once '../'.strtolower($c[1]).'s/'.$c[2].'.php';
    else
        require_once '../includes/'.$class.'.php';
});

// voici les mensurations des taille des photos afficher sur le site ( pour éviter une guirlande )
$config['largeur_max_photo']=700;
$config['hauteur_max_photo']=600;
$config['largeur_max_vignette']=140;
$config['hauteur_max_vignette']=140*3/4;
$config['qualite_jpeg']=80;

//sly 27/04/06 quelques variable afin d'éviter de mettre des chemins un peu partout
$config['document_root']=$_SERVER['DOCUMENT_ROOT']."/";
$config['rep_web_photos_points']="/photos_points/";
$config['rep_photos_points']=$config['document_root'].$config['rep_web_photos_points']; 
$config['chemin_vues']=$config['document_root']."vues/"; 
$config['chemin_modeles']=$config['document_root']."modeles/"; 
$config['chemin_controlleurs']=$config['document_root']."controlleurs/"; 

$config['url_chemin_icones']="/images/icones/";
$config['chemin_icones']=$config['document_root'].$config['url_chemin_icones'];

// Lien direct vers le mode d'emploi
$config['base_wiki']="/wiki/";

// En version opérationnelle, deviendra www.refuges.info, mais permet aux zones de dev sur d'autres domaine d'être plus dynamique
$config['nom_hote']=$_SERVER['HTTP_HOST'];

//jmb 04/07 on continue avec des rep de moderation
$config['rep_moder_photos_backup']=$config['document_root']."/gestion/sauvegardes-photos/"; 
$config['rep_forum_photos']=$config['document_root']."/forum/photos-points/"; 
$config['rep_web_forum_photos']="/forum/photos-points/"; 

// sly  27/04/06 je préfère me baser sur l'id pour le retrouver plutôt que son type ( que je viens d'ailleurs de modifier )
$config['id_massif']=1; //rff 21/03/06 : id du type de polygone correspondant aux 'massifs'
$config['id_carte']=3; //sly : id du type de polygone correspondant aux 'cartes papier'
$config['id_zone']=11; // jmb : grandes zones, alpes, pyrenees ... 
$config['id_zone_defaut']=352; // sly en fait ce sont les alpes
$config['id_zone_accueil']=3304; // sly en fait ce sont les alpes de chez nous

// Catégorie "tout type de refuges"
// certes une gestion par catégorie directement dans la base serait préférable, mais on a au plus 1 ou 2 catégorie donc, bon,
// à la main dans la config : ( ce sont les id des refuges gardés, non gardés et gites)
$config['tout_type_refuge']="7,9,10";

// C'est clair que c'est nul, mais à certain endroits c'est bien pratique voire dur de faire autrement qu'intéroger le bon id directement
$config['id_cabane_gardee']=7; 
$config['id_refuge_garde']=10; 
$config['id_gite_etape']=9;
$config['point_d_eau']=23;

// Champs valables pour les points classés par spécificité (permet de dynamiquement gérer le formulaire de saisie et d'affichage)
// FIXME sly 13/08/2013 : on pourrait presque aller les chercher dans la base directement, mais on perdrait la possiblité de changer l'ordre facilement. A voir le pour et le contre
$config['champs_binaires_points']=array('couvertures','manque_un_mur','eau_a_proximite','latrines','poele','cheminee','bois_a_proximite');
$config['champs_choix_multiples_points']=array_merge(array('conditions_utilisation','places_matelas'),$config['champs_binaires_points']);
$config['champs_simples_points']=array_merge(array("censure","nom","places","remark","proprio","id_point_type","id_createur","modele","id_point_gps",'places_matelas','nom_createur'),$config['champs_choix_multiples_points']);

// les numéros d'id spéciaux qu'on trouve dans les bases
// Les "nouvelles" du sites, qui ne se rapport à aucun point du site, sont stoquées comme commentaire dont l'id_point vaut cette valeur :
$config['numero_commentaires_generaux']=-2;

//nombre maximum de point que peut sortir la recherche
$config['points_maximum_recherche']=40;

// nombre de point renvoyé par défaut, par l'API (/exportations/)
$config['defaut_max_nombre_point']=121; // NicoM : pourquoi 120 ? sly: pourquoi pas 120 ? NicoM : ben 121 c'est 11^2

// c'est l'id pour lequel les coordonnées gps données sont volontairement fausses
$config['id_coordonees_gps_fausses']=5;
// c'est l'id pour lequel les coordonnées gps données sont approximatives
$config['id_coordonees_gps_approximative']=4;

/********** truc sur le Forum ************/
// des fois qu'on décide de re-bouger le forum, on ne le changera qu'ici
$config['lien_forum']="/forum/";
// lien direct pour se connecter, ou créer un compte sur le forum
$config['connexion_forum']=$config['lien_forum']."login.php";
// lien vers le profil d'un utilisateur
$config['fiche_utilisateur']=$config['lien_forum']."profile.php?mode=viewprofile&amp;u=";
$config['forum_refuge']=$config['lien_forum']."viewtopic.php?t=";

// l'id des modérateurs du forum, pour qu'ils puissent devenir modérateur du site
$config['id_forum_moderateur']=7;
$config['id_forum_developpement']=2;
$config['encodage_exportation']="utf-8";
$config['encodage_des_contenu_web']=$config['encodage_exportation'];

/********** URLs d'accès aux données openstreetmap ************/

$config['xapi_url_poi']="http://api.openstreetmap.fr/osm2node?";
$config['overpass_api']="http://api.openstreetmap.fr/oapi/interpreter";
//Autre serveur de backup :
$config['overpass_api']="http://www.overpass-api.de/api/interpreter";

$config['url_nominatim']="http://nominatim.openstreetmap.org/";
$config['url_appel_nominatim']=$config['url_nominatim'] . "search.php?";
$config['email_contact_nominatim']="sylvain@refuges.info";

/******** Nom du fichier contenant les points exportés **********/
$config['nom_fichier_export']="refuge-info";

// indispensable pour avoir les affichage de date en french et en UTF-8
setlocale(LC_TIME, "fr_FR.UTF-8");

/******** Clés des contrats des cartes **********/
$config['ign_key']='ev2w14tv2ez4wpypux2ael39'; // ID contrat 0004365 / Expire le 31/08/2013 / http://professionnels.ign.fr/user/393960/orders
$config['bing_key']='AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf'; // https://www.bingmapsportal.com

/******** Paramètrage des cartes vignettes des fiches de points **********/
$config['chemin_openlayers']='/ol2.12.4/'; 

// Notez que pour l'instant, suite à une histoire de layers déclaré ou pas dans openlayers, ce paramètre ne sera pas pris en compte partout
// sauf si il vaut maps.refuges.info ou OpenCycleMap
$config['carte_base'] = 'maps.refuges.info';

// FIXME
// Ce fichier est privée et contient des différentes mot de passe à garder secret ou options spécifique à cette installation de refuges.info
// il est volontairement placé "presque*" à la fin pour que les variables ci-avant puissent par exemple être sur-chargées si on souhaite
// un autre comportement
// Le problème c'est que le tableau ci-après re-fait appel à la variable $config['carte_base'] que j'aimerais pouvoir surcharger dans 
// config_privee.php, c'est donc un peu merdique comme méthode, mais j'ai pas trouvé mieux
require_once("config_privee.php");

/* tableau indiquant quel fond de carte on préfère selon le polygon dans lequel on se trouve (utilisé pour les vignettes
des pages points et le lien d'accès en dessous + lorsque l'on modifie un point
le premier champs est le nom du polygone tel qu'il est dans la base openstreetmap 
car c'est ce qui a moins de chance de changer, moins que nos id en tout cas */

$config['fournisseurs_fond_carte'] = 
Array 
(
     // nom pays chez OSM                ?                   français  Nom layer           Échelle 
     'France métropolitaine'=> Array ($config['carte_base'], ''      , 'IGN',               50000),
     'Schweiz'              => Array ($config['carte_base'], ''      , 'SwissTopo',         50000),
     'Italia'               => Array ($config['carte_base'], 'de l\'', 'Italie',           100000),
     'España'               => Array ($config['carte_base'], 'de l\'', 'Espagne',           25000),
     'Andorra'              => Array ($config['carte_base'], ''      , 'IGN',               25000),
     'Autres'               => Array ($config['carte_base'], ''      , 'OpenCycleMap',      50000), // dans les autres cas
     'Saisie-modification'  => Array ($config['carte_base'], ''      , 'Bing photo',        10000), // cas spécial pour la saisie de point
     'Saisie-création'      => Array ($config['carte_base'], ''      , 'Bing photo',     20000000), // cas spécial pour la modification de point
);