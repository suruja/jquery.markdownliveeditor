// Generated by CoffeeScript 1.4.0
(function() {

  (function($) {
    var converter;
    converter = new Markdown.Converter();
    $.fn.moveCaret = function(pos) {
      var $this;
      pos = pos === void 0 ? 0 : parseInt(pos);
      $this = $(this);
      $this.prop('selectionStart', pos);
      return $this.prop('selectionEnd', pos);
    };
    $.fn.textareaToHtml = function(callback) {
      var _this = this;
      return setTimeout(function() {
        var $this, htmlElem, prev, replaceable, tag, textareaValue, _i, _len, _ref;
        $this = $(_this);
        textareaValue = $this.val();
        if (_(textareaValue).isEmpty()) {
          return $this.remove();
        } else {
          htmlElem = $(converter.makeHtml(textareaValue));
          htmlElem.data('markdown', textareaValue);
          replaceable = true;
          _ref = ['ul', 'ol', 'pre', 'code', 'blockquote'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            tag = _ref[_i];
            if (htmlElem.is(tag) && (prev = $this.prev(tag)).length > 0) {
              prev.append(htmlElem.children());
              prev.data('markdown', "" + (prev.data('markdown')) + "\n" + textareaValue);
              $this.remove();
              replaceable = false;
              break;
            }
          }
          if (replaceable) {
            $this.replaceWith(htmlElem);
          }
          if (callback !== void 0) {
            return callback(htmlElem);
          }
        }
      }, 0);
    };
    $.fn.htmlToTextarea = function(callback) {
      var _this = this;
      return setTimeout(function() {
        var $this, caret, newTextarea, style, text, _i, _len, _ref;
        $this = $(_this);
        text = $this.data('markdown');
        if (text !== void 0) {
          caret = $this.data('caret');
          newTextarea = $("<textarea>" + text + "</textarea>");
          _ref = ['padding', 'margin'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            style = _ref[_i];
            newTextarea.css(style, $this.css(style));
          }
          $this.replaceWith(newTextarea);
          newTextarea.focus();
          return newTextarea.moveCaret(caret);
        }
      }, 0);
    };
    $.fn.prevFocus = function(callback) {
      var $this, futureCaret, prev;
      $this = $(this);
      prev = $this.prev();
      if (prev.length > 0) {
        futureCaret = (prev.data('markdown') || '').length;
        prev.data('caret', futureCaret);
        if (callback !== void 0) {
          callback(prev);
        }
        return prev.click();
      }
    };
    $.fn.nextFocus = function(callback) {
      var $this, next;
      $this = $(this);
      next = $this.next();
      if (next.length > 0) {
        if (callback !== void 0) {
          callback(next);
        }
        return next.click();
      }
    };
    $.fn.markdownContent = function() {
      return $.trim(_($(this).children().not('textarea')).reduce((function(memo, e) {
        return memo + $(e).data("markdown") + "\n\n";
      }), ""));
    };
    return $.fn.markdownLiveEditor = function(options) {
      var $this, editor, selector, textarea;
      if (options === void 0) {
        options = {};
      }
      selector = '.markdownLiveEditor';
      $(document).on('paste', "" + selector + " textarea", function(e) {
        var $this;
        $this = $(this);
        return setTimeout(function() {
          var caret, textarea, value, _results;
          value = $this.val();
          _results = [];
          while ((caret = value.indexOf("\n")) !== -1) {
            textarea = $("<textarea>" + (value.substr(0, caret)) + "</textarea>");
            textarea.insertBefore($this);
            textarea.blur();
            value = value.slice(caret + 1);
            _results.push($this.val(value));
          }
          return _results;
        }, 0);
      });
      $(document).on('keypress', "" + selector + " textarea", function(e) {
        var $this, caret, keyCode;
        $this = $(this);
        keyCode = e.keyCode || e.which;
        switch (keyCode) {
          case 13:
            e.preventDefault();
            caret = $this.prop("selectionStart");
            $("<textarea>" + (this.value.substr(0, caret)) + "</textarea>").insertBefore($this).blur();
            $this.val(this.value.substr(caret, this.value.length));
            return $this.moveCaret(0);
        }
      });
      $(document).on('keydown', "" + selector + " textarea", function(e) {
        var $this, caret, keyCode,
          _this = this;
        $this = $(this);
        keyCode = e.keyCode || e.which;
        if (_([37, 38, 39, 40, 8, 46]).contains(keyCode)) {
          caret = $this.prop("selectionStart");
          switch (keyCode) {
            case 37:
              if (caret === 0) {
                return $this.prevFocus();
              }
              break;
            case 38:
              if (caret === 0) {
                return $this.prevFocus();
              }
              break;
            case 8:
              if (caret === 0) {
                return $this.prevFocus(function(prev) {
                  prev.data('markdown', prev.data('markdown') + _this.value);
                  return $this.val('');
                });
              }
              break;
            case 39:
              if (caret === this.value.length) {
                return $this.nextFocus();
              }
              break;
            case 40:
              if (caret === this.value.length) {
                return $this.nextFocus();
              }
              break;
            case 46:
              if (caret === this.value.length) {
                return $this.nextFocus(function(next) {
                  next.data('markdown', _this.value + next.data('markdown'));
                  return $this.val('');
                });
              }
          }
        }
      });
      $(document).on('click', "" + selector + " *:not(.textarea)", function() {
        return $(this).htmlToTextarea(options.onfocus);
      });
      $(document).on('focusin', "" + selector + " textarea", function() {
        var _this = this;
        return setTimeout(function() {
          return $(_this).autosize();
        }, 0);
      });
      $(document).on('focusout', "" + selector + " textarea", function() {
        return $(this).textareaToHtml(options.onblur);
      });
      $this = $(this);
      $this.wrap($("<div class='markdownLiveEditor'></div>"));
      $this.trigger('paste');
      editor = $(selector);
      textarea = editor.find('textarea');
      return textarea.focus();
    };
  })(jQuery);

}).call(this);
