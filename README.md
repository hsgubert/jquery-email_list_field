JQuery EmailListField.js
=========

Creates editable form field for email lists using jquery and jquery-ui.

## Install

Bower:

    bower install jquery-email_list_field --save


## How it works

### Basic Functionality
EmailListField allows you to create a field in your forms that accept an email list input. Each email added contains a hidden input with a configurable name of `emails[]` by default so your server can easily read each email.
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple.gif)
```html
<div id="mailing_list_container"></div>
<script>
  $('#mailing_list_container').emailListField();
</script>
```

### Suports Name + Email Format
 Users can write their emails also in the "Name <email>" format.
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-with_name.gif)

### Autocomplete
EmailListField can optionally show auto-complete options, if you pass it a list of known emails:
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/02-autocomplete/02-autocomplete.gif)
```html
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

### Email Validation
Emails are validated before they are added to the list:
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-invalid_email.gif)

### Duplicate Detection
You can also prevent duplicates (but you can also disable this check):
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-duplicate_detection.gif)

### Custom Styling
EmailListField has configurable callbacks that allow you to add custom styles depending on the email added, or do any other related action when an emails is added or removed.
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/04-special_styling/04-special_styling.gif)
```html
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

### Pasting Email Lists
You can also paste email lists that the emails are split either on commas or semi-colons:
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/04-special_styling/04-special_styling-pasting.gif)

### Removing Emails
You can remove emails from list either pressing backspace or by clicking on the 'x' right to each email:
![](https://github.com/hsgubert/jquery-email_list_field/raw/master/examples/01-simple/01-simple-removing_emails.gif)

---

## Dependencies
The lib depends on:
* jquery v1.12
* jquery-ui v1.11
* Taggle.js v1.11.1

It might as well work with newer jquery and jquery-ui versions (I welcome anyone willing to test it).

# Reference
To activate EmailListField, select an empty div in your document and call the JQuery extension:
```javascript
$('#some-empty-div').emailListField(options={});
```

The available options are:

| Option        | Expected value | Default | Description  |
| ------------- | -------------- | ------- | ------------ |
|  knownFormattedEmails | Array[String] | [] | List of known emails for autocomplete purposes. Emails can be provided as is or in the "Name Lastname <email>" format |

## License

MIT © [Henrique Gubert](https://github.com/hsgubert)
