(function($) {

  $.fn.JSON = function() {
    return $.parseJSON(this.first().text());
  };

  $.allJSON = function() {
    $('[type="application/json"][data-global]').each(function() {
      var $element = $(this).first();
      var globalVariableName = $element.data('global');
      window[globalVariableName] = $element.JSON();
    });
  };

})(jQuery);