/*DCM++ � Dominique Cavailhez 2012.
 * Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full text of the license. */

/**
 * @requires OpenLayers/Control/Permalink.js
 * @requires OpenLayers/Control/ArgParserCookies.js
 */

/**
 * Class: OpenLayers.Control.PermalinkCookies
 * Create an instance of OpenLayers.Control.Permalink that keep lon,lat, scale & active layers in cookies
 *
 * Inherits from:
 *  - <OpenLayers.Permalink>
 */

/**
 * Les param�tres sont pris par ordre de priorit� : permalink, cookie, defaut
 * new OpenLayers.Control.PermalinkCookies ({ // Un lien permalink conserv� dans un cookie qui reporte les param�tres d'une page � l'autre
 *     defaut: { // La position par d�faut s'il n'y a pas de cookie ou de permalink
 *         lon: 5.7,
 *         lat: 45.2,
 *         scale: 500000,
 *         baseLayer: 'OSM'
 *     },
 *     cookie: { // Ecrase la valeur du cookie
 *         lon: 5.7, ...
 *     },
 *     permalink: { // Ecrase la valeur du permalink
 *         lon: 5.7, ...
 *     }
 * }),
**/

OpenLayers.Control.PermalinkCookies = OpenLayers.Class(OpenLayers.Control.Permalink, {

    /**
     * APIProperty: argParserClass
     * {Class} The ArgParser control class (not instance) to use with this control.
     * Pour r�cup�rer les valeurs des cookies, va utiliser ce parser � la place de OpenLayers.Control.ArgParser
     */
    argParserClass: OpenLayers.Control.ArgParserCookies, 

    /**
     * APIMethod: createParams
     * Creates the parameters that need to be encoded into the permalink url.
     * Enregistre les param�tres de la carte dans des cookies � chaque changement de lat lon zoom & layer
     * 
     * Parameters:
     * center - {<OpenLayers.LonLat>} center to encode in the permalink.
     *     Defaults to the current map center.
     * zoom - {Integer} zoom level to encode in the permalink. Defaults to the
     *     current map zoom level.
     * layers - {Array(<OpenLayers.Layer>)} layers to encode in the permalink.
     *     Defaults to the current map layers.
     * 
     * Returns:
     * {Object} Hash of parameters that will be url-encoded into the permalink.
     */
    createParams: function(center, zoom, layers) {
        var params = OpenLayers.Control.Permalink.prototype.createParams.apply (this, arguments);
        
        if (this.map.baseLayer) {
            // Ajoute un param�tre d'�chelle qui permet de retrouver la bonne �ch�le quelque soit le nombre de couches de la carte
            params.scale = 
                Math.round (
                    OpenLayers.Util.getScaleFromResolution (
                        this.map.baseLayer.resolutions[this.map.zoom], 
                        this.map.baseLayer.units
                    )
                );
            // Ajoute le nom de la couche de base, en clair (si la page suivante n'a pas la m�me liste de couches)
            params.baseLayer = this.map.baseLayer.name; // La derni�re base utilis�e
        }

        // En plus d'afficher un permalink, l'enregistre dans un cookie
        OpenLayers.Util.writeCookie (
            'params', 
            OpenLayers.Util.getParameterString (params)
        );

        return params;
    },

    CLASS_NAME: "OpenLayers.Control.PermalinkCookies"
});

