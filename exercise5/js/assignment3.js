function get_data(id) {
	var tmp_data = data.filter(function(d){return d.fips == id})
	if (tmp_data.length == 0) {
		return 'null'
	}
	else {
		return tmp_data[0].pop
	}
}

var svg = d3.select('#map-svg')

var path = d3.geo.path()

var paths = svg.append("path")
    .datum(topojson.feature(shape, shape.objects.states))
    .attr('class', 'land')
    .attr("d", path);
var outline = svg.append("path")
    .datum(topojson.mesh(shape, shape.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "outline")
    .attr("d", path);

var radius = d3.scale.sqrt()
	.domain([0, 1e6])
	.range([0, 10])

svg.append("g")
	.attr("class", "bubble")
	.selectAll("circle")
	.data(topojson.feature(shape, shape.objects.counties).features)
	.enter().append("circle")
	.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
	.attr("r", function(d) {
		tmp_id = d.id
		return (get_data(tmp_id) == 'null') ? 0 : radius(get_data(tmp_id))
	})
	.attr('class', 'point')
