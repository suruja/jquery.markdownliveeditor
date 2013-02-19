(($) ->
  converter = new Markdown.Converter()

  $.fn.moveCaret = (pos) ->
    pos = if pos is undefined then 0 else parseInt(pos)
    $this = $(@)
    $this.prop 'selectionStart', pos
    $this.prop 'selectionEnd', pos

  $.fn.textareaToHtml = (callback) ->
    setTimeout =>
      $this = $(@)
      textareaValue = $this.val()
      if _(textareaValue).isEmpty()
        $this.remove()
      else
        htmlElem = $(converter.makeHtml(textareaValue))
        htmlElem.data 'markdown', textareaValue
        replaceable = true
        for tag in ['ul', 'ol', 'pre', 'code', 'blockquote']
          if htmlElem.is(tag) and (prev = $this.prev(tag)).length > 0
            prev.append htmlElem.children()
            prev.data 'markdown', "#{prev.data('markdown')}\n#{textareaValue}"
            $this.remove()
            replaceable = false
            break
        if replaceable
          $this.replaceWith htmlElem
        unless callback is undefined
          callback htmlElem
    , 0

  $.fn.htmlToTextarea = (callback) ->
    setTimeout =>
      $this = $(@)
      text = $this.data 'markdown'
      unless text is undefined
        caret = $this.data 'caret'
        newTextarea = $("<textarea>#{text}</textarea>")
        for style in ['padding', 'margin']
          newTextarea.css style, $this.css(style)
        $this.replaceWith newTextarea
        newTextarea.focus()
        newTextarea.moveCaret caret
    , 0

  $.fn.prevFocus = (callback) ->
    $this = $(@)
    prev = $this.prev()
    if prev.length > 0
      futureCaret = (prev.data('markdown') || '').length
      prev.data 'caret', futureCaret
      if callback isnt undefined
        callback prev
      prev.click()

  $.fn.nextFocus = (callback) ->
    $this = $(@)
    next = $this.next()
    if next.length > 0
      if callback isnt undefined
        callback next
      next.click()


  $.fn.markdownContent = ->
    $.trim _($(@).children().not('textarea')).reduce ((memo, e) ->
      memo + $(e).data("markdown") + "\n\n"
    ), ""

  $.fn.markdownLiveEditor = (options) ->
    options = {} if options is undefined
    selector = '.markdownLiveEditor'

    $(document).on 'paste', "#{selector} textarea", (e) ->
      $this = $(@)
      setTimeout ->
        value = $this.val()
        while (caret = value.indexOf("\n")) isnt -1
          textarea = $("<textarea>#{value.substr(0, caret)}</textarea>")
          textarea.insertBefore($this)
          textarea.blur()
          value = value[(caret+1)..-1]
          $this.val value
      , 0

    $(document).on 'keypress', "#{selector} textarea", (e) ->
      $this = $(@)
      keyCode = e.keyCode or e.which
      switch keyCode
        when 13
          e.preventDefault()
          caret = $this.prop("selectionStart")
          $("<textarea>#{@value.substr(0, caret)}</textarea>").insertBefore($this).blur()
          $this.val @value.substr(caret, @value.length)
          $this.moveCaret 0


    $(document).on 'keydown', "#{selector} textarea", (e) ->
      $this = $(@)
      keyCode = e.keyCode or e.which
      if _([37, 38, 39, 40, 8, 46]).contains keyCode
        caret = $this.prop("selectionStart")
        switch keyCode
          when 37
            if caret is 0
              $this.prevFocus()
          when 38
            if caret is 0
              $this.prevFocus()
          when 8
            if caret is 0
              $this.prevFocus (prev) =>
                prev.data('markdown', prev.data('markdown') + @value)
                $this.val ''
          when 39
            if caret is @value.length
              $this.nextFocus()
          when 40
            if caret is @value.length
              $this.nextFocus()
          when 46
            if caret is @value.length
              $this.nextFocus (next) =>
                next.data('markdown', @value + next.data('markdown'))
                $this.val ''

    $(document).on 'click', "#{selector} *:not(.textarea)", ->
      $(@).htmlToTextarea(options.onfocus)

    $(document).on 'focusin', "#{selector} textarea", ->
      setTimeout =>
        $(@).autosize()
      , 0

    $(document).on 'focusout', "#{selector} textarea", ->
      $(@).textareaToHtml(options.onblur)

    $this = $(@)
    $this.wrap $("<div class='markdownLiveEditor'></div>")
    $this.trigger 'paste'
    editor = $(selector)
    textarea = editor.find('textarea')
    textarea.focus()

) jQuery
