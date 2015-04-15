class Sections
  constructor: ->
    @buttons = $ ".page__section-button"
    if @buttons.length == 0
      return
    @buttons.on 'click', @toggleState

  toggleState: (event)=>
    button = $ event.currentTarget
    button.toggleClass "page__section-button_open"
    button.next().toggleClass "page__section_open"

$(document).ready ->
  new Sections
