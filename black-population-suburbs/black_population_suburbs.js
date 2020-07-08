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
	
	// @TODO: add column totals to table
	var table = document.querySelector('table tbody');
	console.log(table);
	column_totals.forEach(function(obj){
		var year = obj.year;
		var population_total_sum = obj.total;
		var population_black_sum = obj.black;
		var percent_sum = round( (obj.black/obj.total) *100, 2 ) +"%";
		var cell_data = '<div class="totals '+year+'">'+percent_sum + '<br><span class="fraction">' + population_black_sum + '/' + population_total_sum + '</span></div>';
		console.log(cell_data);
	})
	
	// highlight max values for each column
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

