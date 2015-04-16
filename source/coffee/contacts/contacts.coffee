class Contacts
  constructor: ->
    @form = $ '.contacts__form'
    if @form.length == 0
      return
    @success = $ 'section.contacts.contacts_success'
    @form.on 'submit', @sendMessage

  sendMessage: (event)=>
    event.preventDefault()
    @form.closest('section.contacts').hide()
    @success.show()

$(document).ready ->
  new Contacts
