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
				<li>Gibson, Campbell (June 1998). "Population of the 100 Largest Cities and Other Urban Places in the United States: 1790 to 1990". U.S. Census Bureau. </li>
				<li>"Profile of General Population and Housing Characteristics: 2010 Census Summary File 2". American FactFinder. U.S. Census Bureau.</li>
			</ul>
		</section>    
	</section>

</section>
<?php
include '../common/footer.php'; 
?>	
<script src="black_population_suburbs.js"></script>