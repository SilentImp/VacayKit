class Graph

  constructor: (@widget)->
    @labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    @labels_mobile = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    @container = @widget.find '.best__graph-container'
    @margin =
      top: 0
      right: 0
      bottom: 30
      left: 0
    @svg = d3.select @container[0]

    $(window).on 'resize', @init
    @init()

  init: =>

    if Modernizr.mq '(min-width: 500px)'
      @radius = "8px"
    else
      @radius = "5px"

    @svg.selectAll("*").remove()
    @axes()
    switch @widget.attr 'data-type'
      when 'precipitation' then @precipitationChart()
      else
        @switcher = @widget.find '.switcher'
        @switcher_buttons = @switcher.find 'button'
        @switcher_buttons.on 'click', @toggleTemperature
        @switcher_status = @switcher.find('.switcher__selected').attr 'data-filter'
        @min = JSON.parse @widget.attr 'data-min'
        @max = JSON.parse @widget.attr 'data-max'
        @temperaturesChart()

  axes: =>
    @width = @widget.width() - @margin.left - @margin.right
    @height = @container.height() - @margin.top - @margin.bottom

    if Modernizr.mq '(min-width: 500px)'
      @axis = @svg.selectAll("text.xaxis").data @labels
    else
      @axis = @svg.selectAll("text.xaxis").data @labels_mobile

    dx = 100/24
    @axis.enter()
      .append("svg:text")
      .attr("class", "x-axis")
      .style("text-anchor", "middle")
      .attr("x", ->
        tmp = dx
        dx+=100/12
        return tmp+"%"
        )
      .attr("y", @container.height()+"px")
      .text (d)->
        return d

    @axis_line = @svg.append("rect")
      .attr("class", "axis-line")
      .attr("width", "100%")
      .attr("height", "1px")
      .attr("y", @container.height()-25+"px")
      .attr "x", "0"

    @y = d3.scale.linear().range [@height, 0]
    @x = d3.scale.linear().range [@width, 0]


  lightenDarkenColor: (col, amt)->
    usePound = false
    if col[0] == "#"
      col = col.slice 1
      usePound = true
    num = parseInt col, 16
    r = (num >> 16) + amt

    if r > 255
      r = 255
    else if r < 0
      r = 0

    b = ((num >> 8) & 0x00FF) + amt

    if b > 255
      b = 255
    else if b < 0
      b = 0

    g = (num & 0x0000FF) + amt

    if g > 255
      g = 255
    else if g < 0
      g = 0

    return "#" + (g | (b << 8) | (r << 16)).toString(16)

  precipitationChart: =>
    @values = JSON.parse @widget.attr 'data-values'
    maxX = Math.max.apply null, @values
    dx = 100/24
    color = d3.rgb '#1E88E5'
    chart = d3.select @container[0]
    bar = chart.selectAll(".bar").data @values

    bar
      .enter()
      .append("text")
      .attr("y", (@height-20)+"px")
      .attr("x", (d)=>
        tmp = dx
        dx += 100/12
        return tmp+ "%"
        )
      .style("text-anchor", "middle")
      .attr("class", "bar-text")
      .text (d)=>
        return d

    dx = 0

    bar
      .enter()
      .append("rect")
      .attr("width", 100/12 + "%")
      .attr("height", (d)=>
        return Math.floor(((d*100/maxX)/100)*(@height-50))+"px"
        )
      .attr("y", (d)=>
        return ((@height-50) - Math.floor(((d*100/maxX)/100)*(@height-50)))+"px"
        )
      .attr("x", (d)=>
        tmp = dx
        dx += 100/12
        return Math.min(tmp, 100 - 100/12)+ "%"
        )
      .attr "fill", (d)=>
        return @lightenDarkenColor '#1E88E5', 100 - d*100/maxX

  toggleTemperature: =>
    @switcher_buttons.toggleClass 'switcher__selected'
    if @switcher_status == "F"
      @min = (Math.round((t - 32)*(5/9)) for t in @min)
      @max = (Math.round((t - 32)*(5/9)) for t in @max)
    else
      @min = (Math.round(t*(9/5) + 32) for t in @min)
      @max = (Math.round(t*(9/5) + 32) for t in @max)
    @switcher_status = @switcher.find('.switcher__selected').attr 'data-filter'
    @update()

  update: =>
    @temperatureData()

    max_text = @max_text.data @max_nodes
    max_text
      .transition()
      .attr("x", (d)->
        return d.x
        )
      .attr("y", (d)->
        return (parseInt(d.y,10) - 20)
        )
      .text (d)->
        return d.value
    max_text
      .exit()
      .remove()


    min_text = @min_text.data @min_nodes
    min_text
      .transition()
      .attr("x", (d)->
        return d.x
        )
      .attr("y", (d)->
        return (parseInt(d.y,10) + 30)
        )
      .text (d)->
        return d.value
    min_text
      .exit()
      .remove()

    max_dots = @max_dots.data @max_nodes
    max_dots
      .transition()
      .attr("r", @radius)
      .attr("cx", (d)->
        return d.x
        )
      .attr "cy", (d)->
        return d.y
    max_dots
      .exit()
      .remove()

    min_dots = @min_dots.data @min_nodes
    min_dots
      .transition()
      .attr("r", @radius)
      .attr("cx", (d)->
        return d.x
        )
      .attr "cy", (d)->
        return d.y
    min_dots
      .exit()
      .remove()

    min_lines = @min_lines.data @min_links
    min_lines
      .transition()
      .attr("x1", (d)->
        return d.source.x
        )
      .attr("y1", (d)->
        return d.source.y
        )
      .attr("x2", (d)->
        return d.target.x
        )
      .attr "y2", (d)->
        return d.target.y
    min_lines
      .exit()
      .remove()

    max_lines = @max_lines.data @max_links
    max_lines
      .transition()
      .attr("x1", (d)->
        return d.source.x
        )
      .attr("y1", (d)->
        return d.source.y
        )
      .attr("x2", (d)->
        return d.target.x
        )
      .attr "y2", (d)->
        return d.target.y
    max_lines
      .exit()
      .remove()

  temperatureData: =>
    maxX = Math.max.apply null, @max
    maxX += 20
    minX = Math.min.apply null, @min
    minX = Math.max 0, minX-20

    d = 100/24
    @max_nodes = []
    for x in @max
      tmp = d
      @max_nodes.push
        'y': (@height-Math.floor(@height*(x-minX)/(maxX-minX)))+"px"
        'x': d + "%"
        value: x
      d+=100/12

    d = 100/24
    @min_nodes = []
    for x in @min
      tmp = d
      @min_nodes.push
        'y': (@height-Math.floor(@height*(x-minX)/(maxX-minX)))+"px"
        'x': d + "%"
        value: x
      d+=100/12

    @min_links = []
    old_node = null
    for node in @min_nodes
      if old_node != null
        @min_links.push
          source: old_node
          target: node
      old_node = node

    @max_links = []
    old_node = null
    for node in @max_nodes
      if old_node != null
        @max_links.push
          source: old_node
          target: node
      old_node = node

  temperaturesChart: =>

    @temperatureData()

    @max_text = @svg.selectAll("text.max").data @max_nodes
    @max_text.enter()
      .append("svg:text")
      .attr("class", "max")
      .style("text-anchor", "middle")
      .attr("x", (d)->
        return d.x
        )
      .attr("y", (d)->
        return (parseInt(d.y,10) - 20)
        )
      .text (d)->
        return d.value

    @min_text = @svg.selectAll("text.min").data @min_nodes
    @min_text.enter()
      .append("svg:text")
      .attr("class", "min")
      .style("text-anchor", "middle")
      .attr("x", (d)->
        return d.x
        )
      .attr("y", (d)->
        return (parseInt(d.y,10) + 30)
        )
      .text (d)->
        return d.value

    @max_dots = @svg.selectAll("circle.max").data @max_nodes
    @max_dots.enter()
      .append("svg:circle")
      .attr("class", "max")
      .attr("fill", '#FF7043')
      .attr("r", @radius)
      .attr("cx", (d)->
        return d.x
        )
      .attr "cy", (d)->
        return d.y

    @min_dots = @svg.selectAll("circle.min").data @min_nodes
    @min_dots.enter()
      .append("svg:circle")
      .attr("class", "min")
      .attr("fill", '#42A5F5')
      .attr("r", @radius)
      .attr("cx", (d)->
        return d.x
        )
      .attr "cy", (d)->
        return d.y

    @max_lines = @svg.selectAll("line.max").data @max_links

    @max_lines.enter()
      .append("line")
      .attr("class", "max")
      .style("stroke", "#FF7043")
      .attr("stroke-width", "3px")
      .attr("x1", (d)->
        return d.source.x
        )
      .attr("y1", (d)->
        return d.source.y
        )
      .attr("x2", (d)->
        return d.target.x
        )
      .attr "y2", (d)->
        return d.target.y

    @min_lines = @svg.selectAll("line.min").data @min_links
    @min_lines.enter()
      .append("line")
      .attr("class", "min")
      .style("stroke", "#42A5F5")
      .attr("stroke-width", "3px")
      .attr("x1", (d)->
        return d.source.x
        )
      .attr("y1", (d)->
        return d.source.y
        )
      .attr("x2", (d)->
        return d.target.x
        )
      .attr "y2", (d)->
        return d.target.y


$(document).ready ->
  for graph in $ '.best__graph[data-type]'
    new Graph $(graph)
