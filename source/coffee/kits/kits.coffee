class Kits
  constructor: ->
    @widget = $ '.kits'
    if @widget.length == 0
      return

    @menu = @widget.find '.kits__menu'
    @buttons = @menu.find 'a'
    @footer = $ 'body>footer'
    @heads = $ '.items__header'
    @head_height = $(@heads.get(0)).height()
    @wrapper = @menu.find('.kits__wrapper')

    @getLayout()

    @buttons.on 'click', @scrollTo
    $(window).on 'scroll', @stickIt
    $(window).on 'resize', @getLayout

  getLayout: =>
    @layout = 'desktop'

    if Modernizr.mq '(max-width: 980px)'
      @layout = 'mobile'
      @menu.css 'max-height', 'initial'
      @widget.css 'bottom', 'auto'
      @wrapper.width @buttons.length*@buttons.width()
    else if Modernizr.mq '(max-width: 1120px)'
      @layout = 'tablet'
      @wrapper.width "auto"
    else
      @wrapper.width "auto"

    @viewport_height = Math.max document.documentElement.clientHeight, window.innerHeight || 0
    @links_width = @wrapper.width()
    @links_height = @wrapper.height()

  stickIt: =>

    @menu_top = $('.items__wrapper').offset().top
    top = Math.max $('html').scrollTop(), document.body.scrollTop

    if top >= @menu_top
      @widget.toggleClass 'kits_stick', true
      if @layout is 'desktop' || @layout is 'tablet'
        visible_footer = Math.max((top + @viewport_height) - @footer.offset().top, 0)
        @menu.css 'max-height', @viewport_height - visible_footer - 47
        @widget.css 'bottom', visible_footer + 'px'
    else
      @widget.toggleClass 'kits_stick', false
      @menu.css 'max-height', @viewport_height
      @widget.css 'bottom', 'auto'

    @getCurrentKit()

  getCurrentKit: =>
    bottom = Math.max($('html').scrollTop(), document.body.scrollTop) + @viewport_height
    last = null

    for head in @heads
      head = $(head)
      level = head.offset().top + @head_height
      if bottom - level >= 0
        last = head.get(0)
      else
        break

    if last != null
      id = last.parentNode.getAttribute 'id'
      @menu.find('.kits__kit_active').removeClass 'kits__kit_active'
      link = @menu.find 'a[href="#'+id+'"]'
      link.addClass 'kits__kit_active'

      menu_width = @menu.width()
      menu_height = @menu.height()

      if (@layout == 'mobile' && @links_width > menu_width) || (@layout != 'mobile' && @links_height > menu_height)

        window.clearTimeout @scroll_timer
        @scroll_timer = window.setTimeout @scroll_menu, 100, link, menu_width, menu_height

  scroll_menu: (link, menu_width, menu_height)=>
    if @layout == 'mobile'

      scroll_left = @menu.scrollLeft()
      link_left = link.offset().left
      link_width = link.width()
      if link_left<scroll_left || (link_left+link_width)>(scroll_left+menu_width)
        @menu.scrollTop 0
        # @menu.scrollLeft parseInt(link_left + link_width/2 - menu_width/2, 10)
        @menu.stop().animate(
            scrollLeft: parseInt(link_left + link_width/2 - menu_width/2, 10) + 'px'
          , 'fast')

    else

      scroll_top = @menu.scrollTop()
      link_top = link.offset().top - link.parent().offset().top
      link_height = link.height()

      if (link_top < scroll_top) || (link_top+link_height)>(scroll_top+menu_height)
        @menu.scrollLeft 0
        # @menu.scrollTop parseInt(link_top + link_height/2 - menu_height/2 + 15, 10)
        @menu.stop().animate(
            scrollTop: parseInt(link_top + link_height/2 - menu_height/2 + 15, 10) + 'px'
          , 'fast')


  scrollTo: (event)=>
    event.preventDefault()
    element = $ event.currentTarget.getAttribute('href')

    if @layout == 'mobile'
      target = parseInt(element.offset().top - @widget.height() - 20, 10)
    else
      target = parseInt(element.offset().top - 20, 10)

    $("body").stop().animate(
        scrollTop: target + 'px'
      , 'fast')

    $("html").stop().animate(
        scrollTop: target + 'px'
      , 'fast')


$(document).ready ->
  new Kits
