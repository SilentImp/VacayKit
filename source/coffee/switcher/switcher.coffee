class Switcher
  constructor: (@widget)->
    @buttons = @widget.find 'button[data-filter]'
    @list = $ '#'+@widget.attr('data-target')

    if @buttons.length == 0 || @list.length !=1
      return

    @states = new Array
    @getStates()
    @buttons.on 'click', @toggleState

  getStates: =>
    @states = new Array
    for button in @widget.find('.switcher__selected')
      @states.push button.getAttribute 'data-filter'
    @filter()

  filter: =>
    if @states.length == 0
      @list.find('[data-label]').show()
      return

    tags = '[data-label~="'+@states.join('"],[data-label~="')+'"]'
    @list.find('[data-label]').hide()
    @list.find(tags).show()

  toggleState: (event)=>
    @widget.find('.switcher__selected').removeClass "switcher__selected"
    $(event.currentTarget).addClass "switcher__selected"
    @getStates()

$(document).ready ->
  for switcher in $('.switcher[data-target]')
    new Switcher $(switcher)
