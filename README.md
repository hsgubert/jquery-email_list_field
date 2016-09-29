JQuery EmailListField.js
=========

Creates editable form field for email lists using jquery and jquery-ui.

## Install

Bower:

    bower install jquery-email_list_field --save


## How it works

EmailListField allows you to create a field in your forms that accept an email list input:

![](gif here)

Each email added contains a hidden input with a configurable name of `emails[]` by default so your server can easily read each email. Users can write their emails also in the "Name <email>" format.

![](gif here)

EmailListField can optionally show auto-complete options, if you pass it a list of known emails:

![](gif here)

EmailListField has configurable callbacks that allow you to add custom styles depending on the email added, or do any other related action when an emails is added or removed.
![](gif here)

## Dependencies
The lib was developed using
* jquery v1.12
* jquery-ui v1.11

It might as well work with newer jquery and jquery-ui versions (I welcome anyone willing to test it).

## License

MIT © [Henrique Gubert](https://github.com/hsgubert)
