// Configured variables ===================================

var csv="euclid_geocoded_mod.csv";
var map_container="map-canvas";
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
	
	d3.csv(csv,function(data){
		// first, sort by category, so that clusters spider nice
		var sorted_by_category = data.sort(function (a,b) {return d3.ascending(a.category, b.category); });
		// put sorted data into year-based arrays
		var data_by_years=dataByYears(sorted_by_category);
		// get a simple array of years to use as keys
		var years=getYears(data);

		var legend_labels = getCategories(data);
 			
		// populate legend
		d3.select('#legend').append("ul").html(function(){
			var html='';
			legend_labels.forEach(function(label){
				html += '<li><div class="color" style="background-color:'+getMarkerColor(label)+'"></div><div class="label">'+label.toLowerCase()+'</div></li>';
			})
			return html;
		});		
		
		var map = L.map(map_container,{
			scrollWheelZoom: false,
			center:default_coords,
			zoom:default_zoom
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
		console.log("loading data for "+years[0]+"...");							
		data_by_years[0].forEach(function(row,i){
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
			
			
		})        
		// Fit map to markers			        
        map.fitBounds(markers.getBounds()); 		
		
	});
		
});	
	
// Functions ==============================================
function colorRange(i){
	var c = d3.scale.linear()
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
	return data.map(row => row.year).filter((value, index, self) => self.indexOf(value) === index);
}

function dataByYears(data){
	byYears=[];
	getYears(data).forEach(function(y,i){
		var yearfilter = data.filter(obj => {
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
