<?php 
$title='Decennial Census Data';
$subtitle='Cleveland Population Change, 1800-2010';
$author = '<a href="http://csudigitalhumanities.org">CSU Center for Public History + Digital Humanities</a>';
$header_styles='<link rel="stylesheet" type="text/css" href="census.css">';
$cta=null;
$hero=null;
$next='/euclid';
$prev='/';
include '../common/header.php'; 
?>

<section class="container">
	
	<div class="section-title"><h2><?php echo $subtitle;?></h2> <span class="byline">by <strong><?php echo $author;?></strong></span></div>
	<figure id="interactive">
	<div class="inner">
		<div class="figtitle">Fig1: Decennial Census Data</div>
		<nav class="options">
			<a id="bar-chart" href=""><span class="fa fa-bar-chart"></span> Bar Chart</a>
			<a id="line-chart" href=""><span class="fa fa-line-chart"></span> Line Chart</a>
			<a id="diverging-chart" href=""><span class="fa fa-exchange"></span> Diverging Chart</a>
			<a id="data-table" href=""><span class="fa fa-table"></span> Data Table</a>
		</nav>
		<div id="data-visualization-container"></div>
	</div>
	<figcaption>Fig1: Interactive data visualization of historical population change in Cleveland, Ohio. Source: based on U.S. decennial census data, 1800 to 2010. <a download class="data-download" href="data.csv">Download source data as .csv file</a>
	</figcaption>
	</figure>
	<section class="explanation">
		<section id="text" class="col">
			<p>During Cleveland's first century, the city grew at an ever-accelerating rate. Powered by an explosion of industry and in-migration, a favorable location in rail and waterway shipping networks, and geographic expansion, the city's population had swelled to over 800,000 by 1920. It was not until the 1930 census that Cleveland's population growth showed the first signs of deceleration. Though the census showed an increase of over 100,000 over the previous decade, the rate of growth &ndash; 13 percent &ndash; was an all-time low, and the first time in Cleveland history that the growth rate showed a decrease. In 1940, this slowing momentum transformed into a negative growth rate of 2 percent. Although the city recovered in the 1950 census, growing by 4 percent to reach its peak population of over 914,000 residents, this would be the city's last era of population growth to date. Over the course of the next 60 years, Cleveland's population would continue to decrease, leaving behind an infrastructure suitable to a much more densely-populated city. One decade into the 21st century, Cleveland's population has receded to a number comparable to its size at the turn of the 20th century.</p>
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
<script src="census.js"></script>