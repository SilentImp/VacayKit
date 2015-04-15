class Hamburger
  constructor: ->
    @button = $ 'body>header .hamburger'
    if @button.length == 0
      return
    @body = $ 'body'
    @button.on 'click touch', @switchState
    $('.project__lightbox').on 'click touch', @switchState

  switchState: =>
    @button.toggleClass 'hamburger_open'
    @body.toggleClass 'menu_open'

$(document).ready ->
  new Hamburger
