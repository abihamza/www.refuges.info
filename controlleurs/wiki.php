<?php 
/*****************************************************
Controlleur du wiki du site, c'est un moteur qui permet aux modérateurs d'intervenir sur descriptif, licence, fonctionnement et presque tout type de page du site à 
contenu non dynamiquement généré

Finalement on passe à un quasi-vrai wiki avec historique (approximatif) que pour modérateurs
*****************************************************/
require_once ("wiki.php");

$nom_page=$controlleur->url_decoupee[2];
// On est bien avec un moderateur, on peut autoriser, si demande, modification et suppression
if (($_SESSION ['niveau_moderation'] >= 1) ) 
{
	if (isset($_POST ['modification']))
		ecrire_contenu ($nom_page, $_POST ['texte']);
	if ($_GET ['supprimer'] == 1)
		supprimer_page($nom_page);
}

if ($nom_page == '')
	$nom_page = 'index';

// Conteneur standard de l'entête et pied de page
$page =  recupere_contenu ($nom_page);

$vue->titre = $nom_page;
$vue->nom_page= $nom_page;
// La page n'existe pas (ou pas encore !)
if ($page->erreur and $_GET['form_modifier']!=1)
{
    header("HTTP/1.0 404 Not Found");
    $vue->type="page_introuvable";
    $vue->titre=$page->message;
    if ($_SESSION ['niveau_moderation'] >= 1)
    {
        $vue->contenu="Toutefois, vous pouvez la créér si besoin car vous êtes modérateur en : ";
        $vue->lien_special=lien_wiki($vue->nom_page)."?form_modifier=1";
        $vue->titre_lien="Cliquant ici";
    }
} // Un modérateur a demandé à la modifier
elseif($_GET['form_modifier']==1 and $_SESSION ['niveau_moderation'] >= 1)
{
    $vue->type="wiki_modification";
    $vue->contenu_a_modifier=htmlspecialchars($page->contenu,0,"UTF-8");
    $vue->lien_validation=lien_wiki($nom_page);
    $vue->lien_bbocode=lien_wiki('syntaxe_bbcode');
}
else // affichage de la page
{
    if ($_SESSION ['niveau_moderation'] >= 1)
        $vue->montrer_lien_admin=True;
    $controlleur->avec_entete_et_pied = $_GET ['head'] != 'no';

	$vue->date=date("d/m/Y",$page->ts_unix_page);
    $vue->contenu_html  = $page->contenu_html; 
}
?>
