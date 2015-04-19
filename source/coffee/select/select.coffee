class Select
  constructor: (@input)->
    @html = $ 'html'
    @input.css
      position: 'fixed'
      left: '-200%'
    tab = parseInt @input.attr('tabindex'), 10
    if isNaN(tab)
      tab = 1
    @input.attr 'tabindex', -1
    @template = Handlebars.compile $('#select-template').html()
    @options = []
    for option in @input.find 'option'
      option = $ option
      label = option.attr 'label'
      if typeof label == "undefined"
        label = option.text()
      @options.push
        'value': option.attr 'value'
        'label': label
    @widget = @template
      'options': @options
      'tab': tab
    @input.after @widget
    @widget = @input.next()

    @widget.attr 'tabindex', tab
    @current = @widget.find '.select__current'

    if @html.hasClass 'no-touch'
      @input.on 'focus', @refocus
      @current.on 'click', @toggleDropdown
      @widget.on 'click', '.select__option', @clickOptions
    else
      @current.on 'touchend click tap', @tapOptions
      @input.on 'change', @inputSync

  inputSync: =>
    value = @input.val()
    label = @input.find('option[value="'+value+'"]').text()
    @current.attr('data-value', value).text(label).toggleClass 'select__current_unchanged', false

  tapOptions: =>
    @input[0].focus()

  refocus: =>
    @widget.toggleClass 'select_open', true
    @widget.find('.select__option:first').focus()

  toggleDropdown: =>
    @widget.toggleClass 'select_open'

  clickOptions: (event)=>
    option = $ event.currentTarget
    value = option.attr 'data-value'
    label = option.text()
    @current.attr('data-value', value).text(label).toggleClass 'select__current_unchanged', false
    @input.val value
    @widget.toggleClass 'select_open', false

$(document).ready ->
  for select in $ 'select[data-select]'
    new Select $(select)
