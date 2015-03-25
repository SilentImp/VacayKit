var Hamburger,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Hamburger = (function() {
  function Hamburger() {
    this.switchState = bind(this.switchState, this);
    this.button = $('body>header .hamburger');
    if (this.button.length === 0) {
      return;
    }
    this.button.on('click touch', this.switchState);
    $('.project__lightbox').on('click touch', this.switchState);
  }

  Hamburger.prototype.switchState = function() {
    return this.button.toggleClass('hamburger_open');
  };

  return Hamburger;

})();

$(document).ready(function() {
  return new Hamburger;
});
