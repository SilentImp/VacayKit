class Kits
  constructor: ->
    @widget = $ '.kits'
    if @widget.length == 0
      return

    @header_height = $('body>header>.project').height()
    @menu = @widget.find '.kits__menu'
    @buttons = @menu.find 'a'
    @footer = $ 'body>footer'
    @heads = $ '.items__header'
    @head_height = $(@heads.get(0)).height()

    @getLayout()

    @buttons.on 'click', @scrollTo
    $(window).on 'scroll', @stickIt
    $(window).on 'resize', @getLayout



  getLayout: =>
    @layout = 'desktop'
    if Modernizr.mq '(max-width: 1120px)'
      @layout = 'tablet'
    if Modernizr.mq '(max-width: 980px)'
      @layout = 'mobile'
      @menu.css 'max-height', 'initial'
      @widget.css 'bottom', 'auto'
    @viewportHeight = Math.max document.documentElement.clientHeight, window.innerHeight || 0

  stickIt: =>
    @menu_top = @widget.offset().top
    top = $('html').scrollTop()
    if top+@header_height  >= @menu_top
      @widget.toggleClass 'kits_stick', true
      if @layout is 'desktop' || @layout is 'tablet'
        visible_footer = Math.max((top + @viewportHeight) - @footer.offset().top, 0)
        @menu.css 'max-height', @viewportHeight - @header_height - visible_footer - 48
        @widget.css 'bottom', visible_footer + 'px'
    else
      @widget.toggleClass 'kits_stick', false
      @menu.css 'max-height', @viewportHeight - @header_height
      @widget.css 'bottom', 'auto'
    @getCurrentKit()

  getCurrentKit: =>
    bottom = $('html').scrollTop() + @viewportHeight
    last = null
    for head in @heads
      head = $(head)
      level = head.offset().top + @head_height
      if bottom - level >= 0
        last = head.get(0)
      else
        break
    if last != null
      id = last.parentNode.getAttribute('id')
      @menu.find('.kits__kit_active').removeClass('kits__kit_active')
      @menu.find('a[href="#'+id+'"]').addClass('kits__kit_active')



  scrollTo: (event)=>
    event.preventDefault()
    element = $ event.currentTarget.getAttribute('href')

    if @layout == 'mobile'
      target = parseInt(element.offset().top - @header_height - @widget.height() - 20, 10)
    else
      target = parseInt(element.offset().top - @header_height - 20, 10)

    $('html').animate(
        scrollTop: target + 'px'
      , 'fast')


$(document).ready ->
  new Kits
