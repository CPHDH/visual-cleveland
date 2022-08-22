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
			<div id="legend"><h1>Year</h1><select id="y_select"></select><h1>Categories</h1></div>
			<div id="toast"><div id="toast-inner"></div></div>		
		</div>
		<figcaption>Fig. 1: Interactive map displaying historical city directory data for lower Euclid Avenue in Cleveland, Ohio (Public Square to East 9th Street) by location. Source: Cleveland City Directories, select years from 1937 to 1997. <em><strong>NOTE:</strong> 2019 data was manually compiled by Mark Souther and is not part of any city directory.</em> <a download class="data-download" href="euclid.csv">Download source data as .csv file</a>
		</figcaption>
	</figure>
	
	<section class="explanation">
		<br>
		<h3>Introduction</h3>
		<p>City directories were compendia of residents, businesses, and institutions with associated addresses that were widely used in U.S. cities from the 19th century into the 1970s (and sporadically thereafter). Beginning in 1929, city directories incorporated a new feature, the criss-cross directory, which listed all building occupants by street and then by address, enabling them to be read in a place-based manner. Commercial listings also included abbreviated business types. Although these varied from year to year, we have devised a typology of categories and subcategories (adopting widely recognized terminology) that enable more meaningful and accurate analysis. City directories are a rich resource for spatial analysis that can inform urban, public, and digital history. These visualizations depict nearly a century of change along lower Euclid Avenue, the spine of downtown Cleveland.</p>
	</section>
	
	<section>
		<figure>
			<div id="chart-canvas">
				<div id="chart-select"><h1>Category</h1><select id="c_select"></select></div>
				<div id="chart-canvas-inner"></div>
			</div>
			<figcaption class="chart">Fig. 2: Interactive chart displaying historical city directory data for lower Euclid Avenue in Cleveland, Ohio (Public Square to East 9th Street) by category. Source: Cleveland City Directories, select years from 1937 to 1997. <em><strong>NOTE:</strong> 2019 data was manually compiled by Mark Souther and is not part of any city directory.</em> <a download class="data-download" href="euclid.csv">Download source data as .csv file</a>
		</figure>
	</section>
	
	<section>
		<h3>Methodology</h3>
		<p>This visualization began with the question: Could historical city directory data reveal meaningful patterns of change in building uses in downtown Cleveland? If so, it might yield insights useful not only to urban historians but also others in urban planning, finance, real estate, placemaking, and marketing, as well as become a model that is easily replicable in other cities.</p>
		
		<p>City directories were compendia of residents, businesses, and institutions with associated addresses that were widely used in U.S. cities from the 19th century into the 1970s (and sporadically thereafter). Beginning in 1929, city directories incorporated a new feature, the criss-cross directory, which listed all building occupants by street and then by address, enabling them to be read in a place-based manner. </p>
		
		<p>Graduate students developed a spreadsheet of all addresses listed in the criss-cross directories at more or less regular 5-year intervals. Ease of access to CSU's collections led to selecting mainly years ending in a 2 or 7 rather than a 0 or 5. We also collected the information for 2019 using firsthand observation. We surveyed a 26-block stretch of Euclid Avenue, downtown’s preeminent commercial corridor, from Public Square to the Innerbelt Freeway. Our focus was primarily on the pedestrian experience, so we charted only what was located in storefronts, lobbies, mezzanines, arcades, and concourses—not offices or other building uses on upper floors reached only by elevators.</p>
		
		<p>Commercial listings in the directories included abbreviated business types. These varied from year to year, so we devised a typology of categories and subcategories (adopting widely recognized terminology) to enable more meaningful and accurate analysis. </p>
		
		<p>The Center's web developer created a site to provide access to – and contextual information about – the collected data. Before publication online, data was reviewed, normalized, and geocoded. The user interface provides a number of methods for interactive data visualization. The map (<a href="#map-canvas">Fig. 1</a>) provides for basic spatial analysis by year, with color coding to represent the primary categories for each business. The stacked bar chart (<a href="#chart-canvas">Fig. 2</a>) also employs color coding, providing visual representation of changes to the quantity and distribution of categories over time. Users may also select a particular category to assess changes according to narrower criteria. Finally, the full dataset is made accessible in a browsable card-based interface (<a href="#browse-canvas">Fig. 3</a>), which can be filtered/searched by keyword, year, and category. The data may also be downloaded in full as a <a href="euclid.csv">CSV file</a>. The website source code is available at <a href="https://github.com/CPHDH/visual-cleveland">github.com/CPHDH/visual-cleveland</a>.</p>
		
		<p>To be sure, our methodology could not capture a full picture of change on Euclid Avenue. More data points might have helped reveal any anomalies in particular years and pointed more precisely to the onset of certain patterns. Drawing on only the top-level categories rather than also on subcategories further limits the visualization of the emergence and disappearance of more-specific business types. For instance, the visualization does not show the gradual disappearance of fur shops, the emergence of savings and loan companies, or the rise and fall of airline ticket offices. Additionally, there is some ambiguity in the dataset because qualitative assessment was used to interpret how to categorize businesses into categories and subcategories. While done with great care (including additional newspaper research), there is certainly a degree of subjectivity, in part because businesses may provide multiple services, making it difficult to select a primary one. Rather than assign &quot;Other&quot; to every business whose category was not 100% certain, we opted to make informed decisions to assign a more precise category when we had a reasonably high level of confidence.</p>
		
		<p>Despite these limitations, the collection, digitization, and consolidation of otherwise dispersed and inaccessible city directory data (albeit limited by geography) provides an ongoing opportunity for further iteration and analysis – by our team and others. The visualization demonstrates at a minimum the possibilities for the spatial analysis of city directories to depict the shifting contours of downtown business landscapes.</p>
	</section>
	
	<section>
		<figure>
			<div id="browse-canvas">
				<h1>Data Viewer</h1>
				<p>Select a year or category, or enter some text to view matching records.</p>
				<div id="browse-options">
					<input id="filter_browse" placeholder="Type to filter...">
					<div id="select_browse">
						<select id="y_select_browse" title="Select a Year"></select>
						<select id="c_select_browse" title="Select a Category"></select>
					</div>
				</div>
				<div id="browse-canvas-inner"></div>
			</div>
			<figcaption class="browse">Fig. 3: Interactive widget for browsing historical city directory data for lower Euclid Avenue in Cleveland, Ohio (Public Square to East 9th Street) by category. Source: Cleveland City Directories, select years from 1937 to 1997. <em><strong>NOTE:</strong> 2019 data was manually compiled by Mark Souther and is not part of any city directory.</em> <a download class="data-download" href="euclid.csv">Download source data as .csv file</a>
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
