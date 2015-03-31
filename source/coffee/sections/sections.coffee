class Sections
  constructor: ->
    @buttons = $ ".page__section-button"
    if @buttons.length == 0
      return
    @buttons.on 'click', @toggleState

  toggleState: (event)=>
    $(event.currentTarget).toggleClass "page__section-button_open"

$(document).ready ->
  new Sections
