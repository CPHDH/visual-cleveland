<?php 
$title='Decennial Census Data';
$subtitle='Cleveland Suburbs: Black Population Change, 1950-2010';
$author = '<a href="http://csudigitalhumanities.org">CSU Center for Public History + Digital Humanities</a>';
$header_styles='<link rel="stylesheet" type="text/css" href="black_population_suburbs.css">';
$cta=null;
$hero=null;
$next=null;
$prev='/euclid';
include '../common/header.php'; 
?>

<section class="container">
	
	<div class="section-title"><h2><?php echo $subtitle;?></h2> <span class="byline">by <strong><?php echo $author;?></strong></span></div>
	<figure id="interactive">
	<div class="inner">
		<nav class="options">
			<a id="bar-chart" href=""><span class="fa fa-bar-chart"></span> Bar Chart</a>
			<a id="line-chart" href=""><span class="fa fa-line-chart"></span> Line Chart</a>
			<a id="data-table" href=""><span class="fa fa-table"></span> Data Table</a>
		</nav>
		<div id="data-visualization-container"></div>
	</div>
	<figcaption>Fig1: Interactive data visualization of African-American population changes in the city and suburbs of Cleveland, Ohio. Source: based on U.S. decennial census data, 1950 to 2010. Compiled by Mark Souther. <a download class="data-download" href="black_population_suburbs.csv">Download source data as .csv file</a>
	</figcaption>
	</figure>
	<section class="explanation">
		<section id="text" class="col">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. </p>
		</section>
		
		<section id="metadata" class="col">
			<h4>References:</h4>
			<ul>
				<li>Census of Population and Housing, 1950, 1960, 1970, 1980. Prepared by Northern Ohio Data & Information Service. The Urban Center. The College of Urban Affairs. Cleveland State University. Ca. 1985. Courtesy of Dr. Robert Wheeler, Associate Professor Emeritus of History, Cleveland State University.</li>
				<li>U.S. Census Bureau. 1990 Census of Population and Housing. Population and Housing Unit Counts. CPH-2-37, Ohio. U.S. Government Printing Office. Washington, DC, 1990. 
				<a href="https://www.census.gov/prod/cen1990/cph2/cph-2-37.pdf">www.census.gov/prod/cen1990/cph2/cph-2-37.pdf</a></li>
				<li>U.S. Census Bureau. 2000 Census of Population and Housing. Population and Housing Unit Counts. PHC-3-37, Ohio. U.S. Government Printing Office. Washington, DC, 2003. <a href="https://www.census.gov/prod/cen2000/phc-3-37.pdf">www.census.gov/prod/cen2000/phc-3-37.pdf</a></li>
				<li>U.S. Census Bureau. 2010 Census of Population and Housing. Population and Housing Unit Counts. CPH-2-37, Ohio. U.S. Government Printing Office. Washington, DC, 2012. <a href="https://www.census.gov/prod/cen2010/cph-2-37.pdf">www.census.gov/prod/cen2010/cph-2-37.pdf</a></li>
				<li>Keating, W. Dennis. The Suburban Racial Dilemma: Race and Housing. Philadelphia: Temple University Press, 1994. </li>
				<li>Michney, Todd M. Surrogate Suburbs: Race and Mobility in Cleveland, 1900-1980. Chapel Hill: University of North Carolina Press, 2017.</li>
				<li>Wiese, Andrew. Places of Their Own: African American Suburbanization in the Twentieth Century. Chicago: University of Chicago Press, 2004.</li>
			</ul>
		</section>    
	</section>

</section>
<?php
include '../common/footer.php'; 
?>
<script src="//d3js.org/d3.v4.min.js"></script>
<script src="<?php echo $site;?>/javascripts/d3tip.js"></script>
<script src="black_population_suburbs.js"></script>