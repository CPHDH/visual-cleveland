<?php

function is_home(){
	$u= parse_url($_SERVER['REQUEST_URI']);
	return ($u['path'] == '/') ? true : false;
}
	
	
function hero_style(){
	if(is_home()){
		return 'background-image: url('.$site.'/images/aerial.jpg)';
	}elseif($hero){
		return 'background-image: url('.$site.$hero.')';
	}else{
		return 'display:none';
	}
}

function secondary_navbar_buttons($start,$next,$prev,$pageTitle){
	if(is_home()){
		$next=$start;
	}
	
	$nextclass= (!$next) ? 'inactive' : 'next';	
	$prevclass= (!$prev) ? 'inactive' : 'prev';

	$html = '<a class="fa fa-arrow-left '.$prevclass.'" title="'.($prev ? 'Previous' : null).'" href="'.$prev.'"></a>';
	$html.= '<a class="fa fa-arrow-right '.$nextclass.'" title="'.($next ? (is_home() ? 'Start' : 'Next') : null).'" href="'.$next.'"></a>';
	$html.= '<a class="fa fa-share"></a>';		
	
	$html.= sharing_menu($pageTitle);
	
	return $html;		
			
}

function primary_menu(){ ?>
	<a class="fa fa-bars"></a>
	<div id="primary-menu" >
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/census">Cleveland Decennial Census Data, 1800-2010<br><span>Created by Erin Bell, CSU Center for Public History + Digital Humanities </span></a></li>
		<li><a href="/euclid">Euclid Ave. City Directory Data, 1937-1997<br><span>Created by CSU Center for Public History + Digital Humanities </span></a></li>
	</ul>
	<a class="sponsor" title="CSU Center for Public History + Digital Humanities" href="http://csudigitalhumanities.org"><img alt="CSU Center for Public History + Digital Humanities" src="<?php echo $site;?>/images/logo.png"></a>
	</div>	
<?php }
	
function sharing_menu($pageTitle){ 
	
	$subject=rawurlencode(strip_tags($pageTitle));
	$body=$subject.'%0A'.current_url().'%0A';
	
?>
	<div id="sharing-menu">
		<ul>
			<li><a target="_blank" class="fa fa-facebook-official" title="Facebook" href="javascript:facebook_share()">Share on Facebook</a></li>
			<li><a target="_blank" class="fa fa-twitter" title="Twitter" href="https://twitter.com/intent/tweet?text=<?php echo $subject;?>&url=<?php echo current_url();?>">Share on Twitter</a></li>
			<li><a class="fa fa-envelope-o" title="Email" href="mailto:?subject=<?php echo $subject;?>&amp;body=<?php echo $body;?>">Share via Email</a></li>
		</ul>
	</div>
<?php }	
	
function current_url() {
	$pageURL = 'http';
	if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
	$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
	$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	} else {
	$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}	