<?php 
$site='//'.$_SERVER["HTTP_HOST"];
$server=$_SERVER["DOCUMENT_ROOT"];
$start='/census';
$pageTitle='Visual Cleveland | '.($title ? $title.($subtitle ? ' -- '.$subtitle : null) : 'Visualizing Historical Data for Cleveland, Ohio');
require $server.'/helpers/functions.php';
?>
<!DOCTYPE html>
<html lang="en-us">
	<head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="<?php echo $site;?>/styles/global.css">
		<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.css" />
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
crossorigin=""/>
		<link href='https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css' rel='stylesheet' />
		<link href='https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css' rel='stylesheet' />
		<!-- PrefixFree -->
		<script src="<?php echo $site;?>/javascripts/prefixfree.min.js"></script>
		<?php echo $header_styles;?>

	    <title><?php echo $pageTitle;?></title>
		<script>
		  WebFontConfig = {
		    google: { families: [ 'Open+Sans:400,700,400italic:latin' ] }
		  };
		  (function() {
		    var wf = document.createElement('script');
		    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
		      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		    wf.type = 'text/javascript';
		    wf.async = 'true';
		    var s = document.getElementsByTagName('script')[0];
		    s.parentNode.insertBefore(wf, s);
		  })(); 			
		</script>
	</head>

<body <?php echo is_home() ? 'class="home"' : 'class="page"';?>>	
	<header>
		<nav>
			
			<?php echo primary_menu();?>			
			<h1><a href="/">Visual Cleveland</a></h1>
			<?php echo secondary_navbar_buttons($start,$next,$prev,$pageTitle);?>
		</nav>
	
	</header>
	<article class="main">
		<section id="header-intro" class="container" style="<?php echo hero_style();?>" >
			<div id="hero">
				<div id="site-title"><?php echo $title ? $title : 'Visual Cleveland';?></div>
				<div id="site-subtitle"><?php echo $subtitle ? $subtitle : 'Visualizing Historical Data for Cleveland, Ohio';?></div>
				<div id="site-cta"><?php echo $cta ? $cta : '<a href="'.$start.'">Start</a>';?></div>
			</div>
		</section>