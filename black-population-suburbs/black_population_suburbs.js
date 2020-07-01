// Variables
var suburbs_csv="black_population_suburbs.csv"; // required columns: City, _1950, _1960, _1970, etc (note underscore in front of each year)
var city_csv="../census/data.csv"; // required columns: year, population
var container="#data-visualization-container";
var years_covered = ['1950','1960','1970','1980','1990','2000','2010']; // years that appear in both city and suburban data sets
var city_name ="Cleveland";

// Implementation
document.addEventListener("DOMContentLoaded", function(event) { 

	var city_data=[];
	d3.csv(city_csv,function(data){
		data.forEach(function(row){
			if(years_covered.includes(row.year)){
				city_data.push(row);
			}
		});
	});	

	d3.csv(suburbs_csv,function(data){
		var suburbs_list = getMunicipalities(data);
		var suburbs_data = prepareData(data,years_covered);
		addUIEvents(suburbs_data, container, years_covered);	
	});	
	
	
});

// Helpers
function addUIEvents(suburbs_data, container, years_covered){
	const uiButtons = document.querySelectorAll("figure#interactive nav a");
	for (let i = 0; i < uiButtons.length; i++) {
		uiButtons[i].addEventListener("click", function(e) {
			e.preventDefault();

			[].forEach.call(uiButtons, function(el) {
			  el.classList.remove("active");
			});
			uiButtons[i].classList.add("active");
			
			var action = uiButtons[i].id;
			if(action === 'data-table') doDataTable(suburbs_data, container, years_covered);
			if(action === 'line-chart') doLineChart(suburbs_data, container);
			if(action === 'bar-chart') doBarChart(suburbs_data, container);
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
			var y = '_'+y;
			let value = row[y].split("/");
			let black = value[0] ? Number(value[0]) : null;
			let total = value[1] ? Number(value[1]) : null;
			let percentage = (black !== null && total !== null) ? black/total : null;
			row[y] = {
				"population_black": black,
				"population_total": total,
				"percentage_black": percentage !== null ? round((percentage)*100,2) : '--'
			}	
						
		});
		calculated.push(row)
	});
	return calculated;
}
function doLineChart(data, container){
	d3.select(container).html(''); // clear container
}

function doBarChart(data, container){
	d3.select(container).html(''); // clear container
}	

function doDataTable(data, container, years_covered){
	var c = years_covered.map(e => '_' + e);
	c.unshift("City");
	var columns = c;
	
	// @TODO
	var column_totals = years_covered.map(function(y){
		return {
			'year':'_'+y,
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
	        return columns.map(function(column) {
		        if(typeof row[column] === 'object'){
			        var b = row[column].population_black !== null ? row[column].population_black : "unknown";
			        var t = row[column].population_total !== null ? row[column].population_total : "unknown"
			        v = row[column].percentage_black + "%" + "<br><span>" + b + "/" + t + "</span>";
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
	
	return table;
	
}