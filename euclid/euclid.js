// Configured variables ===================================

var csv="euclid.csv";
var map_container="map-canvas";
var chart_container="#chart-canvas-inner";
var default_coords=[41.499685,-81.690637];
var default_zoom=12;
var condensed_labels = ["BUILDING DETAIL","UNKNOWN","UNKNOWN OR OTHER","BUILDING AMENITY","PARKING", "UTILITIES"];
var condensed_labels_replacement = "OTHER"; // condensed & unconfigured categories always appear as black (#000000)
var label_colors = [{
		'name': 'CLUBS AND ORGANIZATIONS',
		'color': colorRange(0)
	},{
		'name': 'ENTERTAINMENT',
		'color': colorRange(1.5)
	},{
		'name': 'FINANCE, INSURANCE AND REAL ESTATE',
		'color': colorRange(3)
	},{
		'name': 'FOOD SERVICES AND DRINKING PLACES',
		'color': colorRange(4.5)
	},{
		'name': 'HOTELS AND MOTELS',
		'color': colorRange(5.25)
	},{
		'name': 'INSTITUTION',
		'color': colorRange(6)
	},{
		'name': 'MANUFACTURER',
		'color': colorRange(7)
	},{
		'name': 'MUSEUMS AND GALLERIES',
		'color': colorRange(7.75)
	},{
		'name': 'PROFESSIONAL',
		'color': colorRange(8.75)
	},{
		'name': 'RETAIL',
		'color': colorRange(10)
	},{
		'name': 'SERVICE',
		'color': colorRange(12)
	},{
		'name': 'VACANT',
		'color': '#777777'
	}];

// D3 Extensions ==========================================

d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};	
d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};	

// Implementation =========================================

document.addEventListener("DOMContentLoaded", function(event) { 
	const map = null;
	d3.csv(csv,function(data){
		// first, sort by category, so that clusters spider nice
		var sorted_by_category = data.sort(function (a,b) {return d3.ascending(a.category, b.category); });
		// put sorted data into year-based arrays
		var data_by_years = dataByYears(sorted_by_category);
		// get category labels
		var legend_labels = getCategories(data);
		// get a simple array of years to use as keys
		var years = getYears(data); 
		// chart json
		var chart_json = getCategoryCountsByYear(data, legend_labels, years)
					
		// build the ui/legend controls
		doLegendControls(legend_labels, data_by_years, years, chart_json);
		
		// build the map	
		doMap(data_by_years, years, 0);
		
		// do the category charts
		doChart(chart_json, null, years);
		
	});
		
});	
	
// Functions ==============================================
function doChart(chart_json, category, years){
	console.log("loading data for " + (category ? category : 'ALL CATEGORIES')  + "...")
	
	/*
	****************
	Prepare the data
	****************	
	*/
		
	if(category){
		var filter = chart_json.filter(obj =>{ if(obj.category === category) return obj });
		var max_count = d3.max(filter[0].counts)
		var data = [filter[0]]; // array of one category
	}else{
		var max_count = d3.max(chart_json.totals)
		var data = chart_json // array of all categories 
	}
	
	/*
	**********************
	Set up the chart scale
	**********************	
	*/
    	
	// D3 margin convention  
	var margin = {top: 20, right: 30, bottom: 20, left: 50},
	    height = 400 - margin.top - margin.bottom,
	    width = parseInt(d3.select(chart_container).style('width'), 10),
	    width = width - margin.left - margin.right
	
	// X scale uses years
	var xScale = d3.scaleBand()
	    .domain(years) 
	    .range([10, width-10])
	    .padding(.2)
	
	// Y scale uses category counts
	var yScale = d3.scaleLinear()
	    .domain([0, max_count]) 
	    .range([height, 0]);  
	    				
	// Add the SVG to the container
	var svg = d3.select(chart_container).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// Append the x axis
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(xScale)
	    	.tickValues(years)
	    	.tickFormat(d3.format("Y"))); // no commas; format as years
	
	// Append the y axis
	svg.append("g")
	    .attr("class", "y axis")
	    .call(d3.axisLeft(yScale).ticks( Math.min(10, yScale.domain()[1] ))) // no more ticks than there are total (max 10)
	    
	/*
	*****************
	Add the data bars
	*****************
	*/

	var bars = svg.append("g").attr("id","bars")
	years.forEach((year,i)=>{
		var bar = bars.append("g").attr("id","bars_"+year)
		var year_index = i;
		var y0 = 0; // stacking
		bar.selectAll("bar")
			.data(data) 
			.enter()
			.append("rect")
			.attr("x", xScale(year) )
			.attr("y", (d) => {
			    var count = d.counts[year_index] ? d.counts[year_index] : 0
			    y0 += count // stacking
			    return yScale(y0)
			   })
			.attr("category", (d) =>{
			    return d.category
			})
			.attr("year", year)
			.attr("total", (d) => {
			    return d.counts[year_index] ? d.counts[year_index] : 0
			   })
			.attr("class", "rect_"+year)
			.attr("width", xScale.bandwidth())
			.attr("height", (d) =>{
			    var count = d.counts[year_index] ? d.counts[year_index] : 0
			    var bar_height = count ? (height - yScale(count)) : 0
			    return bar_height
			})
			.attr("fill", (d) =>{
			    return getMarkerColor(d.category)
			})		  

	})
		
}


function getCategoryCountsByYear(data,legend_labels,years){
	var json = new Array
	legend_labels.forEach(label => {
		var yobj = new Object
		yobj.category = label
		yobj.counts = new Array(years.length)
		json.push(yobj)
	});

	// obj.counts array maps to years index (obj.counts[0] == years[0]) so we can push to that array below
	json.totals = new Array(years.length)
	data.forEach(row=>{
		var category_and_sub = row.category ? row.category.split("|") : [condensed_labels_replacement,condensed_labels_replacement];
		var category = category_and_sub[0].trim();
		var year = row.year;
		var i = years.findIndex((y)=> y === year); // matches years[i] in json
		var c = json.findIndex((j)=>j.category === category)
		if(json[c]){
			var obj = json[c] // the category object
		}else{
			var obj = json[json.length-1] // the "OTHER" category object (condensed)		
		}
		// update count for the category
		obj.counts[i] = obj.counts[i] ? obj.counts[i] + 1 : 1 ;
		// update "All Categories" totals for each year (use in default y-scale)
		json.totals[i] = json.totals[i] ? json.totals[i] + 1 : 1;	
	})
	return json
}


function doLegendControls(legend_labels, data_by_years, years, chart_json){
	// populate legend
	d3.select('#legend').append("ul").html(function(){
		var html='';
		legend_labels.forEach(function(label){
			html += '<li><div class="color" style="background-color:'+getMarkerColor(label)+'"></div><div class="label">'+label.toLowerCase()+'</div></li>';
		})
		return html;
	});
	
	// populate years
	d3.select('#legend #y_select').html(function(){
		var html='';
		// sort years for display, reference the *initial* array order when switching
		var sorted = years.sort();
		sorted.forEach(function(y,i){
			html += '<option value="'+y+'">'+y+'</option>';
		})
		return html;
	});
	
	// populate categories
	d3.select('#chart-select #c_select').html(function(){
		var html='<option value="">All Categories</option>';
		// sort years for display, reference the *initial* array order when switching
		legend_labels.forEach(function(c,i){
			html += '<option value="'+c+'">'+c.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())+'</option>';
		})
		return html;
	});	
		
	// listen for year selection
	var s = document.getElementById("y_select");
	s.addEventListener("change", function(e){
		// remove existing map
		map.remove();
		// re-build map for new year
		var i = years.indexOf(e.target.value);
		doMap(data_by_years, years, i);
	});	

	// listen for category selection
	var s = document.getElementById("c_select");
	s.addEventListener("change", function(e){
		// @TODO!
		var chart = document.querySelector(chart_container);
		chart.innerHTML = '';
		var category = e.target.value ? e.target.value : null
		doChart(chart_json, category, years)
	});	
}

function doMap(data_by_years, years, year_index){
	map = L.map(map_container,{
		scrollWheelZoom: false,
		center:default_coords,
		zoom:default_zoom,
	});
	L.tileLayer('//cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/light_all/{z}/{x}/{y}{retina}.png', {
	    attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://cartodb.com/attributions">CartoDB</a>',
	    retina: (L.Browser.retina) ? '@2x' : '',
	}).addTo(map);

	
	// cluster group
	var group=[];
	var markers = L.markerClusterGroup({
		showCoverageOnHover: true,
		spiderfyOnMaxZoom: true, 
		zoomToBoundsOnClick:true,
		maxClusterRadius: 50,
		polygonOptions: {
			'stroke': false,
			'color': '#000',
			'fillOpacity': .1
		}
	});

	// add markers
	console.log("loading data for "+years[year_index]+"...");
	data_by_years[year_index].forEach(function(row,i){
		// coords
		var lon=row.Longitude;
		var lat=row.Latitude;
		// popup html		
		var title = row.occupant_name ? '<h1>'+row.occupant_name.trim()+'</h1>' : '<h1>Occupant Not Recorded</h1>';
		var address = row.location ? '<div class="address">'+row.location.trim()+'</div>' : '';
		var building = row.building_name ? '<div class="building">'+row.building_name.trim()+'</div>' : '';
		var year = row.year ? '<div class="year"><span>Year:</span> '+row.year.trim()+'</div>' : '';
		var type = row.occupant_type ? '<div class="type"><span>Type:</span> '+row.occupant_type.trim()+'</div>' : '';
		var category_and_sub = row.category ? row.category.split("|") : [condensed_labels_replacement,condensed_labels_replacement];
		var category = category_and_sub[0] ? '<div class="category"><span>Category:</span> '+category_and_sub[0].trim()+'</div>' : '';
		var subcategory = category_and_sub[1] ? '<div class="subcategory"><span>Subcategory:</span> '+category_and_sub[1].trim()+'</div>' : '';
		var note = row.notes ? '<div class="notes"><span>Notes:</span> '+row.notes.trim()+'</div>' : '';
		var popup_text = '<div class="popup-header">'+title+building+address+'</div>'+'<div class="popup-metadata">'+year+type+category+subcategory+note+'</div>';
		// address toast
		var street_address = (row.street && row.street_number) ? row.street_number.trim()+" "+row.street.trim() : false;
		var address_toast_info = row.building_name ? ( row.building_name.trim() + (street_address ? " ("+street_address+")" : '') ) : (street_address ? street_address : null);
					
		var marker = L.circleMarker([lat,lon],{
			address: address_toast_info,
			radius: 10,
			color: "#ffffff",
			opacity: 0.5,
			weight:6,
			fillColor: getMarkerColor(category_and_sub[0]),
			fillOpacity: 1,
			fill: true,
			title: convertHtmlToText(title),
			alt: convertHtmlToText(title),
			}).bindPopup(popup_text);
		
		group.push(marker);  
		markers.addLayer(marker);			
		
	});

	// cluster 
	map.addLayer(markers);
	
	// 
	markers.on('clusterclick', function (a) {
		a.layer.zoomToBounds({padding: [20, 20]});
	});		
	
	// respond to spidering
	markers.on("unspiderfied", function(e){
		// remove toast content
		d3.select('#toast-inner').html('');
		// remove class from map and child markers
		e.markers.forEach(function(marker){
			marker._path.classList.remove('active-marker');
		});	
		var el = document.getElementById(map_container);
		el.classList.remove("spiderfied");
	})
	markers.on("spiderfied", function(e){
		// add class to map and child markers
		e.markers.forEach(function(marker){
			marker._path.classList.add('active-marker');
		});	
		// add spiderfied class to map container		
		var el = document.getElementById(map_container);
		el.classList.add("spiderfied");
		// change rendered order to move active markers to front
		d3.selectAll('.spiderfied path.active-marker').moveToFront();
		// update toast
		var address_array = e.markers.map(m => m.options.address).filter((value, index, self) => self.indexOf(value) === index);
		var toast_content = address_array.length == 1 ? address_array[0] : address_array.length + " addresses";
		d3.select('#toast-inner').html(toast_content);			
		
	});
	// Fit map to markers (@TODO: ON INITIAL LOAD ONLY)
	map.fitBounds(markers.getBounds()); 
}

function colorRange(i){
	var c = d3.scaleLinear()
	.domain([0, 2, 4, 6, 8, 10, 12, 14])
	.range(['#f24a4a', '#f29b4a', '#f0c724', '#4dbb3a','#4b66d2', '#b96cda']);	
	return c(i);	
}

function getMarkerColor(category){
	var obj = label_colors.find( ({ name }) => name === category.trim() );
	var color = typeof obj !== 'undefined' ? obj.color : '#000000';
	return color;
}

function getYears(data){
	var years = data.map(row => row.year).filter((value, index, self) => self.indexOf(value) === index);
	return years;
}

function dataByYears(data){
	var sort_by_year = data.sort(function (a,b) {return d3.ascending(a.year, b.year); });
	byYears=[];
	getYears(sort_by_year).forEach(function(y,i){
		var yearfilter = sort_by_year.filter(obj => {
			return obj.year === y;
		});
		byYears[i]=yearfilter;
	});
	return byYears;		
}

function keyByYearValues(data){
	var getyears = getYears(data)
	var rekey = {};
	getyears.forEach(function(year){
		var yearfilter = data.filter(obj => {
			return obj.year === year;
		});
		rekey[year] = yearfilter;
	});
	return rekey;
}

function countByYear(data_keyed_by_year){
	yearcounts=[];
	for (var key in data_keyed_by_year) {
		yearcounts.push({"year": key, "count" : data_keyed_by_year[key].length});
	}
	return yearcounts;		
}

function getCategories(data){
	var cats = data.map(row => row.category).filter((value, index, self) => self.indexOf(value) === index);
	toplevel_cats=[];
	cats.forEach(function(cat){
		var c=cat.split("|");
		var category_label = c[0] ? c[0].trim() : 'OTHER';
		if(condensed_labels.includes(category_label)){
			category_label = condensed_labels_replacement;
		}
		if(toplevel_cats.indexOf(category_label) === -1) {
		    toplevel_cats.push(category_label);
		}		
		
	});
	// sort A-Z
	var cats = toplevel_cats.sort();
	// move "Other" (condensed categories) to last position
	cats.push(cats.splice(cats.indexOf(condensed_labels_replacement), 1)[0]);
	
	return cats;
}

function keyByCategoryValues(data){
	var getcategories = data.map(row => row.category).filter((value, index, self) => self.indexOf(value) === index);
	var rekey = {};
	getcategories.forEach(function(category){
		var categoryfilter = data.filter(obj => {
			return obj.category === category;
		});
		rekey[category] = categoryfilter;
	});
	return rekey;
}

function countByCategory(data_keyed_by_category){
	categorycounts=[];
	for (var key in data_keyed_by_category) {
		categorycounts.push({"category": key, "count" : data_keyed_by_category[key].length});
	}
	return categorycounts;		
}

// helper for title attributes with encoded HTML
function convertHtmlToText(value) {
    var d = document.createElement('div');
    d.innerHTML = value;
    return d.innerText;
}