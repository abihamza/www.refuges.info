<?xml version="1.0" encoding="ISO-8859-1"?>
<sld:StyledLayerDescriptor version="1.0.0"
	xmlns:sld="http://www.opengis.net/sld"
	xmlns:ogc="http://www.opengis.net/ogc"
	xmlns:xlink="http://www.w3.org/1999/xlink"
>

	<sld:NamedLayer>
		<sld:Name>PointsWRI</sld:Name>
		<sld:UserStyle>
			<sld:Name>default</sld:Name>
			<sld:IsDefault>1</sld:IsDefault>

			<sld:Rule>
				<ogc:Filter>
					<ogc:PropertyIsLike wildCard="*" singleChar="." escape="!">
						<ogc:PropertyName>nom_icone</ogc:PropertyName>
						<ogc:Literal>.*</ogc:Literal><!-- un nom_icone existe -->
					</ogc:PropertyIsLike>
				</ogc:Filter>
				<sld:PointSymbolizer>
					<sld:Graphic>
						<sld:ExternalGraphic>
							<sld:OnlineResource xlink:href="/images/icones/${nom_icone}.png" />
							<sld:Format>image/png</sld:Format>
						</sld:ExternalGraphic>
						<sld:Opacity>0.5</sld:Opacity>
						<sld:Size>16</sld:Size>
					</sld:Graphic>
				</sld:PointSymbolizer>
			</sld:Rule>

			<sld:Rule>
				<ogc:Filter>
					<ogc:PropertyIsEqualTo>
						<ogc:PropertyName>site</ogc:PropertyName>
						<ogc:Literal>chemineur.fr</ogc:Literal>
					</ogc:PropertyIsEqualTo>
				</ogc:Filter>
				<sld:PointSymbolizer>
					<sld:Graphic>
						<sld:ExternalGraphic>
							<sld:OnlineResource xlink:href="http://chemineur.fr/prod/chemtype/${type}.png" />
							<sld:Format>image/png</sld:Format>
						</sld:ExternalGraphic>
						<sld:Opacity>0.5</sld:Opacity>
						<sld:Size>16</sld:Size>
					</sld:Graphic>
				</sld:PointSymbolizer>
			</sld:Rule>
			
			<sld:Rule>
				<ogc:Filter>
					<ogc:PropertyIsEqualTo>
						<ogc:PropertyName>site</ogc:PropertyName>
						<ogc:Literal>osm</ogc:Literal>
					</ogc:PropertyIsEqualTo>
				</ogc:Filter>
				<sld:PointSymbolizer>
					<sld:Graphic>
						<sld:ExternalGraphic>
							<sld:OnlineResource xlink:href="http://www.refuges.info/images/icones/osm/${type}.png" />
							<sld:Format>image/png</sld:Format>
						</sld:ExternalGraphic>
						<sld:Size>20</sld:Size>
					</sld:Graphic>
				</sld:PointSymbolizer>
			</sld:Rule>

			<sld:Rule>
				<sld:ElseFilter />
				<sld:PointSymbolizer>
					<sld:Graphic>
						<sld:ExternalGraphic>
							<sld:OnlineResource xlink:href="http://www.refuges.info/images/icones/${type}.png" />
							<sld:Format>image/png</sld:Format>
						</sld:ExternalGraphic>
						<sld:Opacity>1</sld:Opacity>
						<sld:Size>16</sld:Size>
					</sld:Graphic>
				</sld:PointSymbolizer>
			</sld:Rule>
		</sld:UserStyle>

		<sld:UserStyle>
			<sld:Name>select</sld:Name>
			<sld:Rule>
				<sld:PointSymbolizer>
					<sld:Graphic>
						<sld:Size>24</sld:Size>
					</sld:Graphic>
				</sld:PointSymbolizer>
				
				<sld:TextSymbolizer>
					<sld:Label>
						<ogc:PropertyName>nom</ogc:PropertyName>
					</sld:Label>
					<sld:Font>
						<sld:CssParameter name="font-family">Arial</sld:CssParameter>
						<sld:CssParameter name="font-size">14</sld:CssParameter>
						<sld:CssParameter name="font-color">#000</sld:CssParameter>
						
						<sld:CssParameter name="label-y-offset">15</sld:CssParameter>
						<sld:CssParameter name="label-outline-color">yellow</sld:CssParameter>
						<sld:CssParameter name="label-outline-width">5</sld:CssParameter>
					</sld:Font>
				</sld:TextSymbolizer>
			</sld:Rule>
		</sld:UserStyle>
	</sld:NamedLayer>

	<sld:NamedLayer>
		<sld:Name>PolygonesWRI</sld:Name>
		<sld:UserStyle>
			<sld:Name>default</sld:Name>
			<sld:IsDefault>1</sld:IsDefault>
			<sld:Rule>
				<sld:PolygonSymbolizer>
					<Fill>
						<sld:CssParameter name="fill">
							<ogc:PropertyName>couleur</ogc:PropertyName>
						</sld:CssParameter>
						<sld:CssParameter name="fill-opacity">0.2</sld:CssParameter>
					</Fill>		  
					<Stroke>
						<sld:CssParameter name="stroke">
							<ogc:PropertyName>couleur</ogc:PropertyName>
						</sld:CssParameter>
						<sld:CssParameter name="stroke-width">1</sld:CssParameter>
					</Stroke>
				</sld:PolygonSymbolizer>
			</sld:Rule>
		</sld:UserStyle>
	</sld:NamedLayer>

	<sld:NamedLayer>
		<sld:Name>PWRI</sld:Name> 
		<sld:UserStyle>
			<sld:Name>default</sld:Name>
			<sld:IsDefault>1</sld:IsDefault>
			<sld:Rule>
				<sld:PolygonSymbolizer>
					<Fill>
						<sld:CssParameter name="fill">
							<ogc:PropertyName>couleur</ogc:PropertyName>
						</sld:CssParameter>
						<sld:CssParameter name="fill-opacity">0.2</sld:CssParameter>
					</Fill>		  
					<Stroke>
						<sld:CssParameter name="stroke">
							<ogc:PropertyName>couleur</ogc:PropertyName>
						</sld:CssParameter>
						<sld:CssParameter name="stroke-width">1</sld:CssParameter>
					</Stroke>
				</sld:PolygonSymbolizer>
			</sld:Rule>
		</sld:UserStyle>
	</sld:NamedLayer>

	<sld:NamedLayer>
		<sld:Name>Masque</sld:Name> 
		<sld:UserStyle>
			<sld:Name>default</sld:Name>
			<sld:IsDefault>1</sld:IsDefault>
			<sld:Rule>
				<!--<sld:MinScaleDenominator>1000000</sld:MinScaleDenominator>-->
				<sld:PolygonSymbolizer>
					<Fill>
						<sld:CssParameter name="fill">black</sld:CssParameter>
						<sld:CssParameter name="fill-opacity">0.2</sld:CssParameter>
					</Fill>
					<Stroke>
						<sld:CssParameter name="stroke">
							<ogc:PropertyName>couleur</ogc:PropertyName>
						</sld:CssParameter>
						<sld:CssParameter name="stroke-width">1</sld:CssParameter>
					</Stroke>
				</sld:PolygonSymbolizer>
			</sld:Rule>
		</sld:UserStyle>
	</sld:NamedLayer>

</sld:StyledLayerDescriptor>
