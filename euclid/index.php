<?php 
$title='Euclid Avenue City Directory Data';
$author = '<a href="http://csudigitalhumanities.org">CSU Center for Public History + Digital Humanities</a>';
$subtitle=null;
$cta=null;
$hero=null;
$next=null;
$prev='/black-population-suburbs';
$header_styles='<link rel="stylesheet" type="text/css" href="euclid.css">';
include '../common/header.php'; 
?>
<style>
</style>

<section class="container min">	
	<div class="section-title"><h2><?php echo $title;?></h2> <span class="byline">by <strong><?php echo $author;?></strong></span></div>
	<figure>
		<div id="map-canvas">
			<div id="legend"><h1>Year</h1><select id="y_select"></select><h1>Legend</h1></div>
			<div id="toast"><div id="toast-inner"></div></div>		
		</div>
		<figcaption>Fig1: Interactive map displaying historical city directory data for lower Euclid Avenue in Cleveland, Ohio (Public Square to East 9th Street) by location. Source: Cleveland City Directories, select years from 1937 to 1997. <em><strong>NOTE:</strong> 2019 data was manually compiled by Mark Souther and is not part of any city directory.</em> <a download class="data-download" href="euclid.csv">Download source data as .csv file</a>
		</figcaption>
	</figure>
	
	<section class="explanation">
	<p>City directories were compendia of residents, businesses, and institutions with associated addresses that were widely used in U.S. cities from the 19th century into the 1970s (and sporadically thereafter). Beginning in 1929, city directories incorporated a new feature, the criss-cross directory, which listed all building occupants by street and then by address, enabling them to be read in a place-based manner. Commercial listings also included abbreviated business types. Although these varied from year to year, we have devised a typology of categories and subcategories (adopting widely recognized terminology) that enable more meaningful and accurate analysis. City directories are a rich resource for spatial analysis that can inform urban, public, and digital history. These visualizations depict nearly a century of change along lower Euclid Avenue, the spine of downtown Cleveland.</p>
	</section>
	
	<section>
		<figure>
			<div id="chart-canvas">
				<div id="chart-select"><h1>Category</h1><select id="c_select"></select></div>
				<div id="chart-canvas-inner"></div>
			</div>
			<figcaption class="chart">Fig2: Interactive chart displaying historical city directory data for lower Euclid Avenue in Cleveland, Ohio (Public Square to East 9th Street) by category. Source: Cleveland City Directories, select years from 1937 to 1997. <em><strong>NOTE:</strong> 2019 data was manually compiled by Mark Souther and is not part of any city directory.</em> <a download class="data-download" href="euclid.csv">Download source data as .csv file</a>
		</figure>
	</section>
	<section>
		<figure>
			<div id="table-canvas">
			</div>
		</figure>	
	</section>
	
	<section>
		<figure>
			<div id="browse-canvas">
				<div id="browse-options">
					<input id="filter_browse" placeholder="Type to filter...">
					<div id="select_browse">
						<select id="y_select_browse" title="Select a Year"></select>
						<select id="c_select_browse" title="Select a Category"></select>
					</div>
				</div>
				<div id="browse-canvas-inner"></div>
			</div>
			<figcaption class="browse">Fig3: Historical city directory data for lower Euclid Avenue in Cleveland, Ohio (Public Square to East 9th Street) by category. Source: Cleveland City Directories, select years from 1937 to 1997. <em><strong>NOTE:</strong> 2019 data was manually compiled by Mark Souther and is not part of any city directory.</em> <a download class="data-download" href="euclid.csv">Download source data as .csv file</a>
		</figure>
	</section>
	<section>
		<figure>
			<div id="table-canvas">
			</div>
		</figure>	
	</section>	
	
</section>

<?php
include '../common/footer.php'; 
?>
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
crossorigin=""></script>
<!-- Leaflet Marker Cluster -->
<script src='https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js'></script>
<!-- D3 -->
<script src="//d3js.org/d3.v4.min.js"></script>
<script src="euclid.js"></script>
