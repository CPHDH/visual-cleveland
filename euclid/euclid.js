// Configured variables ===================================

var csv = "euclid.csv";
var map_container = "map-canvas";
var chart_container = "#chart-canvas-inner";
var browse_container = "#browse-canvas-inner";
var dispatchChart = true;
var dispatchMap = true;
var zoomToBounds = true;
var currentFilter = false;
var currentYearIndex = 0;
var map = null;
var default_coords = [41.499685, -81.690637];
var default_zoom = 12;
var condensed_labels = [
  "BUILDING DETAIL",
  "UNKNOWN",
  "UNKNOWN OR OTHER",
  "BUILDING AMENITY",
  "PARKING",
  "UTILITIES",
];
var condensed_labels_replacement = "OTHER"; // condensed & unconfigured categories always appear as black (#000000)
var label_colors = [
  {
    name: "CLUBS AND ORGANIZATIONS",
    color: colorRange(0),
  },
  {
    name: "ENTERTAINMENT",
    color: colorRange(1.5),
  },
  {
    name: "FINANCE, INSURANCE, AND REAL ESTATE",
    color: colorRange(3),
  },
  {
    name: "FOOD SERVICES AND DRINKING PLACES",
    color: colorRange(4.5),
  },
  {
    name: "HOTELS AND MOTELS",
    color: colorRange(5.25),
  },
  {
    name: "INSTITUTION",
    color: colorRange(6),
  },
  {
    name: "MANUFACTURER",
    color: colorRange(7),
  },
  {
    name: "MUSEUMS AND GALLERIES",
    color: colorRange(7.75),
  },
  {
    name: "PROFESSIONAL",
    color: colorRange(8.75),
  },
  {
    name: "RETAIL",
    color: colorRange(10),
  },
  {
    name: "SERVICE",
    color: colorRange(12),
  },
  {
    name: "VACANT",
    color: "#777777",
  },
];

// D3 Extensions ==========================================

d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function () {
  return this.each(function () {
    var firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};

// jQuery Extensions ======================================

$.extend($.expr[":"], {
  containsi: function (elem, i, match, array) {
    return (
      (elem.textContent || elem.innerText || "")
        .toLowerCase()
        .indexOf((match[3] || "").toLowerCase()) >= 0
    );
  },
});

// Implementation =========================================

document.addEventListener("DOMContentLoaded", function (event) {
  d3.csv(csv, function (data) {
    // first, sort by category, so that clusters spider nice
    var sorted_by_category = data.sort(function (a, b) {
      return d3.ascending(a.category, b.category);
    });
    // put sorted data into year-based arrays
    var data_by_years = dataByYears(sorted_by_category);
    // get category labels
    var legend_labels = getCategories(data);
    // get a simple array of years to use as keys
    var years = getYears(data);
    // chart json
    var chart_json = getCategoryCountsByYear(data, legend_labels, years);

    const init = (data, legend_labels, data_by_years, years, chart_json) => {
      document.addEventListener("initialMapLoad", () => {
        // build the ui/legend controls
        doLegendControls(legend_labels, data_by_years, years, chart_json);
        // do the category charts
        doChart(chart_json, null, years);
      });
      document.addEventListener("initialChartLoad", () => {
        // do the data cards
        setTimeout(() => {
          doCards(data);
        }, 500);
      });
      // build the map to begin loading
      doMap(
        data_by_years,
        years,
        currentYearIndex,
        default_coords,
        default_zoom
      );
    };
    init(data, legend_labels, data_by_years, years, chart_json);
  });
});

// Functions ==============================================
function doCards(data) {
  $(browse_container).hide();
  data.forEach((d) => {
    var html = "";
    var title = d.occupant_name
      ? "<h1>" + d.occupant_name.trim() + "</h1>"
      : "<h1>Occupant Not Recorded</h1>";
    var address = d.location
      ? '<div class="address">' + d.location.trim() + "</div>"
      : "";
    var building = d.building_name
      ? '<div class="building">' + d.building_name.trim() + "</div>"
      : "";
    var year = d.year
      ? '<div class="year"><span>Year:</span> ' + d.year.trim() + "</div>"
      : "";
    var type = d.occupant_type
      ? '<div class="type"><span>Type:</span> ' +
        d.occupant_type.trim() +
        "</div>"
      : "";
    var category_and_sub = d.category
      ? d.category.split("|")
      : [condensed_labels_replacement, condensed_labels_replacement];
    var category = category_and_sub[0]
      ? '<div class="category"><span>Category:</span> ' +
        category_and_sub[0].trim() +
        "</div>"
      : "";
    var subcategory = category_and_sub[1]
      ? '<div class="subcategory"><span>Subcategory:</span> ' +
        category_and_sub[1].trim() +
        "</div>"
      : "";
    var note = d.notes
      ? '<div class="notes"><span>Notes:</span> ' + d.notes.trim() + "</div>"
      : "";
    var color = category_and_sub[0]
      ? getMarkerColor(category_and_sub[0].trim())
      : "#000000";
    var color_cat = category_and_sub[0]
      ? '<div class="category_header"><div class="color" style="background-color:' +
        color +
        '"></div><div class="label">' +
        (color !== "#000000" ? category_and_sub[0].trim() : "OTHER") +
        "</div></div>"
      : "";
    var card_text =
      '<div class="card-header">' +
      color_cat +
      title +
      building +
      address +
      "</div>" +
      '<div class="card-metadata">' +
      year +
      type +
      category +
      subcategory +
      note +
      "</div>";
    html +=
      '<div class="card" data-category="' +
      (color !== "#000000" ? category_and_sub[0].trim() : "OTHER") +
      '" data-year="' +
      (d.year ? d.year.trim() : "") +
      '">' +
      card_text +
      "</div>";

    $(browse_container).append(html);
  });
  // $(browse_container).fadeIn(1000, "swing");
}

function doChart(chart_json, category, years) {
  /*
	****************
	Prepare the data
	****************	
	*/

  if (category) {
    var filter = chart_json.filter((obj) => {
      if (obj.category === category) return obj;
    });
    var max_count = d3.max(filter[0].counts);
    var data = [filter[0]]; // array of one category
  } else {
    var max_count = d3.max(chart_json.totals);
    var data = chart_json; // array of all categories
  }

  /*
	**********************
	Set up the chart scale
	**********************	
	*/

  // D3 margin convention
  var margin = { top: 20, right: 30, bottom: 20, left: 50 },
    height = 400 - margin.top - margin.bottom,
    width = parseInt(d3.select(chart_container).style("width"), 10),
    width = width - margin.left - margin.right;

  // X scale uses years
  var xScale = d3
    .scaleBand()
    .domain(years)
    .range([10, width - 10])
    .padding(0.2);

  // Y scale uses category counts
  var yScale = d3.scaleLinear().domain([0, max_count]).range([height, 0]);

  // Add the SVG to the container
  var svg = d3
    .select(chart_container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Append the x axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickValues(years).tickFormat(d3.format("Y"))); // no commas; format as years

  // Append the y axis
  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale).ticks(Math.min(10, yScale.domain()[1]))); // no more ticks than there are total (max 10)

  /*
	*****************
	Add the data bars
	*****************
	*/

  var bars = svg.append("g").attr("id", "bars");
  years.forEach((year, i) => {
    var bar = bars.append("g").attr("id", "bars_" + year);
    var year_index = i;
    var y0 = 0; // stacking
    bar
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", xScale(year))
      .attr("y", (d) => {
        var count = d.counts[year_index] ? d.counts[year_index] : 0;
        y0 += count; // stacking
        return yScale(y0);
      })
      .attr("data-category", (d) => {
        return d.category;
      })
      .attr("data-year", year)
      .attr("data-total", (d) => {
        return d.counts[year_index] ? d.counts[year_index] : 0;
      })
      .attr("class", "rect_" + year)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => {
        var count = d.counts[year_index] ? d.counts[year_index] : 0;
        var bar_height = count ? height - yScale(count) : 0;
        return bar_height;
      })
      .attr("fill", (d) => {
        return getMarkerColor(d.category);
      });
  });

  /*
	***************
	Add the Tooltip
	***************	
	*/
  // @TODO!: update jQuery, jQueryUI, etc
  $("rect").tooltip({
    items: "rect",
    content: function () {
      var c_total = $(this).data("total");
      var y_total = 0;
      var siblings = $("rect." + this.className.baseVal);
      var isMulti = siblings.length > 1 ? true : false;
      siblings.each((i) => {
        y_total += $(siblings[i]).data("total");
      });
      var percent = Number.parseFloat((c_total / y_total) * 100).toPrecision(3);

      var tip_content =
        "<strong>" +
        $(this)
          .data("category")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()) +
        "</strong>";

      if (isMulti) {
        tip_content += '<div class="tip_details">' + percent + " %<br>";
        tip_content += c_total + " of " + y_total + "</div>";
      } else {
        tip_content += '<span class="tip_details">: ' + c_total + "</span>";
      }

      return tip_content;
    },
    track: true,
  });
  const chartEvent = new Event("initialChartLoad");
  if (dispatchChart) {
    document.dispatchEvent(chartEvent);
    dispatchChart = false;
  }
}

function getCategoryCountsByYear(data, legend_labels, years) {
  var json = new Array();
  legend_labels.forEach((label) => {
    var yobj = new Object();
    yobj.category = label;
    yobj.counts = new Array(years.length);
    json.push(yobj);
  });

  // obj.counts array maps to years index (obj.counts[0] == years[0]) so we can push to that array below
  json.totals = new Array(years.length);
  data.forEach((row) => {
    var category_and_sub = row.category
      ? row.category.split("|")
      : [condensed_labels_replacement, condensed_labels_replacement];
    var category = category_and_sub[0].trim();
    var year = row.year;
    var i = years.findIndex((y) => y === year); // matches years[i] in json
    var c = json.findIndex((j) => j.category === category);
    if (json[c]) {
      var obj = json[c]; // the category object
    } else {
      var obj = json[json.length - 1]; // the "OTHER" category object (condensed)
    }
    // update count for the category
    obj.counts[i] = obj.counts[i] ? obj.counts[i] + 1 : 1;
    // update "All Categories" totals for each year (use in default y-scale)
    json.totals[i] = json.totals[i] ? json.totals[i] + 1 : 1;
  });
  return json;
}

function layerGroupName(string) {
  var labelled = string.trim().toLowerCase();
  labelled = labelled.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, "");
  return labelled;
}

function categoryClickLegend(filter) {
  console.log(filter);
}
function doLegendControls(legend_labels, data_by_years, years, chart_json) {
  // populate legend
  d3.select("#legend")
    .append("ul")
    .html(function () {
      var html = "";

      legend_labels.forEach(function (label) {
        var cat =
          '<li data-filter="' +
          layerGroupName(label) +
          '" ><div class="color" style="background-color:' +
          getMarkerColor(label) +
          '"></div><div class="label">' +
          label.toLowerCase() +
          "</div></li>";
        html += cat;
      });
      return html;
    });

  // populate years
  d3.select("#legend #y_select").html(function () {
    var html = "";
    // sort years for display, reference the *initial* array order when switching
    var sorted = years.sort();
    sorted.forEach(function (y, i) {
      html += '<option value="' + y + '">' + y + "</option>";
    });
    return html;
  });
  d3.select("#select_browse #y_select_browse").html(function () {
    var html = '<option value="">All Years</option>';
    // sort years for display, reference the *initial* array order when switching
    var sorted = years.sort();
    sorted.forEach(function (y, i) {
      html += '<option value="' + y + '">' + y + "</option>";
    });
    return html;
  });

  // populate categories
  d3.select("#chart-select #c_select").html(function () {
    var html = '<option value="">All Categories</option>';
    // sort years for display, reference the *initial* array order when switching
    legend_labels.forEach(function (c, i) {
      html +=
        '<option value="' +
        c +
        '">' +
        c.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) +
        "</option>";
    });
    return html;
  });
  d3.select("#select_browse #c_select_browse").html(function () {
    var html = '<option value="">All Categories</option>';
    // sort years for display, reference the *initial* array order when switching
    legend_labels.forEach(function (c, i) {
      html +=
        '<option value="' +
        c +
        '">' +
        c.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) +
        "</option>";
    });
    return html;
  });

  // listen for year selection (map)
  var s = document.getElementById("y_select");
  s.addEventListener("change", function (e) {
    // remove existing map
    map.remove();
    // re-build map for new year
    var i = years.indexOf(e.target.value);
    currentYearIndex = i;
    doMap(
      data_by_years,
      years,
      currentYearIndex,
      default_coords,
      default_zoom,
      currentFilter
    );
  });

  var resetActiveFilters = () => {
    var unselect = document.querySelectorAll("li[data-filter].active-filter");
    unselect.forEach((s) => {
      s.classList.remove("active-filter");
    });
  };

  // listen for category selection (map)
  var s = document.querySelectorAll("li[data-filter]");
  s.forEach((x) => {
    x.addEventListener("click", function (e, s) {
      if (e.currentTarget.classList.contains("active-filter")) {
        // if active filter...
        e.currentTarget.classList.remove("active-filter");
        resetActiveFilters();
        currentFilter = false; // remove filter
      } else {
        // if not active filter...
        resetActiveFilters();
        e.currentTarget.classList.add("active-filter");
        currentFilter = e.currentTarget.dataset.filter; // add filter
      }

      map.remove();
      doMap(
        data_by_years,
        years,
        currentYearIndex,
        default_coords,
        default_zoom,
        currentFilter
      );
    });
  });

  // listen for category selection (chart)
  var s = document.getElementById("c_select");
  s.addEventListener("change", function (e) {
    var chart = document.querySelector(chart_container);
    chart.innerHTML = "";
    var category = e.target.value ? e.target.value : null;
    doChart(chart_json, category, years);
  });

  // listen for filter selections (cards)
  var c_filter = "";
  var y_filter = "";
  var t_filter = "";
  var s = document.getElementById("y_select_browse");
  s.addEventListener("change", function (e) {
    y_filter = e.target.value ? e.target.value : "";
    filterDataCards(c_filter, y_filter, t_filter);
  });
  var s = document.getElementById("c_select_browse");
  s.addEventListener("change", function (e) {
    c_filter = e.target.value ? e.target.value : "";
    filterDataCards(c_filter, y_filter, t_filter);
  });

  var filterDataCards = function (c, y, t) {
    $(browse_container + " .card").show();
    if (c.length)
      $(browse_container + ' .card[data-category != "' + c + '"]').hide();
    if (y.length)
      $(browse_container + ' .card[data-year != "' + y + '"]').hide();
    if (t.length)
      $(browse_container + " .card")
        .not(':containsi("' + t + '")')
        .hide();
    $(browse_container).show();
  };

  // listen for keyword query
  var timeout;
  var delay = 500;
  var input = $("#filter_browse");
  var callback = function () {
    // @TODO!
    var keyword = input.val();
    if (keyword.length > 1) {
      t_filter = keyword;
      filterDataCards(c_filter, y_filter, t_filter);
    } else {
      t_filter = "";
      filterDataCards(c_filter, y_filter, t_filter);
    }
  };
  input.keyup(function (e) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(function (e) {
      callback();
    }, delay);
  });
}

function doMap(
  data_by_years,
  years,
  year_index = currentYearIndex,
  center = default_coords,
  zoom = default_zoom,
  filter = false
) {
  map = L.map(map_container, {
    scrollWheelZoom: false,
    center: center,
    zoom: zoom,
  });
  L.tileLayer(
    "//cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/light_all/{z}/{x}/{y}{retina}.png",
    {
      attribution:
        '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://cartodb.com/attributions">CartoDB</a>',
      retina: L.Browser.retina ? "@2x" : "",
      maxZoom: 22,
      maxNativeZoom: 18,
    }
  ).addTo(map);

  map.once("layeradd ", (e) => {
    if (dispatchMap) {
      // initial map load is complete, continue drawing page
      const mapEvent = new Event("initialMapLoad");
      document.dispatchEvent(mapEvent);
      dispatchMap = false;
    }
  });

  map.on("focus", () => {
    // allow scroll zoom when map is in focus
    map.scrollWheelZoom.enable();
  });

  map.on("blur", () => {
    // turn off scroll zoom on blur
    map.scrollWheelZoom.disable();
  });

  map.on("zoomend", () => {
    // track current zoom
    default_zoom = map.getZoom();
  });

  map.on("moveend", () => {
    // track current coords
    default_coords = map.getCenter();
  });

  // cluster group
  var clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: true,
    spiderfyOnMaxZoom: true,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 0,
    polygonOptions: {
      stroke: false,
      color: "#000",
      fillOpacity: 0.1,
    },
    iconCreateFunction: (cluster) => {
      var markers = cluster.getAllChildMarkers();
      var clusterColors = new Set();
      var style = null;
      markers.forEach((marker) => {
        if (!marker.options.fillColor.startsWith("#"))
          clusterColors.add(marker.options.fillColor);
      });
      if (clusterColors.size > 1) {
        style =
          "background: linear-gradient(to top right," +
          Array.from(clusterColors).toString() +
          ")";
      } else if (clusterColors.size > 0) {
        style =
          "background:" + Array.from(clusterColors).toString() + "!important";
      } else {
        style = "background: rgba(122, 122, 122, 1)";
      }

      var childCount = cluster.getChildCount();
      var c = " marker-cluster-";
      if (childCount < 10) {
        c += "small";
      } else if (childCount < 30) {
        c += "medium";
      } else {
        c += "large";
      }
      return new L.DivIcon({
        html:
          '<div style="' + style + '"><span>' + childCount + "</span></div>",
        className: "marker-cluster" + c,
        iconSize: new L.Point(20, 20),
      });
    },
  });

  // add marker
  data_by_years[year_index].forEach(function (row, i) {
    // coords
    var lon = row.Longitude;
    var lat = row.Latitude;
    // popup html
    var title = row.occupant_name
      ? "<h1>" + row.occupant_name.trim() + "</h1>"
      : "<h1>Occupant Not Recorded</h1>";
    var address = row.location
      ? '<div class="address">' + row.location.trim() + "</div>"
      : "";
    var building = row.building_name
      ? '<div class="building">' + row.building_name.trim() + "</div>"
      : "";
    var year = row.year
      ? '<div class="year"><span>Year:</span> ' + row.year.trim() + "</div>"
      : "";
    var type = row.occupant_type
      ? '<div class="type"><span>Type:</span> ' +
        row.occupant_type.trim() +
        "</div>"
      : "";
    var category_and_sub = row.category
      ? row.category.split("|")
      : [condensed_labels_replacement, condensed_labels_replacement];
    var category = category_and_sub[0]
      ? '<div class="category"><span>Category:</span> ' +
        category_and_sub[0].trim() +
        "</div>"
      : "";

    var subcategory = category_and_sub[1]
      ? '<div class="subcategory"><span>Subcategory:</span> ' +
        category_and_sub[1].trim() +
        "</div>"
      : "";
    var note = row.notes
      ? '<div class="notes"><span>Notes:</span> ' + row.notes.trim() + "</div>"
      : "";
    var popup_text =
      '<div class="popup-header">' +
      title +
      building +
      address +
      "</div>" +
      '<div class="popup-metadata">' +
      year +
      type +
      category +
      subcategory +
      note +
      "</div>";

    // address toast
    var street_address =
      row.street && row.street_number
        ? row.street_number.trim() + " " + row.street.trim()
        : false;
    var address_toast_info = row.building_name
      ? row.building_name.trim() +
        (street_address ? " (" + street_address + ")" : "")
      : street_address
      ? street_address
      : null;

    var marker = L.circleMarker([lat, lon], {
      address: address_toast_info,
      radius: 8,
      color: "#ffffff",
      opacity: 1,
      weight: 1,
      fillColor: getMarkerColor(category_and_sub[0]),
      fillOpacity: 0.75,
      fill: true,
      title: convertHtmlToText(title),
      alt: convertHtmlToText(title),
    }).bindPopup(popup_text);

    var layerGroup = layerGroupName(category_and_sub[0]);
    if (filter) {
      // filter by category
      if (filter === layerGroup) clusterGroup.addLayer(marker);
    } else {
      clusterGroup.addLayer(marker);
    }
    // switch (layerGroup) {
    //   case "clubsandorganizations":
    //     clubsandorganizations.push(marker);
    //     break;
    //   case "entertainment":
    //     entertainment.push(marker);
    //     break;
    //   case "financeinsuranceandrealestate":
    //     financeinsuranceandrealestate.push(marker);
    //     break;
    //   case "foodservicesanddrinkingplaces":
    //     foodservicesanddrinkingplaces.push(marker);
    //     break;
    //   case "hotelsandmotels":
    //     hotelsandmotels.push(marker);
    //     break;
    //   case "institution":
    //     institution.push(marker);
    //     break;
    //   case "manufacturer":
    //     manufacturer.push(marker);
    //     break;
    //   case "museumsandgalleries":
    //     museumsandgalleries.push(marker);
    //     break;
    //   case "professional":
    //     professional.push(marker);
    //     break;
    //   case "retail":
    //     retail.push(marker);
    //     break;
    //   case "service":
    //     service.push(marker);
    //     break;
    //   case "vacant":
    //     vacant.push(marker);
    //     break;
    //   case "other":
    //     other.push(marker);
    //     break;
    //   default:
    //     other.push(marker);
    //     break;
    // }
    // clusterGroup.addLayer(marker);
  });

  // cluster
  map.addLayer(clusterGroup);

  // panTo cluster
  clusterGroup.on("clusterclick", function (a) {
    map.panTo(a.layer._cLatLng);
  });

  // respond to spidering
  clusterGroup.on("unspiderfied", function (e) {
    // remove toast content
    d3.select("#toast-inner").html("");
    // remove class from map and child marker
    e.markers.forEach(function (marker) {
      marker._path.classList.remove("active-marker");
    });
    var el = document.getElementById(map_container);
    el.classList.remove("spiderfied");
  });
  clusterGroup.on("spiderfied", function (e) {
    // add class to map and child marker
    e.markers.forEach(function (marker) {
      marker._path.classList.add("active-marker");
    });
    // add spiderfied class to map container
    var el = document.getElementById(map_container);
    el.classList.add("spiderfied");
    // change rendered order to move active marker to front
    d3.selectAll(".spiderfied path.active-marker").moveToFront();
    // update toast
    var address_array = e.markers
      .map((m) => m.options.address)
      .filter((value, index, self) => self.indexOf(value) === index);
    var toast_content =
      address_array.length == 1
        ? address_array[0]
        : address_array.length + " addresses";
    d3.select("#toast-inner").html(toast_content);
  });
  // Fit map to clusterGroup (ON INITIAL LOAD ONLY)
  if (zoomToBounds) {
    map.fitBounds(clusterGroup.getBounds());
    zoomToBounds = false;
  }
}

function colorRange(i) {
  var c = d3
    .scaleLinear()
    .domain([0, 2, 4, 6, 8, 10, 12, 14])
    .range(["#f24a4a", "#f29b4a", "#f0c724", "#4dbb3a", "#4b66d2", "#b96cda"]);
  return c(i);
}

function getMarkerColor(category) {
  var obj = label_colors.find(({ name }) => name === category.trim());
  var color = typeof obj !== "undefined" ? obj.color : "#000000";
  return color;
}

function getYears(data) {
  var years = data
    .map((row) => row.year)
    .filter((value, index, self) => self.indexOf(value) === index);
  return years;
}

function dataByYears(data) {
  var sort_by_year = data.sort(function (a, b) {
    return d3.ascending(a.year, b.year);
  });
  byYears = [];
  getYears(sort_by_year).forEach(function (y, i) {
    var yearfilter = sort_by_year.filter((obj) => {
      return obj.year === y;
    });
    byYears[i] = yearfilter;
  });
  return byYears;
}

function keyByYearValues(data) {
  var getyears = getYears(data);
  var rekey = {};
  getyears.forEach(function (year) {
    var yearfilter = data.filter((obj) => {
      return obj.year === year;
    });
    rekey[year] = yearfilter;
  });
  return rekey;
}

function countByYear(data_keyed_by_year) {
  yearcounts = [];
  for (var key in data_keyed_by_year) {
    yearcounts.push({ year: key, count: data_keyed_by_year[key].length });
  }
  return yearcounts;
}

function getCategories(data) {
  var cats = data
    .map((row) => row.category)
    .filter((value, index, self) => self.indexOf(value) === index);
  toplevel_cats = [];
  cats.forEach(function (cat) {
    var c = cat.split("|");
    var category_label = c[0] ? c[0].trim() : "OTHER";
    if (condensed_labels.includes(category_label)) {
      category_label = condensed_labels_replacement;
    }
    if (toplevel_cats.indexOf(category_label) === -1) {
      toplevel_cats.push(category_label);
    }
  });
  // sort A-Z
  var cats = toplevel_cats.sort();
  // move "Other" (condensed categories) to last position
  cats.push(cats.splice(cats.indexOf(condensed_labels_replacement), 1)[0]);

  return cats;
}

function keyByCategoryValues(data) {
  var getcategories = data
    .map((row) => row.category)
    .filter((value, index, self) => self.indexOf(value) === index);
  var rekey = {};
  getcategories.forEach(function (category) {
    var categoryfilter = data.filter((obj) => {
      return obj.category === category;
    });
    rekey[category] = categoryfilter;
  });
  return rekey;
}

function countByCategory(data_keyed_by_category) {
  categorycounts = [];
  for (var key in data_keyed_by_category) {
    categorycounts.push({
      category: key,
      count: data_keyed_by_category[key].length,
    });
  }
  return categorycounts;
}

// helper for title attributes with encoded HTML
function convertHtmlToText(value) {
  var d = document.createElement("div");
  d.innerHTML = value;
  return d.innerText;
}
