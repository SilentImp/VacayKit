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

var Kits,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Kits = (function() {
  function Kits() {
    this.scrollTo = bind(this.scrollTo, this);
    this.scroll_menu = bind(this.scroll_menu, this);
    this.getCurrentKit = bind(this.getCurrentKit, this);
    this.stickIt = bind(this.stickIt, this);
    this.getLayout = bind(this.getLayout, this);
    this.widget = $('.kits');
    if (this.widget.length === 0) {
      return;
    }
    this.header_height = $('body>header>.project').height();
    this.menu = this.widget.find('.kits__menu');
    this.buttons = this.menu.find('a');
    this.footer = $('body>footer');
    this.heads = $('.items__header');
    this.head_height = $(this.heads.get(0)).height();
    this.wrapper = this.menu.find('.kits__wrapper');
    this.getLayout();
    this.buttons.on('click', this.scrollTo);
    $(window).on('scroll', this.stickIt);
    $(window).on('resize', this.getLayout);
  }

  Kits.prototype.getLayout = function() {
    this.layout = 'desktop';
    if (Modernizr.mq('(max-width: 1120px)')) {
      this.layout = 'tablet';
    }
    if (Modernizr.mq('(max-width: 980px)')) {
      this.layout = 'mobile';
      this.menu.css('max-height', 'initial');
      this.widget.css('bottom', 'auto');
    }
    this.viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.links_width = this.wrapper.width();
    this.links_height = this.wrapper.height();
    return this.menu_top = $('.items__wrapper').offset().top;
  };

  Kits.prototype.stickIt = function() {
    var top, visible_footer;
    top = $('html').scrollTop();
    if (top + this.header_height >= this.menu_top) {
      this.widget.toggleClass('kits_stick', true);
      if (this.layout === 'desktop' || this.layout === 'tablet') {
        visible_footer = Math.max((top + this.viewport_height) - this.footer.offset().top, 0);
        this.menu.css('max-height', this.viewport_height - this.header_height - visible_footer - 48);
        this.widget.css('bottom', visible_footer + 'px');
      }
    } else {
      this.widget.toggleClass('kits_stick', false);
      this.menu.css('max-height', this.viewport_height - this.header_height);
      this.widget.css('bottom', 'auto');
    }
    return this.getCurrentKit();
  };

  Kits.prototype.getCurrentKit = function() {
    var bottom, head, i, id, last, len, level, link, menu_height, menu_width, ref;
    bottom = $('html').scrollTop() + this.viewport_height;
    last = null;
    ref = this.heads;
    for (i = 0, len = ref.length; i < len; i++) {
      head = ref[i];
      head = $(head);
      level = head.offset().top + this.head_height;
      if (bottom - level >= 0) {
        last = head.get(0);
      } else {
        break;
      }
    }
    if (last !== null) {
      id = last.parentNode.getAttribute('id');
      this.menu.find('.kits__kit_active').removeClass('kits__kit_active');
      link = this.menu.find('a[href="#' + id + '"]');
      link.addClass('kits__kit_active');
      menu_width = this.menu.width();
      menu_height = this.menu.height();
      if ((this.layout === 'mobile' && this.links_width > menu_width) || (this.layout !== 'mobile' && this.links_height > menu_height)) {
        window.clearTimeout(this.scroll_timer);
        return this.scroll_timer = window.setTimeout(this.scroll_menu, 100, link, menu_width, menu_height);
      }
    }
  };

  Kits.prototype.scroll_menu = function(link, menu_width, menu_height) {
    var link_height, link_left, link_top, link_width, scroll_left, scroll_top;
    if (this.layout === 'mobile') {
      scroll_left = this.menu.scrollLeft();
      link_left = link.offset().left;
      link_width = link.width();
      if (link_left < scroll_left || (link_left + link_width) > (scroll_left + menu_width)) {
        this.menu.scrollTop(0);
        return this.menu.stop().animate({
          scrollLeft: parseInt(link_left + link_width / 2 - menu_width / 2, 10) + 'px'
        }, 'fast');
      }
    } else {
      scroll_top = this.menu.scrollTop();
      link_top = link.offset().top - link.parent().offset().top;
      link_height = link.height();
      if ((link_top < scroll_top) || (link_top + link_height) > (scroll_top + menu_height)) {
        this.menu.scrollLeft(0);
        return this.menu.stop().animate({
          scrollTop: parseInt(link_top + link_height / 2 - menu_height / 2 + 15, 10) + 'px'
        }, 'fast');
      }
    }
  };

  Kits.prototype.scrollTo = function(event) {
    var element, target;
    event.preventDefault();
    element = $(event.currentTarget.getAttribute('href'));
    if (this.layout === 'mobile') {
      target = parseInt(element.offset().top - this.header_height - this.widget.height() - 20, 10);
    } else {
      target = parseInt(element.offset().top - this.header_height - 20, 10);
    }
    return $('html').stop().animate({
      scrollTop: target + 'px'
    }, 'fast');
  };

  return Kits;

})();

$(document).ready(function() {
  return new Kits;
});

var Layout,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Layout = (function() {
  function Layout() {
    this.unblockTransitions = bind(this.unblockTransitions, this);
    this.blockTransitions = bind(this.blockTransitions, this);
    this.html = $('html');
    this.timer = null;
    $(window).on('resize', this.blockTransitions);
  }

  Layout.prototype.blockTransitions = function() {
    if (!this.html.hasClass('resizing')) {
      this.html.addClass('resizing');
    }
    window.clearTimeout(this.timer);
    return this.timer = window.setTimeout(this.unblockTransitions, 250);
  };

  Layout.prototype.unblockTransitions = function() {
    return this.html.removeClass('resizing');
  };

  return Layout;

})();

$(document).ready(function() {
  return new Layout;
});

var Navigation,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Navigation = (function() {
  function Navigation() {
    this.toggleDropdown = bind(this.toggleDropdown, this);
    this.widget = $(".dropdown");
    if (this.widget.length === 0) {
      return;
    }
    this.title = this.widget.find(".dropdown__title");
    this.title.on('click', this.toggleDropdown);
  }

  Navigation.prototype.toggleDropdown = function() {
    return this.widget.toggleClass("dropdown_open");
  };

  return Navigation;

})();

$(document).ready(function() {
  return new Navigation;
});

var Sections,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Sections = (function() {
  function Sections() {
    this.toggleState = bind(this.toggleState, this);
    this.buttons = $(".page__section-button");
    if (this.buttons.length === 0) {
      return;
    }
    this.buttons.on('click', this.toggleState);
  }

  Sections.prototype.toggleState = function(event) {
    return $(event.currentTarget).toggleClass("page__section-button_open");
  };

  return Sections;

})();

$(document).ready(function() {
  return new Sections;
});

var Subscribe,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Subscribe = (function() {
  function Subscribe() {
    this.submitEmail = bind(this.submitEmail, this);
    this.closeConfirmPopup = bind(this.closeConfirmPopup, this);
    this.openConfirmPopup = bind(this.openConfirmPopup, this);
    this.closeInputPopup = bind(this.closeInputPopup, this);
    this.openInputPopup = bind(this.openInputPopup, this);
    this.openSharePopup = bind(this.openSharePopup, this);
    this.closeSharePopup = bind(this.closeSharePopup, this);
    this.button = $("body>header .subscribe");
    this.inputPopup = $(".subscribe-form-popup");
    this.inputPopupForm = this.inputPopup.find(".subscribe-form");
    this.inputPopupClose = this.inputPopup.find(".popup__close");
    this.inputPopupLightbox = this.inputPopup.find(".popup__lightbox");
    this.confirmPopup = $(".subscribe-confirmation-popup");
    this.confirmPopupClose = this.confirmPopup.find(".popup__close");
    this.confirmPopupLightbox = this.confirmPopup.find(".popup__lightbox");
    this.itemsSubscribeForm = $(".items-subscribe");
    this.shareButton = this.confirmPopup.find(".show-socials");
    this.sharePopup = $(".share-list-popup");
    this.sharePopupClose = this.sharePopup.find(".popup__close");
    this.sharePopupLightbox = this.sharePopup.find(".popup__lightbox");
    this.pageSubscribeButton = $(".page__subscribe");
    this.pageShareButton = $(".page__share");
    if (this.button.length + this.inputPopup.length + this.confirmPopup.length !== 3) {
      return;
    }
    this.button.on('click', this.openInputPopup);
    this.inputPopupClose.on('click', this.closeInputPopup);
    this.inputPopupLightbox.on('click', this.closeInputPopup);
    this.confirmPopupClose.on('click', this.closeConfirmPopup);
    this.confirmPopupLightbox.on('click', this.closeConfirmPopup);
    this.sharePopupClose.on('click', this.closeSharePopup);
    this.sharePopupLightbox.on('click', this.closeSharePopup);
    this.pageSubscribeButton.on('click', this.openInputPopup);
    this.inputPopupForm.on('submit', this.submitEmail);
    this.itemsSubscribeForm.on("submit", this.submitEmail);
    this.pageShareButton.on('click', this.openSharePopup);
    this.shareButton.on('click', this.openSharePopup);
  }

  Subscribe.prototype.closeSharePopup = function(event) {
    if (event) {
      event.preventDefault();
    }
    return this.sharePopup.fadeOut();
  };

  Subscribe.prototype.openSharePopup = function() {
    this.closeConfirmPopup();
    return this.sharePopup.fadeIn();
  };

  Subscribe.prototype.openInputPopup = function(event) {
    if (event) {
      event.preventDefault();
    }
    return this.inputPopup.fadeIn();
  };

  Subscribe.prototype.closeInputPopup = function(event) {
    if (event) {
      event.preventDefault();
    }
    return this.inputPopup.fadeOut((function(_this) {
      return function() {
        return _this.inputPopupForm[0].reset();
      };
    })(this));
  };

  Subscribe.prototype.openConfirmPopup = function() {
    return this.confirmPopup.fadeIn();
  };

  Subscribe.prototype.closeConfirmPopup = function(event) {
    if (event) {
      event.preventDefault();
    }
    return this.confirmPopup.fadeOut();
  };

  Subscribe.prototype.submitEmail = function(event) {
    var form;
    if (event) {
      event.preventDefault();
    }
    form = event.currentTarget;
    form.reset();
    this.closeInputPopup();
    return this.openConfirmPopup();
  };

  return Subscribe;

})();

$(document).ready(function() {
  return new Subscribe;
});

var Switcher,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Switcher = (function() {
  function Switcher(widget) {
    this.widget = widget;
    this.toggleState = bind(this.toggleState, this);
    this.filter = bind(this.filter, this);
    this.getStates = bind(this.getStates, this);
    this.buttons = this.widget.find('button[data-filter]');
    this.list = $('#' + this.widget.attr('data-target'));
    if (this.buttons.length === 0 || this.list.length !== 1) {
      return;
    }
    this.states = new Array;
    this.getStates();
    this.buttons.on('click', this.toggleState);
  }

  Switcher.prototype.getStates = function() {
    var button, i, len, ref;
    this.states = new Array;
    ref = this.widget.find('.switcher__selected');
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      this.states.push(button.getAttribute('data-filter'));
    }
    return this.filter();
  };

  Switcher.prototype.filter = function() {
    var tags;
    if (this.states.length === 0) {
      this.list.find('[data-label]').show();
      return;
    }
    tags = '[data-label~="' + this.states.join('"],[data-label~="') + '"]';
    this.list.find('[data-label]').hide();
    return this.list.find(tags).show();
  };

  Switcher.prototype.toggleState = function(event) {
    $(event.currentTarget).toggleClass("switcher__selected");
    return this.getStates();
  };

  return Switcher;

})();

$(document).ready(function() {
  var i, len, ref, results, switcher;
  ref = $('.switcher[data-target]');
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    switcher = ref[i];
    results.push(new Switcher($(switcher)));
  }
  return results;
});

;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b)&&c(b).matches||!1;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.cssanimations=function(){return J("animationName")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},Modernizr.addTest("boxsizing",function(){return Modernizr.testAllProps("boxSizing")&&(document.documentMode===undefined||document.documentMode>7)}),Modernizr.addTest("pointerevents",function(){var a=document.createElement("x"),b=document.documentElement,c=window.getComputedStyle,d;return"pointerEvents"in a.style?(a.style.pointerEvents="auto",a.style.pointerEvents="x",b.appendChild(a),d=c&&c(a,"").pointerEvents==="auto",b.removeChild(a),!!d):!1}),Modernizr.addTest("cssremunit",function(){var a=document.createElement("div");try{a.style.fontSize="3rem"}catch(b){}return/rem/.test(a.style.fontSize)}),Modernizr.addTest("cssvmaxunit",function(){var a;return Modernizr.testStyles("#modernizr { width: 50vmax; }",function(b,c){var d=window.innerWidth/100,e=window.innerHeight/100,f=parseInt((window.getComputedStyle?getComputedStyle(b,null):b.currentStyle).width,10);a=parseInt(Math.max(d,e)*50,10)==f}),a}),Modernizr.addTest("cssscrollbar",function(){var a,b="#modernizr{overflow: scroll; width: 40px }#"+Modernizr._prefixes.join("scrollbar{width:0px} #modernizr::").split("#").slice(1).join("#")+"scrollbar{width:0px}";return Modernizr.testStyles(b,function(b){a="scrollWidth"in b&&b.scrollWidth==40}),a}),Modernizr.addTest("cssvhunit",function(){var a;return Modernizr.testStyles("#modernizr { height: 50vh; }",function(b,c){var d=parseInt(window.innerHeight/2,10),e=parseInt((window.getComputedStyle?getComputedStyle(b,null):b.currentStyle).height,10);a=e==d}),a}),Modernizr.addTest("cssvminunit",function(){var a;return Modernizr.testStyles("#modernizr { width: 50vmin; }",function(b,c){var d=window.innerWidth/100,e=window.innerHeight/100,f=parseInt((window.getComputedStyle?getComputedStyle(b,null):b.currentStyle).width,10);a=parseInt(Math.min(d,e)*50,10)==f}),a}),Modernizr.addTest("filereader",function(){return!!(window.File&&window.FileList&&window.FileReader)}),Modernizr.addTest("fileinput",function(){var a=document.createElement("input");return a.type="file",!a.disabled}),Modernizr.addTest("formattribute",function(){var a=document.createElement("form"),b=document.createElement("input"),c=document.createElement("div"),d="formtest"+(new Date).getTime(),e,f=!1;return a.id=d,document.createAttribute&&(e=document.createAttribute("form"),e.nodeValue=d,b.setAttributeNode(e),c.appendChild(a),c.appendChild(b),document.documentElement.appendChild(c),f=a.elements.length===1&&b.form==a,c.parentNode.removeChild(c)),f}),Modernizr.addTest("placeholder",function(){return"placeholder"in(Modernizr.input||document.createElement("input"))&&"placeholder"in(Modernizr.textarea||document.createElement("textarea"))}),function(a,b){b.formvalidationapi=!1,b.formvalidationmessage=!1,b.addTest("formvalidation",function(){var c=a.createElement("form");if("checkValidity"in c&&"addEventListener"in c){if("reportValidity"in c)return!0;var d=!1,e;return b.formvalidationapi=!0,c.addEventListener("submit",function(a){window.opera||a.preventDefault(),a.stopPropagation()},!1),c.innerHTML='<input name="modTest" required><button></button>',b.testStyles("#modernizr form{position:absolute;top:-99999em}",function(a){a.appendChild(c),e=c.getElementsByTagName("input")[0],e.addEventListener("invalid",function(a){d=!0,a.preventDefault(),a.stopPropagation()},!1),b.formvalidationmessage=!!e.validationMessage,c.getElementsByTagName("button")[0].click()}),d}return!1})}(document,window.Modernizr),Modernizr.addTest("cssvwunit",function(){var a;return Modernizr.testStyles("#modernizr { width: 50vw; }",function(b,c){var d=parseInt(window.innerWidth/2,10),e=parseInt((window.getComputedStyle?getComputedStyle(b,null):b.currentStyle).width,10);a=e==d}),a});
