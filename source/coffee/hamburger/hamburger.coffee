class Hamburger
  constructor: ->
    @button = $ 'body>header .hamburger'
    if @button.length == 0
      return
    @button.on 'click touch', @switchState
    $('.project__lightbox').on 'click touch', @switchState

  switchState: =>
    @button.toggleClass 'hamburger_open'

$(document).ready ->
  new Hamburger
