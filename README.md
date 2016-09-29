JQuery EmailListField.js
=========

Creates editable form field for email lists using jquery and jquery-ui.

## Install

Bower:

    bower install jquery-email_list_field --save


## How it works

EmailListField allows you to create a field in your forms that accept an email list input:

![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple.gif)
```
<div id="mailing_list_container"></div>
<script>
  $('#mailing_list_container').emailListField();
</script>
```

Each email added contains a hidden input with a configurable name of `emails[]` by default so your server can easily read each email. Users can write their emails also in the "Name <email>" format.

![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-with_name.gif)

EmailListField can optionally show auto-complete options, if you pass it a list of known emails:

![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/02-autocomplete/02-autocomplete.gif)
```
<div id="mailing_list_container"></div>
<script>
$('#mailing_list_container').emailListField({
  knownFormattedEmails: [
    'Known Contact <some@email.com>',
    'Another Known Contact <some@other.email.com>',
    'known@email.com'
  ]
});
</script>
```

Emails are validated before they are added to the list:

![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-invalid_email.gif)

You can also prevent duplicates (but you can also disable this check):

![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-duplicate_detection.gif)

EmailListField has configurable callbacks that allow you to add custom styles depending on the email added, or do any other related action when an emails is added or removed.
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/04-special_styling/04-special_styling.gif)
```
<div id="mailing_list_container"></div>
<script>
  $('#mailing_list_container').emailListField({
    extraTagClassFunction: function(text, email) {
      if (email.includes('blue'))
        return 'blue';
      else if (email.includes('red'))
        return 'red';
      else if (email.includes('green'))
        return 'green';
    },
  });
</script>
```

You can also paste email lists that the emails are split either on commas or semi-colons:
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/04-special_styling/04-special_styling-pasting.gif)

You can remove emails from list either pressing backspace or by clicking on the 'x' right to each email:
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-removing_emails.gif)

## Dependencies
The lib was developed using
* jquery v1.12
* jquery-ui v1.11

It might as well work with newer jquery and jquery-ui versions (I welcome anyone willing to test it).

## License

MIT © [Henrique Gubert](https://github.com/hsgubert)
