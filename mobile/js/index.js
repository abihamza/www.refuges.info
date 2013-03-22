// Script lié à la page d'accueil

// Ce fichier ne doit contenir que du code javascript destiné à être inclus dans la page
// $modele contient les données passées par le fichier PHP
// $config les données communes à tout WRI

// 14/03/2013 Léo - Création

/************************* FONCTIONS CARTE *************************/

// Les variables necessaires au bon fonctionnement du truc
var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var init = 0;


// Fonction lancée dès que le <div> map est chargé
function initmap(){
	// On teste que le navigateur soit compatible AJAX
	ajaxRequest=GetXmlHttpObject();
	if (ajaxRequest==null) {
		alert ("Ce navigateur ne semble pas suporter la technologie AJAX... Vous devrez peut-être le mettre à jour...");
		return;
	}

	document.getElementById('main').style.height = '90%';
	
	// On créé notre carte vierge
	map = new L.Map('map');

	var MRIUrl='http://maps.refuges.info/hiking/{z}/{x}/{y}.png'; // Serveur de tuiles MRI
	var MRIAttrib='&copy; Contributeurs d\'<a href="http://openstreetmap.org">OpenStreetMap</a>'; // Petit texte de crédit en bas à droite
	var MRI = new L.TileLayer(MRIUrl, {minZoom: 2, maxZoom: 14, attribution: MRIAttrib}); // Création du calque de tuiles nommé MRI

	map.setView(new L.LatLng(47, 2),6); // Par défaut on affiche la France entière
	askForPlots(); // Et on affiche les refuges

	// Fonction lancée quand la géolocalisation a marché
	function onLocationFound(e) {
	    L.marker(e.latlng).addTo(map); // On ajoute un marqueur indiquant notre position (bleu par défaut)
		askForPlots(); // On affiche les refuges dans cette aire
	}
	// Fonction lancée quand la géolocalisation a échoué
	function onLocationError(e) {
		alert(e.message); // On explique que l'erreur au visiteur
	}
	map.locate({watch: true, setView: true, maxZoom: 14}); // On demande de géolocalisé, en continu, avec un zoom de 14 sur notre position

	map.attributionControl.setPrefix(''); // On enlève le crédit vers leaflet
	map.addLayer(MRI); // On ajoute le calque MRI à la carte

	// Ajout de l'icone fullscreen
	var fullScreen = new L.Control.FullScreen(); 
	map.addControl(fullScreen);

	// Action en cas des évenements suivant
	map.on('locationerror', onLocationError);
	map.on('locationfound', onLocationFound);
	map.on('moveend', onMapMove);
}

// Fonction lancée quand on veux afficher les points des refuges
function askForPlots() {
	// On garde en variable les quatres angles de la vue courante (bbox à télécharger)
	var bounds=map.getBounds();
	var minll=bounds.getSouthWest();
	var maxll=bounds.getNorthEast();
	// On prépare l'adresse à télécharger, avec la bbox.
	var msg='../exportations/exportations.php?format=geojson&bbox='+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat;

	// Requete AJAX
	ajaxRequest.onreadystatechange = stateChanged; // Si on a récupéré le fichier, on apelle stateChanged();
	ajaxRequest.open('GET', msg, true); //  On apelle le fichier.
	ajaxRequest.send(null); 
}

function onMapMove(e) { askForPlots(); } // Si on a fini de trifouiller la carte, on rafraichi la liste des refuges

// Fonction appelée pour tester la compatibilité AJAX
function GetXmlHttpObject() {
	if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
	if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
	return null;
}

// Fonction lancée quand AJAX à retourné quelque chose
function stateChanged() {
	// Si AJAX à bien retourné ce que l'on attendais
	if (ajaxRequest.readyState==4) {
		if (ajaxRequest.status==200) {
			plotlist=eval("(" + ajaxRequest.responseText + ")"); // On enregistre la variable GeoJSON en local
			removeMarkers(); // On enlève tous les points actuels
			for (i=0;i<plotlist.features.length;i++) { // Pour chaque point (ligne GeoJSON)
				var plotll = new L.LatLng(plotlist.features[i].geometry.coordinates[1],plotlist.features[i].geometry.coordinates[0]); // On enregistre ses coordonnées
				var plotmark = new L.Marker(plotll); // On créé un marqueur (bleu par défaut)
				map.addLayer(plotmark); // On ajoute un calque pour ce marqueur
				plotmark.data=plotlist.features[i]; // Useless ?
				// Une variable contenant le style du marqueur
				var cabaneIcon = L.icon({
					iconUrl: '../images/icones/' + plotlist.features[i].properties.type + '.png', // On télécharge la bonne image de marqueur
					iconSize: [16, 16],
					iconAnchor: [8, 8],
					popupAnchor: [0, 0]
				});
				plotmark.setIcon(cabaneIcon); // On applique notre icone juste créé
				plotmark.bindPopup('<a href="#" onclick="affichePoint(' + plotlist.features[i].properties.id_point + ');">' + plotlist.features[i].properties.nom + '</a>'); // On ajoute au marqueur un popup contenant le lien
				plotlayers.push(plotmark);
			}
		}
	}
}

// Fonction appelée au avant d'ajouter les marqueurs fournis par AJAX pour enlever les précédents
function removeMarkers() {
	for (i=0;i<plotlayers.length;i++) {
		map.removeLayer(plotlayers[i]);
	}
	plotlayers=[];
}

/************************* FONCTIONS POINTS *************************/


// Fonction appelée lors d'un clic sur point pour afficher les caractéristiques
function affichePoint(idpoint) {
	displayBlock('patientez');

	// On prépare l'adresse à télécharger, avec l'id du point.
	var msg='../point.php/' + idpoint + '/?format=geojson';

	// Requete AJAX
	ajaxRequest.onreadystatechange = pointRecu; // Si on a récupéré le fichier, on apelle pointRecu();
	ajaxRequest.open('GET', msg, true); //  On apelle le fichier.
	ajaxRequest.send(null); 
}

// Fonction lancée quand AJAX à retourné quelque chose
function pointRecu() {
	// Si AJAX à bien retourné ce que l'on attendais
	if (ajaxRequest.readyState==4) {
		if (ajaxRequest.status==200) {
			point=eval("(" + ajaxRequest.responseText + ")"); // On enregistre la variable GeoJSON en local
			document.getElementById('titrePoint').innerHTML = point.properties.nom;
			document.getElementById('idPoint').innerHTML = " (Point n° " + point.properties.id + ") ";
			document.getElementById('typePoint').innerHTML = point.properties.type;
			document.getElementById('coordPoint').innerHTML = "<b>Coordonnées :</b><br />&nbsp;<i>Précision</i> : " + point.properties.precision_gps + "<br />&nbsp;<i>Altitude</i> : " + point.geometry.coordinates[2] + "m, <i>Longitude</i> : " + point.geometry.coordinates[0] + ", <i>Latitude</i> : " + point.geometry.coordinates[1];
			document.getElementById('rmqPoint').innerHTML = "<b>Remarques :</b><br />" + point.properties.remarques;
			displayBlock('points');
		}
	}
}

// Fonction appeler pour basculer entre les vues
function displayBlock(bloc) {
	var carte = document.getElementById('carte');
	var index = document.getElementById('index');
	var patientez = document.getElementById('patientez');
	var points = document.getElementById('infosPoint');
	var header = document.getElementById('header');
	var nav = document.getElementById('nav');
	var footer = document.getElementById('footer');
	var main = document.getElementById('main');


	if(bloc == 'carte') {
		if (init!=1) {
			initmap();
			init = 1;
		}
		points.style.display = 'none';
		carte.style.display = 'block';
		nav.style.display = 'none';
		header.style.display = 'none';
		footer.style.display = 'none';
		index.style.display = 'none';
		patientez.style.display = 'none';
		main.style.height = '100%';
	}
	else if(bloc == 'patientez') {
		points.style.display = 'none';
		carte.style.display = 'none';
		nav.style.display = 'none';
		header.style.display = 'none';
		footer.style.display = 'none';
		index.style.display = 'none';
		patientez.style.display = 'none';
		main.style.height = '100%';
	}
	else if(bloc == 'points') {
		points.style.display = 'block';
		carte.style.display = 'none';
		nav.style.display = 'none';
		header.style.display = 'none';
		footer.style.display = 'none';
		index.style.display = 'none';
		patientez.style.display = 'none';
		main.style.height = '';
	}
	else {
		points.style.display = 'none';
		carte.style.display = 'none';
		nav.style.display = 'block';
		header.style.display = 'block';
		footer.style.display = 'block';
		index.style.display = 'block';
		patientez.style.display = 'none';
		main.style.height = '';
	}
}