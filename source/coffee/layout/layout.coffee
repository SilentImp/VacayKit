class Layout
  constructor: ->
    @html = $ 'html'
    @timer = null
    $(window).on 'resize', @blockTransitions

  blockTransitions: =>
    if !@html.hasClass 'resizing'
      @html.addClass 'resizing'
    window.clearTimeout @timer
    @timer = window.setTimeout @unblockTransitions, 250

  unblockTransitions: =>
    @html.removeClass 'resizing'

$(document).ready ->
  new Layout
