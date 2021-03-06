/*DCM++ � Dominique Cavailhez 2012.
 * Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Format/GML.js
 * @requires OpenLayers/Control/Panel.js
 * @requires OpenLayers/Control/SaveFeature.js
 * @requires OpenLayers/Control/DownloadFeature.js
 * @requires OpenLayers/Control/LoadFeature.js
 * @requires OpenLayers/Strategy/Save.js
 * @requires OpenLayers/StyleMap.js
 * @requires OpenLayers/Protocol/HTTP.js
 * @requires OpenLayers/Strategy/Fixed.js
 * @requires OpenLayers/Control/CutFeature.js
 * @requires OpenLayers/Control/ModifyFeature.js
 * @requires OpenLayers/Control/DrawFeaturePath.js
 * @requires OpenLayers/Control/Navigation.js
 * @requires OpenLayers/Control/Snapping.js
 */

/**
 * Class: OpenLayers.Control.Editor
 * Create an editable instance of OpenLayers.Layer.Vector
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Vector>
 */
OpenLayers.Layer.Editor = OpenLayers.Class(OpenLayers.Layer.Vector, {

    /**
     * Property: name
     * {String}
     * Default name
     */
    name: 'Editor',

    /**
     * Property: format
     * {Array(<OpenLayers.Format>)}
     * Default format
     */
    format: new OpenLayers.Format.GML (),

    /**
     * Property: panel
     * {[<OpenLayers.Control.Panel>]}
     * Editor's panel
     */
    panel: new OpenLayers.Control.Panel ({
        displayClass: 'olControlEditingToolbar'
    }),

    /**
     * Property: controls
     * {[<OpenLayers.Control>]}
     * Controls to be added to the editor
     */
    controls: [
        new OpenLayers.Control.SaveFeature (), // Dans l'ordre inverse
        new OpenLayers.Control.DownloadFeature (),
        new OpenLayers.Control.LoadFeature ()
    ],
    
    /**
     * Property: format
     * {<OpenLayers.Bounds>}
     * Cumulated bounds
     */
    bounds: null,

    /**
     * Constructor: OpenLayers.Layer.Editor
     * Create a new vector layer
     *
     * Parameters:
     * name - {String} A name for the layer
     * options - {Object} Optional object with non-default properties to set on
     *           the layer.
     *
     * Returns:
     * {<OpenLayers.Layer.Editor>} A new vector layer
     */
    initialize: function (name, url, options) {
        OpenLayers.Util.extend (this, options);
        
        // Initialisation de la strat�gie de sauvegarde
        this.saveStrategy = new OpenLayers.Strategy.Save();
        this.saveStrategy.events.register ('success', null, function () {
            alert (OpenLayers.i18n('uploadSuccess'));
            this.layer.refresh (); // Va rechercher le r�sultat sur le serveur et le r�affiche pour �tre sur qu'on a bien enregistr�
        });
        this.saveStrategy.events.register ('fail', null, function (e) {
            alert (OpenLayers.i18n('uploadFailure') +"\nError "+ e.response.priv.status +" : "+ e.response.priv.statusText +"\n"+ e.response.priv.responseText);
            // N�c�ssite le patch finalResponse.priv = response.priv; en ligne 504 de lib/Openlayers/Protocol/HTTP.js
        });

        OpenLayers.Layer.Vector.prototype.initialize.call (this, name || this.name, {
            styleMap: new OpenLayers.StyleMap({
                'default': { // Visualisation d'une trace
                    strokeColor: 'red',
                    strokeWidth: 3,
                    cursor: 'pointer',
                    fillColor: 'orange',
                    fillOpacity: 0.4, 
                    pointRadius: 6
                },
                'temporary': { // Cr�ation d'une trace
                    strokeColor: 'red',
                    strokeWidth: 3,
                    cursor: 'pointer',
                    fillColor: 'orange',
                    fillOpacity: 0.3, 
                    pointRadius: 6,
                    strokeOpacity: 0.4
                },
                'select': { // Edition d'une trace
                    strokeOpacity: 0.3
                }
            }),
            protocol: new OpenLayers.Protocol.HTTP ({
                url: url,
                format: this.format
            }),
            strategies: [
                this.saveStrategy,
                new OpenLayers.Strategy.Fixed ()
            ]
        });
    },

    /** 
     * Method: addControls
     * The layer has been added to the map. 
     * 
     * If there is no renderer set, the layer can't be used. Remove it.
     * Otherwise, give the renderer a reference to the map and set its size.
     * 
     * Parameters:
     * controls - {[<OpenLayers.Control>]} 
     */
    addControls: function (controls) {
        var newControls = [];
        for (c in controls) 
            if (!controls[c].notApplicable) {
                controls[c].layer = this;
                controls[c].title = OpenLayers.i18n(controls[c].CLASS_NAME .replace('OpenLayers.Control.','')); // Pour le popup aide � l'utilisation
                newControls.push (controls[c]);
            }
        this.panel.addControls (newControls);
    },

    /** 
     * Method: setMap
     * The layer has been added to the map. 
     * 
     * If there is no renderer set, the layer can't be used. Remove it.
     * Otherwise, give the renderer a reference to the map and set its size.
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
    setMap: function(map) {
        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);

        // Add the editing tools to a panel
         map.addControl  (this.panel);
        this.addControls (this.controls); // Les contr�les param�trables
        this.addControls ([ // Les controles de base
            new OpenLayers.Control.CutFeature (this), // Du dernier au premier
            new OpenLayers.Control.ModifyFeature (this),
            new OpenLayers.Control.DrawFeaturePath (this),
            new OpenLayers.Control.Navigation ()
        ]);
        
        // Configure the snapping agent
        var snap = new OpenLayers.Control.Snapping ({layer: this});
        map.addControl (snap);
        snap.activate ();
    },

    CLASS_NAME: "OpenLayers.Layer.Editor" 
});
