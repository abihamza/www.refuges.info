<?php
// FIXME : plus nécessaire normalement, avec GIS de reconstruire les géométries à la main, donc un seul template
// de features possible (voir milieu)
	header("Content-disposition: attachment; filename=$vue->nom_fichier_export.gml");
	header("Content-Type: text/xml; charset=$vue->content_type");
	header("Content-Transfer-Encoding: binary");
	header("Pragma: no-cache");
	header("Expires: 0");
    
?>
<?='<?'?>xml version="1.0" encoding="<?=$vue->content_type?>"?>
<wfs:FeatureCollection
 xmlns:wfs="http://www.opengis.net/wfs"
 xmlns:gml="http://www.opengis.net/gml"
 xmlns:topp="http://www.openplans.org/topp"
>
<name><?=$vue->nom_fichier_export?>.gml</name>
<description><?=$vue->description?></description>
<?php 
// Punaise, impossible d'avoir une indentation propre du gml avec ces imbrications if et foreach
if ($vue->features) 
  foreach ($vue->features as $feature) { ?>
  <gml:featureMember>
        <<?=$feature->feature_name?>>
  <?php if ($feature->proprietes) 
          foreach ($feature->proprietes as $clef => $valeur) { ?>
        <<?=$clef?>><?=$valeur?></<?=$clef?>>
  <?php } ?>
        <?=$feature->geometrie_gml?>
      
        </<?=$feature->feature_name?>>
  </gml:featureMember>
  
  <?}?>
</wfs:FeatureCollection>
