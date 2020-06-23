</article>
<footer>
	
	<div class="copyright"><a title="CSU Center for Public History + Digital Humanities" href="http://csudigitalhumanities.org"><img alt="CSU Center for Public History + Digital Humanities" src="<?php echo $site;?>/images/logo.png"></a><!--&copy; <?php echo date('Y');?> CSU Center for Public History + Digital Humanities--></div>
	
</footer>
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
crossorigin=""></script>
<!-- Leaflet Marker Cluster -->
<script src='https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js'></script>
<!-- D3 -->
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="<?php echo $site;?>/javascripts/d3tip.js"></script>
<!-- JQuery (UI) -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
<!-- Other -->
<script src="<?php echo $site;?>/javascripts/jquery.fittext.js"></script>
<script type="text/javascript" async src="https://platform.twitter.com/widgets.js"></script>

<script type="text/javascript">
	
	$("#site-title").fitText(1.2);

	$(".fa-bars").click(function(){
		$("#primary-menu").toggleClass('active');
	});
	
	$(".fa-share").click(function(){
		$("#sharing-menu").toggleClass('active');
	});
	
    function facebook_share(){
	    window.open("https://www.facebook.com/sharer/sharer.php?u="+escape(window.location.href)+"&t="+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
	    return false; 
	 }
	
	// Analytics 
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-71520602-1', 'auto');
	ga('send', 'pageview');
						 
</script>

</body>
</html>