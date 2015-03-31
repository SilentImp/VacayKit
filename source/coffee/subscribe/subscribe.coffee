class Subscribe
  constructor: ->
    @button = $ "body>header .subscribe"
    @inputPopup = $ ".subscribe-form-popup"
    @inputPopupForm = @inputPopup.find ".subscribe-form"
    @inputPopupClose = @inputPopup.find ".popup__close"
    @inputPopupLightbox = @inputPopup.find ".popup__lightbox"
    @confirmPopup = $ ".subscribe-confirmation-popup"
    @confirmPopupClose = @confirmPopup.find ".popup__close"
    @confirmPopupLightbox = @confirmPopup.find ".popup__lightbox"

    @itemsSubscribeForm = $ ".items-subscribe"

    @shareButton = @confirmPopup.find ".show-socials"
    @sharePopup = $ ".share-list-popup"
    @sharePopupClose = @sharePopup.find ".popup__close"
    @sharePopupLightbox = @sharePopup.find ".popup__lightbox"

    @pageSubscribeButton = $ ".page__subscribe"
    @pageShareButton = $ ".page__share"

    if @button.length + @inputPopup.length + @confirmPopup.length != 3
      return

    @button.on 'click', @openInputPopup
    @inputPopupClose.on 'click', @closeInputPopup
    @inputPopupLightbox.on 'click', @closeInputPopup
    @confirmPopupClose.on 'click', @closeConfirmPopup
    @confirmPopupLightbox.on 'click', @closeConfirmPopup
    @sharePopupClose.on 'click', @closeSharePopup
    @sharePopupLightbox.on 'click', @closeSharePopup
    @pageSubscribeButton.on 'click', @openInputPopup

    @inputPopupForm.on 'submit', @submitEmail
    @itemsSubscribeForm.on "submit", @submitEmail

    @pageShareButton.on 'click', @openSharePopup
    @shareButton.on 'click', @openSharePopup

  closeSharePopup: (event)=>
    if event
      event.preventDefault()
    @sharePopup.fadeOut()

  openSharePopup: =>
    @closeConfirmPopup()
    @sharePopup.fadeIn()

  openInputPopup: (event)=>
    if event
      event.preventDefault()
    @inputPopup.fadeIn()

  closeInputPopup: (event)=>
    if event
      event.preventDefault()
    @inputPopup.fadeOut =>
      @inputPopupForm[0].reset()

  openConfirmPopup: =>
    @confirmPopup.fadeIn()

  closeConfirmPopup: (event)=>
    if event
      event.preventDefault()
    @confirmPopup.fadeOut()

  submitEmail: (event)=>
    if event
      event.preventDefault()
    form = event.currentTarget
    form.reset()
    @closeInputPopup()
    @openConfirmPopup()

$(document).ready ->
  new Subscribe
