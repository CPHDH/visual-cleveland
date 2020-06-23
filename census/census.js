// Data helpers
function trend(row){
	
	if(row.change_sum == 0){
		return 'neutral';	
	}else if(row.change_sum > 0){
		return 'positive';
	}else if(row.change_sum < 0){
		return 'negative';
	}else{
		return 'unknown';
	}
}

function diff(row){
	
	var p = row.previous;
	var c = row.population;	
	
	if(typeof p == 'object'){
		var chs = c-p.population;
		return chs;
			
	}
		
}

function percentage(row){
	
	var chs = row.change_sum;
	var p = row.previous;
	if(typeof p == 'object'){
		return Math.round( ( chs / p.population ) * 100 );
	}
		
}

function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

function addCalculatedRows(rows){

	rows.forEach(function(row,i){
		
		// get previous row object (this is definitely not recommended for large data sets!)
		row.previous = (typeof rows[i-1]=='object') ? rows[i-1] : 'No previous data is available'; 
		
		// calculate numeric change
		row.change_sum = (typeof diff( row )=='number') ? diff( row ) : 0; 
		
		// calculate percentage change
		row.change_percent = (typeof percentage( row )== 'number') ? percentage( row ) : 0; 
		
		// is change positive, negative or neutral?
		row.change_trend = trend( row ); 
				
	});	
	
	return rows;
	
}

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// D3 get data
function getCsvData(file){
	d3.csv(file,function(d){
		var d = addCalculatedRows( d );
		return d;
	});		
}

// D3 Chart
function doBarChart(csv,container,span){	
	
	var margin = {top: 40, right: 10, bottom: 30, left: 50},
	    height = 400 - margin.top - margin.bottom,
	    width = parseInt(d3.select(container).style('width'), 10),
	    width = width - margin.left - margin.right
	    	
	var xScale = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .075)
	
	var yScale = d3.scale.linear()
	    .range([height, 0])
	
	var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom")
	
	var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left")
	
	addUISliderDiv(container);
			
	var chart = d3.select(container).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr('preserveAspectRatio','xMinYMin')
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	
	d3.csv(csv,function(d){
		
		var data=addCalculatedRows( d )
		
		doUIDateSlider(csv,container,span,data);
		
		// use default date range
		data=data.filter(function(e){
			return (e.year >= span[0]) && (e.year <= span[1]) 
		});

		var colors=d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return +d.population; })])
			.range(['#ffb832','#c61c6f']); 

	    		
	    xScale.domain(data.map(function(d) { return d.year; }));
		yScale.domain([0, d3.max(data, function(d) { return +d.population; })])

		var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-3, 0])
		  .html(function(d) {
			 var trend='';
			 switch(d.change_trend){
				 case 'positive':
				 trend="<span class='fa fa-arrow-up'></span>";
				 break;
				 case 'negative':
				 trend="<span class='fa fa-arrow-down'></span>";
				 break;
				 case 'neutral':
				 trend="<span class='fa fa-circle'></span>";
				 break;				 				 
			 }
			
		    return "<span class='tooltip'><strong>"+d.year+" Census: </strong>" + addCommas(+d.population) + "<br>"+trend+" <strong>Change: </strong>"+addCommas(+d.change_sum)+" ("+d.change_percent+"%)</span>";
		  })
		
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
					
		chart.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Population")
		
		var bars = chart.append("g")
			.attr("class","bar-data")	
			.selectAll(".bar")	
			.data(data)
			.enter()
			.append("rect")
			  .attr("fill", function(d,i){return colors(+d.population)})
			  .attr("class", function(d) { return +d.change_sum < 0 ? "bar negative" : "bar positive"; })
			  .attr("x", function(d) { return xScale(d.year); })
			  .attr("width", xScale.rangeBand())
			  .attr("y", height )
			  .attr("height", 0)
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide)	
			  .transition()
				  .attr("height", function(d) { return height - yScale(+d.population); })
				  .attr("y", function(d) { return yScale(+d.population); })
		    	  .duration(500)
				  .delay(100) 
			  
	    chart.call(tip)
	      	  
	});
}

function doDivergingChart(csv,container,span){	

	var margin = {top: 40, right: 50, bottom: 30, left: 50},
	    height = 500 - margin.top - margin.bottom,
	    width = parseInt(d3.select(container).style('width'), 10),
	    width = width - margin.left - margin.right
	
	var x = d3.scale.linear()
	    .range([0, width])
	
	var y = d3.scale.ordinal()
	    .rangeRoundBands([0, height], .075);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("top");
	
	addUISliderDiv(container);    
	
	var chart = d3.select(container).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
	
	d3.csv(csv,function(data){
		
		var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-3, 0])
		  .html(function(d) {
			 var trend='';
			 switch(d.change_trend){
				 case 'positive':
				 trend="<span class='fa fa-arrow-up'></span>";
				 break;
				 case 'negative':
				 trend="<span class='fa fa-arrow-down'></span>";
				 break;
				 case 'neutral':
				 trend="<span class='fa fa-circle'></span>";
				 break;				 				 
			 }
		    return "<span class='tooltip'><strong>"+d.year+" Census: </strong>" + addCommas(+d.population) + "<br>"+trend+" <strong>Change: </strong>"+addCommas(+d.change_sum)+" ("+d.change_percent+"%)</span>";
		  })	
		  	
		var data=addCalculatedRows( data )
		
		data.shift(); // remove first census year since there will be no change to display

		doUIDateSlider(csv,container,span,data);

		data=data.filter(function(e){
			return (e.year >= span[0]) && (e.year <= span[1]) 
		});


		var colors=d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return +d.population; })])
			.range(['#ffb832','#c61c6f']); 
				
		x.domain(d3.extent(data, function(d) { return +d.change_sum; }));
		y.domain(data.map(function(d) { return d.year; }));
		
		var bars = chart.selectAll(".bar")
		  .data(data)
		  .enter()
		  .append("rect")
			  .attr("fill", function(d,i){return colors(+d.population)})
			  .attr("class", function(d) { return +d.change_sum < 0 ? "bar negative" : "bar positive"; })
			  .attr("y", function(d) { return y(d.year); })
			  .attr("x", function(d) { return x(0); })
			  .attr("width", 0)
			  .attr("height", y.rangeBand())
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide)	
			  .transition()
			  	  .attr("x", function(d) { return x(Math.min(0, +d.change_sum)); })
			  	  .attr("width", function(d) { return Math.abs(x( +d.change_sum) - x(0)); })
		    	  .duration(500)
				  .delay(100)  

		var labels = chart.selectAll(".label")
		  .data(data)
		  .enter()
		  .append("text")
		  	.text(function(d){return d.year})
		  	.attr("class", function(d) { return +d.change_sum < 0 ? "label negative" : "label positive"; })
		  	.attr("height", y.rangeBand())
		  	.attr("y", function(d) { return (y(d.year)+(y.rangeBand()*.66)); })
			.attr("x", function(d) { var neg=(x(0)+5); var pos=(x(0)-30); return +d.change_sum < 0 ? neg : pos; })
			    			  		
		chart.append("g")
		  .attr("class", "x axis")
		  .call(xAxis)
		.append("line")
		  .attr("x1", y(0))
		  .attr("y2", y(0))
		  .attr("x2", width)	 
		  		
		chart.append("g")
		  .attr("class", "y axis")
		.append("line")
		  .attr("x1", x(0))
		  .attr("x2", x(0))
		  .attr("y2", height);
		  
		chart.call(tip)
		  	  
	});
	
}


function doPieChart(csv,container,as_percentages){	
	
	addUISliderDiv(container);
	
	d3.csv(csv,function(d){
		
		var data=addCalculatedRows( d )
		
		// -1 accounts for year zero, which is neutral by default
		var total=-1, neutral=-1, positive=0, negative=0;
		
		data.forEach(function(val,i){
			switch(val.change_trend){
				case 'neutral':
				total++; 
				neutral++;
				break;
				case 'positive':
				total++;
				positive++;
				break;
				case 'negative':
				total++;
				negative++;
				break;				
			}
		});
		
		if(as_percentages==true){
			neutral =round((neutral/total)*100,3); 
			positive=round((positive/total)*100,3);
			negative=round((negative/total)*100,3);
		}
		
		var maxw=400;
			width = parseInt(d3.select(container).style('width'), 10);	
			width = (width<=maxw) ? width : maxw;
			height=width;	

		var r = width/2;
		var color = d3.scale.ordinal()
		    .range(["#ccc","#c61c6f",'#ffb832']);
		console.log(color);
		
		var data = [{"label":"Nuetral", "value":neutral}, 
				          {"label":"Positive Growth ("+positive+")", "value":positive}, 
				          {"label":"Negative Growth ("+negative+")", "value":negative}];
		
		var vis = d3.select(container).append("svg:svg").data([data]).attr("width", width).attr("height", height).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
		var pie = d3.layout.pie().value(function(d){return d.value;});
		
		// declare an arc generator function
		var arc = d3.svg.arc().outerRadius(r);
		
		
		// select paths, use arc generator to draw
		var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
		arcs.append("svg:path")
		    .attr("fill", function(d, i){
		        return color(i);
		    })
		    .attr("d", function (d) {
		        return arc(d);
		    })
		
		// add the text
		arcs.append("svg:text").attr("transform", function(d){
					d.innerRadius = 0;
					d.outerRadius = r;
					return "translate(" + arc.centroid(d) + ")";
		    	})
				.attr("text-anchor", "middle").text( 
		    		function(d, i) {
						return data[i].label;}
					);
	      	  
	});
}

// D3 Table
function doTable(csv, container, columns) {
	
	d3.csv(csv,function(d){
		
		var data=addCalculatedRows( d )
		
		var table = d3.select(container).append("table"),
		    thead = table.append("thead"),
		    tbody = table.append("tbody");
		
		thead.append("tr")
		    .selectAll("th")
		    .data(columns)
		    .enter()
		    .append("th")
		        .text(function(column) { 
			        return column.replace("_"," "); 
			    })
		        .style("text-transform","capitalize");
		
		var rows = tbody.selectAll("tr")
		    .data(data)
		    .enter()
		    .append("tr");
		
		var cells = rows.selectAll("td")
		    .data(function(row) {
		        return columns.map(function(column) {
		            return {column: column, value: row[column]};
		        });
		    })
		    .enter()
		    .append("td")
		    .attr("style", "font-family: monospace") // sets the font style
		        .html(function(d) { return d.value; });
				
		return table;
		
	});
}

// D3 Line Chart


function doLineChart(csv, container, span){
	
	addUISliderDiv(container);
	
	var margin = {top: 40, right: 10, bottom: 30, left: 50},
	    height = 400 - margin.top - margin.bottom,
	    width = parseInt(d3.select(container).style('width'), 10),
	    width = width - margin.left - margin.right

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1)
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
		.interpolate("linear")
	    .x(function(d) { return x(+d.year); })
	    .y(function(d) { return y(+d.population); });
	
	var svg = d3.select(container).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(csv,function(d) {
	
		var data=addCalculatedRows( d )

		doUIDateSlider(csv,container,span,data);

		data=data.filter(function(e){
			return (e.year >= span[0]) && (e.year <= span[1]) 
		});
		
		x.domain(data.map(function(d) { return d.year; }));
		y.domain(d3.extent(data, function(d) { return +d.population; }));
		
		
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);
		
		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Population");
		
		var path = svg.append("path")
		  .datum(data)
		  .attr("class", "line")
		  .attr("d", line)		
		  
		var totalLength = path.node().getTotalLength();  
	    
	    path.attr("stroke-dasharray", totalLength + " " + totalLength)
	      .attr("stroke-dashoffset", totalLength)
	      .attr("stroke","#c61c6f")
	      .transition()
	        .duration(1000)
	        .ease("linear")
	        .attr("stroke-dashoffset", 0);

	});	
	
}

// jquery ui
function addUISliderDiv(container){
	var date_slider=d3.select(container).append('div').attr('id','slider')
		date_slider.insert('input').attr('id','start').attr('disabled','disabled')
		date_slider.append('input').attr('id','end').attr('disabled','disabled')	
		return date_slider;
}

function doUIDateSlider(csv,container,span,data){
	$(function() {
		$( "#slider" ).slider({
			range: true,
			min: d3.min(data, function(d) { return +d.year; }),
			max: d3.max(data, function(d) { return +d.year; }),
			step:10,
			stop: function( event, ui ) {
				    var value = ui.value;               
				    updateSpan(csv,container,span);
				},
			values: span,
			slide: function( event, ui ) {
				$("input#start").val(ui.values[ 0 ]);
				$("input#end").val(ui.values[ 1 ]);
				span=[ui.values[ 0 ],ui.values[ 1 ]];		
			}
		});
		$("input#start").val(span[ 0 ]);
		$("input#end").val(span[ 1 ]);
	});	
}

function updateSpan(csv,container,span){
		$(container).html('');
		
		var isBarChart=$( 'a#bar-chart' ).hasClass( 'active' );
		var isLineChart=$( 'a#line-chart' ).hasClass( 'active' );
		var isDivergingChart=$( 'a#diverging-chart' ).hasClass( 'active' );
		
		if(isBarChart){
			doBarChart(csv,container,span);
		}else if(isLineChart){
			doLineChart(csv,container,span);
		}else if(isDivergingChart){
			doDivergingChart(csv,container,span);
		}else{
			alert("error");
		}
		
}


// document
document.addEventListener("DOMContentLoaded", function(event) { 
	
	// default variables
	var csv="data.csv";
	var container="#data-visualization-container";
	var span=[1900,2010];
			
	// create the default bar chart	
	doBarChart(csv,container,span);
	$('#bar-chart').addClass('active');
	
	// create click events to load each data chart
	$('figure#interactive nav a').click(function(){
		var id=$(this).attr('id');
		$(container).html('').append(function(){
			$('nav a').removeClass('active');
			$('#'+id).addClass('active');
			switch(id){
				case 'bar-chart':
				doBarChart(csv,container,span);
				break;
				case 'line-chart':
				doLineChart(csv,container,span);
				break;
				case 'pie-chart':
				doPieChart(csv,container,false);
				break;
				case 'diverging-chart':
				doDivergingChart(csv,container,span);
				break;				
				case 'data-table':
				doTable(csv,container,["year","population","change_sum","change_percent","change_trend"]);
				break;
			}
		});
		return false;
	});

});	