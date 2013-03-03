<?// Code Javascript de la page des cartes
// yip test de WFS, en Official OL car je ne sais pas modifier OL pour inclure les fonctions
?>

var map;
var poly_conteneur;  // le poly sur lequel toute la navigation se base

// Proxy monte par Dominique
OpenLayers.ProxyHost = "/ol2.12.1.3/proxy.php?url=";

window.onload = function () {

	//===================  DEBUT initialisation MAP =======================
	map = new OpenLayers.Map('carto_nav', {
//			units: 'm'
//			projection: new OpenLayers.Projection("EPSG:4326"),
//			displayProjection: new OpenLayers.Projection("EPSG:4326")
			});
	//================ FIN initialisation MAP ==========================

	//===================== DEBUT LAYERS ========================
	// definit et ajoute la couche de base
	var base = new OpenLayers.Layer.WMS( "OpenLayers WMS",
                    "http://vmap0.tiles.osgeo.org/wms/vmap0",
                    {layers: 'basic'} );
	map.addLayer(base);
//	http://maps.refuges.info/hiking/${z}/${x}/${y}.png
	
//	layerCycleMap = new OpenLayers.Layer.OSM("CycleMap");
//	layerCycleMap.projection = new OpenLayers.Projection("EPSG:900913");
//	map.addLayer(layerCycleMap);

	// extend superlarge, mais il ne sera pas afficher. c'est pour la recherche du conteneur est limitee a cet extend !! /FIXME
	map.zoomToExtent(new OpenLayers.Bounds(-80,0,80,80)); 
	
	// Construit tous les layers, a partir de l'url en parametre.
	// cette fonction est basee sur le GetCapabilities du protocole WFS
	// elle applique aussi les styles SLD.
	construit_layers("http://yip.refuges.info/tinyows/tinyows.cgi?");
	
	// deplace le layer switcher dans un div a part pour garder l'interface WRI habituelle
	// FIXME : ajuster le css du layerswitcher
	map.addControl(new OpenLayers.Control.LayerSwitcher( {'div':OpenLayers.Util.getElement('layerswitcher')} ));
	map.addControl(new OpenLayers.Control.PanZoomBar());
//console.log(map);
	// definit et ajoute une 3e couche vector MASQUE de selection "FACULTATIF"
	// pour le dessin du masque, la creation ...
	var masque = new OpenLayers.Layer.Vector("Masque", {
			alwaysInRange: true,
			displayInLayerSwitcher: false,
			styleMap : new OpenLayers.StyleMap({
						'fillOpacity': 1,
                         'fillColor': '#FFFFFF'})
	});	
	map.addLayer(masque);

/*	// teste si on a un conteneur dans l'URL
	var poly_id = document.URL.match(/nav2\/([0-9]+)/);
	if ( poly_id ) {
		poly_id = poly_id.pop();
	} else {
		poly_id = 2 ; // FIXME config zone par defaut
	}
	init_conteneur( masque, poly_id );
*/
	

	// C'EST LA QUE CA COMMENCE, sans conteneur, point de salut
//	init_conteneur();
	//================= FIN LAYERS ======================

	//================  VECTORS CLIQUABLE (fixme) ================
	active_couche_cliquable(masque) ;

}



//=================================================================
//=================  DEBUT FONCTIONS MAISONS ===========================
//==============================================================
function construit_layers(url_wfs){
     
	var WFSLayerList;
     
	var defaultWFSProperty = {
		url: url_wfs,
		featureNS: "http://nextgis.org/sf",
		//geometryName: "geom"
	};
		
	OpenLayers.Request.GET({
		url: defaultWFSProperty.url+'VERSION=1.1.0&SERVICE=WFS&REQUEST=GetCapabilities',
		async: false, //bloque tout le temps de la reponse 
		success: function(e) {
			WFSLayerList = new OpenLayers.Format.WFSCapabilities().read(e.responseText);
		}
	});

	// Recupere la feuille SLD
	// FIXME : deplacer l'URL en variable
	var format = new OpenLayers.Format.SLD();
	var sld;
	OpenLayers.Request.GET({
			url: "/tinyows/refuges-info-sld.xml",
			async: false,
			success: function (fic) {
				sld = format.read(fic.responseXML || fic.responseText); }
	});

	// Pacours des layers renvoyes par le WFSgetCapabilities
	var layers = [] ;
	WFSLayerList.featureTypeList.featureTypes.forEach(function(l) {

		// extrait les echelles MIN et MAX du titre du layer . limitera le layer a l'affichage.
		var titre = l.title.match(/(.*).echelle:(\d+)-(\d+)/); // nom, echellemax , echellemin
		if( ( ! titre ) && titre.length < 3) { alert ("pb sur titre de la feature ::nom echelle:max-min"); }

		layers[l.name] = new OpenLayers.Layer.Vector(
			titre[1], {
			strategies: [new OpenLayers.Strategy.BBOX()],
			visibility: true,
			protocol: new OpenLayers.Protocol.WFS(OpenLayers.Util.applyDefaults({
								featureNS: l.featureNS,
								featureType: l.name,
								version : "1.1.0" },  // il fait tout seul de la reprojection en 4326
							defaultWFSProperty)
						),
			minScale: (titre[3] ? titre[3] : "auto") ,
			maxScale: (titre[2] ? titre[2] : "auto") ,
		});

		// Applique le style SLD si il y en a un qui correspond a l'abstract
		if( sld.namedLayers[l.abstract] ) {
			var styles = sld.namedLayers[l.abstract].userStyles, style; // tous les styles du layer
				for (var i=0,j=styles.length; i<j; ++i) {
					style = styles[i];  // style = style par defaut, style = hover .....
					layers[l.name].styleMap.styles[style.name] = style;
				}
			}

		map.addLayer(layers[l.name]);
	});
}


function maj_carte ( masque ) {

	// masque est un bool qui indique si on doit appliquer le filtrage par poly

	for ( i in map.getLayersByClass('OpenLayers.Layer.Vector') ) {
		var layer = map.getLayersByClass('OpenLayers.Layer.Vector')[i];

		var ancien_filtre = layer.filter ;
		var condition = [];
		var filtre_cql = new OpenLayers.Format.CQL() ; 

		if ( masque ) {
			condition.push( 'INTERSECTS ( geom , ' + poly_conteneur.geometry + ')' );
			
			if( layer.id == poly_conteneur.idlayer ) { // c'est le layer du conteneur
				condition.push( "id_polygone <> " + poly_conteneur.attributes.id_polygone )
			}
		}
		if ( condition.length > 0 ) {
			var nouveau_filtre = filtre_cql.read( condition.join(' AND ') ) ;
		} else {
			var nouveau_filtre = null ;
		}
//		if ( nouveau_filtre != ancien_filtre ) {
			layer.filter = nouveau_filtre ;
			layer.refresh({force: true});
//		}
		
	} 
}

// fait un enorme poly avec un trou dedans de la taille du param
//FIXME, a l'arrach
function inverse_polygone ( mpoly ) {
	var multiply = map.numZoomLevels - map.getZoom() - 1; // coefficient pour la taille du masque. plus c'est gros, moins faut multiplier
//console.log(multiply);
	//FIXME: coef en degree, relatif a la propriete "units" (bug en vue)
	var bigbox = new OpenLayers.Geometry.Polygon.createRegularPolygon( mpoly.geometry.getBounds().toGeometry().getCentroid(), multiply, 6, 0);
	var t = new OpenLayers.Geometry.LinearRing(bigbox.getVertices());
	var inners = [ t ] ;
	for (var c in mpoly.geometry.components) {
		inners.push( new OpenLayers.Geometry.LinearRing(mpoly.geometry.components[c].getVertices()) );
	} 
	var polymasque = new OpenLayers.Geometry.Polygon(inners);
	var mpoly = new OpenLayers.Geometry.MultiPolygon(polymasque);
	var feat = new OpenLayers.Feature.Vector( mpoly );

	return feat;
}

// ================  DEBUT CLIC SOURIS ============================

function active_couche_cliquable( masque ) {

	// recupere TOUS les vectors pour leur attribuer des proprietes
	var vectors = map.getLayersByClass("OpenLayers.Layer.Vector");

	// ajout l'attribut hover highlight a tous les layers de type Vector (WFS)
	var featurehovered = new OpenLayers.Control.SelectFeature(vectors, {
							hover: true,
							highlightOnly: true,  // pour faire un hover SANS selectionner
							renderIntent: "temporary"
				}
            );
	featurehovered.handlers['feature'].stopDown = false; // permet le drag a la souris
	map.addControl(featurehovered); featurehovered.activate();

	// ajout l'attribut clickable a tous les layers de type Vector (WFS), faut le faire apres l'Hover
	var featureclicked = new OpenLayers.Control.SelectFeature( vectors, {
						clickout: true,
						// ICI appel de la fonction qui reagit au click
						onSelect: function(feature){
										if( feature.attributes.id_point ) { // si c'est un point, on va sur la fiche
											 //window.open(,"POI"); //FIXME 
											 alert("lien vers /point/" + feature.attributes.id_point + "/" + feature.attributes.nom);
										} else if (feature.layer == masque) {
											// on vient de cliquer sur le masque.
											maj_carte( false ) ; // maj_carte SANS masque
											masque.removeAllFeatures();
											masque.refresh({force: true});
										} else {
											// on continue a naviguer
//console.log(feature.layer.projection);
											poly_conteneur = feature.clone() ; // stockage du conteneur
											poly_conteneur.idlayer = feature.layer.id ;
											map.zoomToExtent( feature.geometry.getBounds() );
											maj_carte( true ) ; // mets a jour les filtres
											// FIXME pas de retour arriere vers l'ancien conteneur
											// on vire le poly selectionne
											masque.removeAllFeatures();
											masque.addFeatures( [ inverse_polygone(poly_conteneur) ] );
										}
								}
	});
	featureclicked.handlers['feature'].stopDown = false; // permet le drag a la souris
	map.addControl(featureclicked);	featureclicked.activate();
}
