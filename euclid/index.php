<?php 
$title='Euclid Avenue City Directory Data';
$author = '<a href="http://csudigitalhumanities.org">Center for Public History + Digital Humanities</a>';
$subtitle=null;
$cta=null;
$hero=null;
$next=null;
$prev='/census';
$header_styles='<link rel="stylesheet" type="text/css" href="euclid.css">';
include '../common/header.php'; 
?>
<style>
</style>

<section class="container min">	
	<div class="section-title"><h2><?php echo $title;?></h2> by <strong><?php echo $author;?></strong></div>
	<figure>
		<div id="map-canvas">
			<div id="legend"><h1>Year</h1><select id="y_select"></select><h1>Legend</h1></div>
			<div id="toast"><div id="toast-inner"></div></div>		
		</div>
		<figcaption>Fig1: Interactive map displaying historical city directory data for lower Euclid Avenue in Cleveland, Ohio (Public Square to East 9th Street). Source: Cleveland City Directories, select years from 1937 to 1997. <br><a download class="data-download" href="euclid.csv">Download source data as .csv file</a>
		</figcaption>
	</figure>
	<p>City directories were compendia of residents, businesses, and institutions with associated addresses that were widely used in U.S. cities from the 19th century into the 1970s (and sporadically thereafter). Beginning in 1929, city directories incorporated a new feature, the criss-cross directory, which listed all building occupants by street and then by address, enabling them to be read in a place-based manner. Commercial listings also included abbreviated business types. Although these varied from year to year, we have devised a typology of categories and subcategories (adopting widely recognized terminology) that enable more meaningful and accurate analysis. City directories are a rich resource for spatial analysis that can inform urban, public, and digital history. This visualization depicts nearly a century of change along lower Euclid Avenue, the spine of downtown Cleveland.</p>
</section>

<?php
include '../common/footer.php'; 
?>
<script src="euclid.js"></script>
