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
			<a id="line-chart" href="" class="active"><span class="fa fa-line-chart"></span> Line Chart</a>
			<a id="data-table" href=""><span class="fa fa-table"></span> Data Table</a>
		</nav>
		<div id="data-visualization-container"></div>
	</div>
	<figcaption>Fig1: Interactive data visualization of African-American population changes in the city and suburbs of Cleveland, Ohio. Source: based on U.S. decennial census data, 1950 to 2010. Compiled by Mark Souther. <a download class="data-download" href="black_population_suburbs.csv">Download source data as .csv file</a>
	</figcaption>
	</figure>
	<section class="explanation">
		<section id="text" class="col">
			<p>Prior to 1960, the African American population of Cuyahoga County was almost completely confined to the Cleveland city limits. Racial steering by real estate brokers, banks’ refusal to lend to Black home buyers who sought homes in heretofore “white” neighborhoods or suburbs, and often prohibitive home costs in outlying areas were among the factors that impeded suburbanization of the African American community in Cleveland and other U.S. cities. In fact, many suburban municipalities actually saw decreases in their suburban Black populations in the 1950s, a carryover from a preexisting trend away from live-in domestic service in the time before racial residential impediments to homeownership eased. The rise of the fair housing movement slowly lifted what some called the “Ivory Curtain.” This dataset shows, on its face, that the first significant increase in black suburbanization in Cuyahoga County coincided with the onset of the county's overall population decline in the 1970s. Access to suburban housing was and remains uneven and inequitable despite some progress delivered by decades of activism and struggle. A comparison of municipal-level data provides a more granular look at this unevenness. With most suburbs working actively to frustrate Black home seekers, only East Cleveland attracted a major influx of new Black residents in the 1960s, although a few others, notably Shaker Heights, showed meaningful gains. The 1970s saw a handful of additional suburbs (especially Cleveland Heights, Warrensville Heights, Bedford Heights, and Garfield Heights) absorb some of the pent-up demand among African Americans for better housing, economic opportunities, and a suburban lifestyle. Later years reveal a wider field open to Black buyers, including on the once almost impervious West Side (where initially the Cuyahoga River formed a racial demarkation - something our charts are not equipped to show because they do not include breakdowns of Black population change inside the Cleveland city limits). Even as late as 2010, only West Side suburbs had topped 5 percent African American population: Berea, Lakewood, and Brooklyn, while eight suburbs - all on the East Side - counted majority-Black populations. </p>
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