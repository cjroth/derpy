(function($) {

  $.render = function(template, locals, done) {

    locals = locals || {};

    locals.template = template;

    $.get('/render', locals, function(html) {
      done(undefined, html);
    });

  };

  $.renderModal = function(template, locals, done) {
    $.render(template, locals, function(err, html) {
      var $modal = $(html).modal('show');
      if (done) done(err, $modal);
    });
  };

  $.fn.render = function(template, locals, done) {
    return this.each(function() {
      var $element = $(this);
      $.render(template, locals, function(err, html) {
        $element.html(html);
        if (done) done(err, html);
      });

    });
  };

})(jQuery);