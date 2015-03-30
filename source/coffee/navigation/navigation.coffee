class Navigation
  constructor: ->
    @widget = $ ".dropdown"
    if @widget.length == 0
      return
    @title = @widget.find ".dropdown__title"
    @title.on 'click', @toggleDropdown

  toggleDropdown: =>
    @widget.toggleClass "dropdown_open"

$(document).ready ->
  new Navigation
