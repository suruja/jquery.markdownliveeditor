# Markdown Live Editor

## Demo
Visit [http://markdownliveeditor.herokuapp.com](http://markdownliveeditor.herokuapp.com)

## Installation
This plugin depends on several scripts: [jQuery](http://jquery.com/), [UnderscoreJS](http://underscorejs.org/), [jQuery Autosize](https://github.com/jackmoore/autosize) and [Markdown.Converter](http://code.google.com/p/pagedown/wiki/PageDown). Please include these dependencies in your page before loading the plugin:
```
<link href="https://raw.github.com/suruja/jquery.markdownliveeditor/master/jquery.markdownliveeditor.css" media="all" rel="stylesheet" type="text/css">

<script src="https://raw.github.com/documentcloud/underscore/master/underscore-min.js" type="text/javascript"></script>
<script src="https://raw.github.com/jackmoore/autosize/master/jquery.autosize-min.js" type="text/javascript"></script>
<script src="http://pagedown.googlecode.com/hg/Markdown.Converter.js" type="text/javascript"></script>

<script src="https://raw.github.com/suruja/jquery.markdownliveeditor/master/jquery.markdownliveeditor.js" type="text/javascript"></script>
```

## Usage
```
<script type="text/javascript">
  $(document).ready(function() {
    $('.page').markdownLiveEditor();
  });
</script>

<textarea class="page"></textarea>
```

## API
```
  $('.page').markdownContent()
```

## Contributing
This plugin is not perfect (at all). Don't hesitate to fork the project and send me your pull request to improve the project.
