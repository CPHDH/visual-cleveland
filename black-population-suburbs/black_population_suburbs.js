// Configurations
var suburbs_csv="black_population_suburbs.csv"; // required columns: City, _1950, _1960, _1970, etc (note underscore in front of each year)
var comparison_csv="black-population-city-v-suburbs.csv"; // required columns: same as above; first row is city, second row is suburbs (sum)
var container1="#data-visualization-container";
var container2="#data-visualization-container-2";
var years_covered = ['1950','1960','1970','1980','1990','2000','2010']; // years that appear in both city and suburban data sets
var city_name = "Cleveland";

// Implementation
document.addEventListener("DOMContentLoaded", function(event) { 
		
	// first container: line chart (comparison_csv)
	doLineChart(container1,comparison_csv);
		
	d3.csv(suburbs_csv,function(data){
		var suburbs_data = prepareData(data,years_covered);
		
		// second container: data tables (suburbs_csv, comparison_csv)
		doDataTable(suburbs_data,container2,years_covered);
		
		addTableUIEvents(suburbs_data,container2,years_covered);	
	});
	
});

// LINE CHART
function doLineChart(container, comparison_csv, includeTotalPopulations = false, includeCityPopulations = true){
	d3.select(container).html(''); // clear container
	
	d3.csv(comparison_csv,function(data){		

		/*
		****************
		Prepare the data
		****************	
		*/	
			
		comparison_data = prepareData(data,years_covered);
		
		// city data
		var city_data = comparison_data[0];
		var city_population_black = getObjectValuesBlack(city_data);
		var city_population_total = getObjectValuesTotal(city_data);
		var city_years = getObjectValuesYear(city_data);
		var city_data_charting = cityChartingData(city_years,city_population_total,city_population_black);
		// suburbs data
		var suburbs_data = comparison_data[1];
		var suburbs_population_black = getObjectValuesBlack(suburbs_data);
		var suburbs_population_total = getObjectValuesTotal(suburbs_data);
		var suburbs_years = getObjectValuesYear(suburbs_data);
		var suburbs_data_charting = cityChartingData(suburbs_years,suburbs_population_total,suburbs_population_black);

		/*
		**********************
		Set up the chart scale
		**********************	
		*/
	    	
		// D3 margin convention  
		var margin = {top: 20, right: 110, bottom: 30, left: 60},
		    height = 500 - margin.top - margin.bottom,
		    width = parseInt(d3.select(container).style('width'), 10),
		    width = width - margin.left - margin.right
		
		// X scale uses the (min/max) years of our city data
		var xScale = d3.scaleLinear()
		    .domain([d3.min(city_years), d3.max(city_years)]) 
		    .range([10, width-10]);
		
		// Y scale uses 0 (min) and the suburbs total population (max) OR city/suburban black population, depending on options
		var maxScale = includeTotalPopulations ? d3.max(suburbs_population_total) : includeCityPopulations ? d3.max(city_population_black) : d3.max(suburbs_population_black);
		var yScale = d3.scaleLinear()
		    .domain([0, maxScale]) 
		    .range([height, 0]);  
		    				
		// Add the SVG to the container
		var svg = d3.select(container).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
			.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// Append the x axis
		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(d3.axisBottom(xScale)
		    	.ticks(city_years.length) // don't add interval years to the range; just use the available years
		    	.tickFormat(d3.format("Y"))); // no commas; format as years
		
		// Append the y axis
		svg.append("g")
		    .attr("class", "y axis")
		    .call(d3.axisLeft(yScale)); 
		    
		/*
		******************
		Add the data lines
		******************
		*/
		
		// Line generators
		var lineGeneratorTotal = d3.line()
		    .x(function(d) { return xScale(d.year); })
		    .y(function(d) { return yScale(d.total); });

		var lineGeneratorBlack = d3.line()
		    .x(function(d) { return xScale(d.year); })
		    .y(function(d) { return yScale(d.black); });
		
		// City Data (dashed lines)
		if(includeCityPopulations){
			
			// visible (dashed) line
			var cityblack = svg.append("path")
				.datum(city_data_charting)
				.attr("class", "line-black city")
				.attr("d", lineGeneratorBlack)
				.attr("stroke-dasharray", "3 3")
							
				// duplicate (line mask)
				var cityblack_mask = svg.append("path")
				.datum(city_data_charting)
				.attr("class", "line-mask city")
				.attr("d", lineGeneratorBlack)
				
				// reverse animate the solid line on top of the dashed line to simulate dash animation
				cityblack_mask.attr("stroke-dasharray",cityblack_mask.node().getTotalLength() + " " + cityblack_mask.node().getTotalLength())
				.attr("stroke-dashoffset", 0)
				.transition()
				.duration(1000)
				.ease(d3.easeLinear)
				.attr("stroke-dashoffset", "-"+cityblack_mask.node().getTotalLength())
				
				
			  
			if(includeTotalPopulations){
				
				// visible (dashed) line
				var citytotal = svg.append("path")
					.datum(city_data_charting)
					.attr("class", "line-total city")
					.attr("d", lineGeneratorTotal)
					.attr("stroke-dasharray", "3 3")
				  
					// duplicate (line mask)
					var citytotal_mask = svg.append("path")
					.datum(city_data_charting)
					.attr("class", "line-mask city")
					.attr("d", lineGeneratorTotal)
					
					// reverse animate the solid line on top of the dashed line to simulate dash animation
					citytotal_mask.attr("stroke-dasharray",citytotal_mask.node().getTotalLength() + " " + citytotal_mask.node().getTotalLength())
					.attr("stroke-dashoffset", 0)
					.transition()
					.duration(1000)
					.ease(d3.easeLinear)
					.attr("stroke-dashoffset", "-"+citytotal_mask.node().getTotalLength())
					
			}			
		}
		
		// Suburbs Data (solid lines)
		var suburbsblack = svg.append("path")
		  .datum(suburbs_data_charting)
		  .attr("class", "line-black suburbs")
		  .attr("d", lineGeneratorBlack)
	  
		  // animate
		  suburbsblack.attr("stroke-dasharray",suburbsblack.node().getTotalLength() + " " + suburbsblack.node().getTotalLength())
			.attr("stroke-dashoffset", suburbsblack.node().getTotalLength())
	    	.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.attr("stroke-dashoffset", 0)
						  	
		if(includeTotalPopulations){
			var suburbstotal = svg.append("path")
			  .datum(suburbs_data_charting)
			  .attr("class", "line-total suburbs")
			  .attr("d", lineGeneratorTotal)
			  // animate
			  suburbstotal.attr("stroke-dasharray",suburbstotal.node().getTotalLength() + " " + suburbstotal.node().getTotalLength())
				.attr("stroke-dashoffset", suburbstotal.node().getTotalLength())
		    	.transition()
				.duration(1000)
				.ease(d3.easeLinear)
				.attr("stroke-dashoffset", 0)	  			
		}

		/*
		**************
		Add the labels
		**************
		*/
		var textOffsetX = (coords) => {return coords+5}
		var textOffsetY = (coords) => {return coords+5}
		
		var suburbs_total_coords = suburbstotal ? [suburbstotal._groups[0][0].pathSegList[years_covered.length-1].x,suburbstotal._groups[0][0].pathSegList[years_covered.length-1].y] : null
		if(suburbs_total_coords){
			svg.append("text")
			    .attr("x", textOffsetX(suburbs_total_coords[0]))
			    .attr("y", textOffsetY(suburbs_total_coords[1]))
			    .attr("class", "line-label")
			    .text('Suburbs (Total)')
			    .attr("opacity",0)
			    .transition()
			    .duration(1500)
				.ease(d3.easeCubicIn)
				.attr("opacity", 1)			    
		}
		
		var city_total_coords = citytotal ? [citytotal._groups[0][0].pathSegList[years_covered.length-1].x,citytotal._groups[0][0].pathSegList[years_covered.length-1].y] : null
		if(city_total_coords){
		    svg.append("text")
			    .attr("x", textOffsetX(city_total_coords[0]))
			    .attr("y", textOffsetY(city_total_coords[1]))
			    .attr("class", "line-label")
			    .text(city_name + ' (Total)')	
			    .attr("opacity",0)
			    .transition()
			    .duration(1500)
				.ease(d3.easeCubicIn)
				.attr("opacity", 1)				    		
		}
		
		var suburbs_black_coords = suburbsblack ? [suburbsblack._groups[0][0].pathSegList[years_covered.length-1].x,suburbsblack._groups[0][0].pathSegList[years_covered.length-1].y] : null
		if(suburbs_black_coords){
			svg.append("text")
			    .attr("x", textOffsetX(suburbs_black_coords[0]))
			    .attr("y", textOffsetY(suburbs_black_coords[1]))
			    .attr("class", "line-label black")
			    .text('Suburbs (Black)')	
			    .attr("opacity",0)
			    .transition()
			    .duration(1500)
				.ease(d3.easeCubicIn)
				.attr("opacity", 1)				    		
		}
		
		var city_black_coords = cityblack ? [cityblack._groups[0][0].pathSegList[years_covered.length-1].x,cityblack._groups[0][0].pathSegList[years_covered.length-1].y] : null
		if(city_black_coords){
			svg.append("text")
			    .attr("x", textOffsetX(city_black_coords[0]))
			    .attr("y", textOffsetY(city_black_coords[1]))
			    .attr("class", "line-label black")
			    .text(city_name + ' (Black)')	
			    .attr("opacity",0)
			    .transition()
			    .duration(1500)
				.ease(d3.easeCubicIn)
				.attr("opacity", 1)				    	
		}

		/*
		****************
		Add the tooltips
		****************
		*/
		
		
		
		// @TODO!
				
		
		/*
		****************
		Add the controls
		****************
		*/
		
		// totals controls
		var ui_totals = document.createElement("input");
			ui_totals.setAttribute('type', 'checkbox');
			ui_totals.setAttribute('name', 'includeTotals');
			ui_totals.setAttribute('id', 'includeTotals');
			ui_totals.setAttribute('value', 1);
			if(includeTotalPopulations) ui_totals.setAttribute('checked', 1);
			ui_totals.onchange = function(e){
				includeTotalPopulations = e.target.checked
				// reload the chart
				doLineChart(container, comparison_csv, includeTotalPopulations, includeCityPopulations)
			}
			var ui_totals_label = document.createElement("label");
				ui_totals_label.setAttribute('for', 'includeTotals');
				ui_totals_label.innerHTML ='Include Total (Black and Non-Black) Populations for Selected View <span></span><span></span>';
			var ui_totals_container = document.createElement('div');
				ui_totals_container.appendChild(ui_totals);
				ui_totals_container.appendChild(ui_totals_label);
				
		// city controls
		var ui_city = document.createElement("input");
			ui_city.setAttribute('type', 'checkbox');
			ui_city.setAttribute('name', 'includeCity');
			ui_city.setAttribute('id', 'includeCity');
			ui_city.setAttribute('value', 1);
			if(includeCityPopulations) ui_city.setAttribute('checked', 1);
			ui_city.onchange = function(e){
				includeCityPopulations = e.target.checked
				// reload the chart
				doLineChart(container, comparison_csv, includeTotalPopulations, includeCityPopulations)
			}
			var ui_city_label = document.createElement("label");
				ui_city_label.setAttribute('for', 'includeCity');
				ui_city_label.innerHTML ='Include '+city_name+' (Non-Suburban) Black Population <span></span>';	
			var ui_city_container = document.createElement('div');
				ui_city_container.appendChild(ui_city);
				ui_city_container.appendChild(ui_city_label);			
		
		// container div
		var toggles = document.createElement('div');
			toggles.setAttribute('id', 'toggles');
			toggles.appendChild(ui_city_container);
			toggles.appendChild(ui_totals_container);
		
		// output
		document.querySelector(container).appendChild(toggles)

	});	
	
}

// DATA TABLE
function doDataTable(data, container, years_covered, summaryLabel="Total for all suburbs", highlights=true){
	var c = years_covered.map(e => '_' + e);
	c.unshift("City");
	var columns = c;
	
	// track column totals using this object
	var column_totals = years_covered.map(function(y){
		return {
			'year':y,
			'total':0,
			'black':0
		}
	});

	d3.select(container).html(''); // clear container
	var table = d3.select(container).append("table"),
	    thead = table.append("thead"),
	    tbody = table.append("tbody");
	
	thead.append("tr")
	    .selectAll("th")
	    .data(columns)
	    .enter()
	    .append("th")
	        .text(function(column) { 
		        return column.replace("_",""); 
		    })
	        .style("text-transform","capitalize");
	
	var rows = tbody.selectAll("tr")
	    .data(data)
	    .enter()
	    .append("tr");
	
	var cells = rows.selectAll("td")
	    .data(function(row) {
	        return columns.map(function(column,i) {
		        if(typeof row[column] === 'object'){
			        var total_position = i-1;		        
			        var b = row[column].population_black !== null ? row[column].population_black : "no data";
			        var t = row[column].population_total !== null ? row[column].population_total : "no data";
			        var b_int = row[column].population_black !== null ? row[column].population_black : 0;
			        var t_int = row[column].population_total !== null ? row[column].population_total : 0;
			        var p_num = row[column].percentage_black !== '--' ? row[column].percentage_black : 0;
			        v = '<div class="'+column+'" data-percent="'+p_num+'" data-black="'+b_int+'">'+row[column].percentage_black + '%' + '<br><span class="fraction" >' + (b !== t ? b + '/' + t : b) + '</span></div>';
			        
			        // update column totals
			        column_totals[total_position].total = column_totals[total_position].total + t_int;
			        column_totals[total_position].black = column_totals[total_position].black + b_int;
			        
		        }else{
			        v  = "<strong>"+row[column]+"</strong>";
		        }
	            return {
		            column: column, 
		            value: v
		         };
	        });
	    })
	    .enter()
	    .append("td")
	    .attr("style", "font-family: monospace") // sets the font style
	        .html(function(d) { return d.value; });
	
	// add column totals to table
	var cell_data ='<td><strong>'+summaryLabel+'</strong></td>';
	column_totals.forEach(function(obj){
		var year = obj.year;
		var population_total_sum = obj.total;
		var population_black_sum = obj.black;
		var percent_sum = round( (obj.black/obj.total) *100, 2 ) +"%";
		cell_data += '<td><div class="totals '+year+'">'+percent_sum + '<br><span class="fraction">' + population_black_sum + '/' + population_total_sum + '</span></div></td>';
		
	});
	var sum_row = document.createElement("tr");
	sum_row.classList.add('totals');
	sum_row.innerHTML=cell_data;
	document.querySelector("table tbody").appendChild(sum_row); 
	
	// highlight max values for each column
	if(highlights){
		years_covered.forEach(function(y){
			let black_max = 0;
			let percent_max = 0;
			let cells = document.querySelectorAll('table div._'+y);
			cells.forEach(function(cell,i){
				if(Number(cell.dataset.black) >= black_max){
					black_max = Number(cell.dataset.black);
				};
				if(Number(cell.dataset.percent) >= percent_max){
					percent_max = Number(cell.dataset.percent);
				};				
			});
			
			let pm = document.querySelector('table div._'+y+'[data-percent="'+percent_max+'"]');
			pm.classList.add('max-percent');
			pm.setAttribute('data-title',"Highest percentage, "+y);
	
			let bm = document.querySelector('table div._'+y+'[data-black="'+black_max+'"]');
			bm.classList.add('max-black');
			if(bm.classList.contains('max-percent')){
				bm.setAttribute('data-title',"Highest percentage & largest black population, "+y);
			}else{
				bm.setAttribute('data-title',"Largest black population, "+y);
			}			
			
		});			
	}
	
}

// HELPERS
function addTableUIEvents(suburbs_data, container, years_covered){
	const uiButtons = document.querySelectorAll("figure#interactive nav a");
	for (let i = 0; i < uiButtons.length; i++) {
		uiButtons[i].addEventListener("click", function(e) {
			e.preventDefault();

			[].forEach.call(uiButtons, function(el) {
			  el.classList.remove("active");
			});
			uiButtons[i].classList.add("active");
			
			var action = uiButtons[i].id;
			if(action === 'data-table-suburbs'){
				doDataTable(suburbs_data, container, years_covered);
			} 
			if(action === 'data-table-county'){
				d3.csv(comparison_csv,function(data){
					var county_data = prepareData(data,years_covered);				
					doDataTable(county_data, container, years_covered, "Total for Cuyahoga County",false);
				});
			}
		});
	}	
}

function getMunicipalities(data){
	var sorted= data.sort(function (a,b) {return d3.ascending(a.City, b.City); });
	var municipalities = sorted.map(row => row.City.trim()).filter((value, index, self) => self.indexOf(value) === index);
	return municipalities;
}

function getDataForMunicipality(data,city_name){
	let d = data.filter(function (row) {
	    return row.City.trim() === city_name.trim();
	});	
	return d[0];
}

function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

function prepareData(data,years_covered){
	var calculated = [];
	data.forEach(function(row){
		years_covered.forEach(function(y){
			var year = y;
			var y = '_'+year;
			let value = row[y].split("/");
			let black = value[0] ? Number(value[0]) : null;
			let total = value[1] ? Number(value[1]) : null;
			let percentage = (black !== null && total !== null) ? black/total : null;
			row[y] = {
				"year": year,
				"population_black": black,
				"population_total": total,
				"percentage_black": percentage !== null ? round((percentage)*100,2) : '--'
			}	
						
		});
		calculated.push(row)
	});
	return calculated;
}

function cityChartingData(years,total,black){
	var obj = new Object;
	obj = years.map((v, i) => {
		return {
			year:Number(v),
			total:total[i],
			black:black[i]
		}
	});
	return obj;
}

function getObjectValuesYear(data){
	return Object.keys(data).map(function(key) {
		return data[key].year;

	}).filter(function(value){
		return value != null;
	});	
}

function getObjectValuesBlack(data){
	return Object.keys(data).map(function(key) {
		return data[key].population_black;

	}).filter(function(v){
		return v != null;
	});	
}

function getObjectValuesTotal(data){
	return Object.keys(data).map(function(key) {
		return data[key].population_total;

	}).filter(function(v){
		return v != null;
	});	
}