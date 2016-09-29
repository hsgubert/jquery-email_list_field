////////////////////////////////////////////////////////////////////////////////
// jquery-email_list_field.js
// Author: @hsgubert - Henrique Gubert
////////////////////////////////////////////////////////////////////////////////

// JQuery plugin. Examples:
// $('#email-list-field').emailListField();
// $('#email-list-field').emailListField({ lowerEmailAddressCase: false });
//
// For reference of available options see DEFAULT_OPTIONS definition
//
$.fn.emailListField = function(options) {
  var containerId = this.attr('id');

  if (!containerId) {
    containerId = 'email-list-field-container';
    this.attr('id', containerId);
  }

  return new EmailListField(containerId, options);
};


// Class definition
var EmailListField = function() {
  //////////////////////////////////////////////////////////////////////////////
  // Static constants
  //////////////////////////////////////////////////////////////////////////////

  var DEFAULT_OPTIONS = {

    /**
     * List of known emails for autocomplete purposes. Emails can be provided
     * as is or in the "Name Lastname <email>" format
     * @type {Array[String]}
     */
    knownFormattedEmails: [],

    /**
     * List of emails that are initialized in the field. Emails can be provided
     * as is or in the "Name Lastname <email>" format
     * @type {Array[String]}
     */
    initialEmails: [],

    /**
     * Name of the input fields. One hidden input is generated for each email in list
     * @type {String}
     */
    inputName: 'emails[]',

    /**
     * If true email addresses will be downcased when added. This does not affect
     * name when email is added in the "Name <email>" format.
     * @type {Boolean}
     */
    lowerEmailAddressCase: true,

    /**
     * If false emails already in list will not be added
     * @type {Boolean}
     */
    allowDuplicateEmails: false,

    /**
     * If defined, a message tooltip appears when user tries to add duplicate emails
     * The message is in the format "%{email} %{duplicatedEmailMessage}"
     * @type {Boolean}
     */
    duplicatedEmailMessage: 'is already on this email list',

    /**
     * If defined, a message tooltip appears when user tries to add invalid emails
     * The message is in the format "%{email} %{duplicatedEmailMessage}"
     * @type {String}
     */
    invalidEmailMessage: 'is not a valid email address',

    /**
    * The message shown as placeholder in the field when there are no emails
    * @type {String}
    */
    placeholderMessage: 'Insert email list here',

    /**
     * Function that receives both the complete tag text and only the email and
     * optionally returns a string with css classes to be added to the specific
     * tag. If the option lowerEmailAddressCase is set, the function will receive
     * the email already downcased.
     * @type {function returning String}
     */
    extraTagClassFunction: function(text, email) {},

    /**
     * Function called after each adition or removal of email. It is passed an
     * array of emails (strings) exactly as shown to the user. This callback is
     * designed to do actions that depend on the current state os the email list field
     * @type {function}
     */
    afterChangeCallback: function(formatted_emails) {}
  };

  // Email validation and extraction
  // Email validation regexp: not the most restrictive regexp, but it does the trick
  // Obs: it allows up case characters on email because we downcase them later, depending on option lowerEmailAddressCase
  var emailRegexpString = "[-a-z0-9~!$%^&*_=+}{\\'?]+(\\.[-a-z0-9~!$%^&*_=+}{\\'?]+)*@([a-z0-9_][-a-z0-9_]*(\\.[-a-z0-9_]+)*\\.([a-z][a-z]+)|([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}))(:[0-9]{1,5})?";
  var EMAIL_REGEXP = new RegExp('^' + emailRegexpString + '$', 'i');
  var NAME_AND_EMAIL_REGEXP = new RegExp('^[^<>]*<' + emailRegexpString + '>$', 'i');
  var EMAIL_EXTRACTION_REGEXP = new RegExp('^([^<>]*)<(.+)>$');

  //////////////////////////////////////////////////////////////////////////////
  // Constructor
  //////////////////////////////////////////////////////////////////////////////

  var emailListFieldConstructor = function(containerId, options) {
    this.containerId = containerId;
    this.options = $.extend(DEFAULT_OPTIONS, options);
    this._initAttributes();

    // Taggle is the ui lib used to implement the "tagging effect" when you
    // finish writting an email
    this._initTaggle();

    this._prepopulateTaggle();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Object public functions
  //////////////////////////////////////////////////////////////////////////////

  emailListFieldConstructor.prototype.addEmail = function(email_or_emails) {
    this.taggleObject.add(email_or_emails);
  }

  emailListFieldConstructor.prototype.removeEmail = function(email) {
    this.taggleObject.remove(email, true);
  }

  emailListFieldConstructor.prototype.clear = function() {
    this.taggleObject.removeAll();
  }

  emailListFieldConstructor.prototype.getEmails = function() {
    return this.taggleObject.getTags().values;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Object private functions
  //////////////////////////////////////////////////////////////////////////////


  // Initialization of necessary attributes
  emailListFieldConstructor.prototype._initAttributes = function() {
    // Creates array to keep track of current emails on taggle, for purposes of detecting duplicates
    // We create this list to keep track of just the emails (without names)
    this.emailsOnTaggle = [];
  };

  // Runs when user tries to add email with invalid format
  // It will show a message tooltip if invalidEmailMessage is defined, otherwise does nothing
  // Needs to receive taggle so it can show tooltip anchored to it
  emailListFieldConstructor.prototype._onInvalidEmailCallback = function(invalidEmail) {
    if (this.options.invalidEmailMessage) {
      var input = this.taggleObject.getInput();

      // shows tooltip for 3 seconds
      $(input).
        attr("title", "\"" + invalidEmail + "\" " + this.options.invalidEmailMessage).
        tooltip("open");

      setTimeout(function() {
        $(input).
          tooltip("close").
          attr( "title", "" );
      }, 3000);
    }
  }

  // Runs when user tries to add duplicated email to list, and allowDuplicateEmails is false
  // It will show a message tooltip if duplicatedEmailMessage is defined, otherwise does nothing
  emailListFieldConstructor.prototype._onDuplicatedEmailsCallback = function(email) {
    if (this.options.duplicatedEmailMessage) {
      var input = this.taggleObject.getInput();

      // shows tooltip for 3 seconds
      $(input).
        attr("title", "\"" + email + "\" " + this.options.duplicatedEmailMessage).
        tooltip("open");

      setTimeout(function() {
        $(input).
          tooltip("close").
          attr( "title", "" );
      }, 3000);
    }
  };

  // Extracts email from either a string with an email or a string with a name
  // and an email, like: Compound Name <email@domain.com>
  // Returns null if format is invalid
  emailListFieldConstructor.prototype._extractEmail = function(text) {
    var trimmedText = text.trim();
    if (EMAIL_REGEXP.test(trimmedText)) {
      var email = trimmedText;
    } else if (NAME_AND_EMAIL_REGEXP.test(text)) {
      var email = trimmedText.match(EMAIL_EXTRACTION_REGEXP)[2];
    } else {
      return null;
    }

    return (this.options.lowerEmailAddressCase ? email.toLowerCase(): email);
  };

  // Pre-processes email or name + email, downcasing email address if necessary
  emailListFieldConstructor.prototype._normalizeEmail = function(text) {
    var newText = text.trim();

    if (this.options.lowerEmailAddressCase) {
      if (EMAIL_REGEXP.test(newText)) {
        newText = newText.toLowerCase();
      }
      else {
        var matchdata = newText.match(EMAIL_EXTRACTION_REGEXP);
        var name = matchdata[1].trim();
        var email = matchdata[2].toLowerCase().trim();
        newText = name + ' <' + email + '>'
      }
    }

    return newText;
  };

  // Checks if email is authorized to be added. It checks if email is valid and if not duplicated
  emailListFieldConstructor.prototype._isEmailValidAndUnique = function(text) {
    var email = this._extractEmail(text);

    // prevents invalid email format
    if (email == null) {
      this._onInvalidEmailCallback(text);
      return false;
    }

    // prevents duplicated email
    if (this.options.allowDuplicateEmails || !this._includesEmail(email)) {
      return true;
    }
    else {
      this._onDuplicatedEmailsCallback(email);
      return false;
    };
  }

  // Checks wether email is currently in the list
  emailListFieldConstructor.prototype._includesEmail = function(email) {
    return this.emailsOnTaggle.indexOf(email) > -1
  }

  // Adds email to the list used to detect duplicates. It accepts text in the format "Name <email>" too
  emailListFieldConstructor.prototype._recordEmailAdded = function(text) {
    var email = this._extractEmail(text);
    this.emailsOnTaggle.push(email);
  }

  // Removes email from the list used to detect duplicates. It accepts text in the format "Name <email>" too
  emailListFieldConstructor.prototype._recordEmailRemoved = function(text) {
    var email = this._extractEmail(text);
    var emailIndex = this.emailsOnTaggle.indexOf(email);
    if (emailIndex > -1) {
      this.emailsOnTaggle.splice(emailIndex, 1);
    }
  }

  // if add extra classes to tags, depending on the return of the options.extraTagClassFunction
  emailListFieldConstructor.prototype._addExtraTagClassIfNecessary = function(text, li) {
    var email = this._extractEmail(text);
    var extraClasses = this.options.extraTagClassFunction(text, email);
    if (extraClasses && extraClasses.length > 0) {
      $(li).addClass(extraClasses);
    }
  }

  // Checks wether email is known
  emailListFieldConstructor.prototype._knowsEmail = function(email) {
    return this.knownEmails.indexOf(email) > -1
  }

  // Initializes taggle, the lib that implements the tagging effect on the email
  // list field.
  emailListFieldConstructor.prototype._initTaggle = function() {
    // creates scoped variable so we can acccess emailListField inside the taggle callbacks
    var emailListField = this;

    // adds taggle class to container
    $('#' + this.containerId).addClass('taggle');

    this.taggleObject = new Taggle(this.containerId, {
      delimeter: new RegExp('[,;]'),    // splits emails on commas and semicolons (passing regexps here is not documented on taggle, but works)
      submitKeys: [44, 9, 13, 27, 186], // keycodes: 9 (tab), 13 (enter), 27 (esc), 35 (end), 186 (semicolon). Ons: cannot use 188 (comma) because it is also de key of '<', which is a necessary character for emails with name
      saveOnBlur: true,                 // tries to save the tag when user clicks away
      hiddenInputName: this.options.inputName, // how the parameters are going to be submitted
      placeholder: this.options.placeholderMessage, // message to show when there are no emails on list
      allowDuplicates: true, // we implement our own duplicate detection, based on the email address only
      preserveCase: true, // we deal with the case separately
      tabIndex: 0, // makes tab select field in form

      // prepares input element to show tooltip (for validation or duplicate messages)
      inputFormatter: function(input) {
        $(input).tooltip({position: {my:'left top', at: 'left bottom'}});
      },

      // prevents invalid or duplicated emails from being added to the list
      onBeforeTagAdd: function(event, tag) {
        return emailListField._isEmailValidAndUnique(tag);
      },

      // Formats the tag, normalizing email address and adding extra classes
      tagFormatter: function(li) {
        var text = $(li).find('.taggle_text').text();

        // trims and downcases email (even when in format Name <email>)
        text = emailListField._normalizeEmail(text);

        // changes li and hidden input with new text
        $(li).find('.taggle_text').text(text);
        $(li).find('input[type="hidden"]').val(text);

        emailListField._addExtraTagClassIfNecessary(text, li);

        return li;
      },

      // records tags that are added, so to know if new candidate tags are duplicate
      onTagAdd: function(event, tag) {
        emailListField._recordEmailAdded(tag);
        emailListField.options.afterChangeCallback(emailListField.getEmails());
      },

      // remove emails from list, so we don't think it is a duplicate if added again
      onTagRemove: function(event, tag) {
        emailListField._recordEmailRemoved(tag);
        emailListField.options.afterChangeCallback(emailListField.getEmails());
      }
    });

    // If knownFormattedEmails has elements, activate JQueryUI autocomplete
    if (this.options.knownFormattedEmails.length > 0) {
      var taggle = this.taggleObject;
      $(this.taggleObject.getInput()).autocomplete({
        source: this.options.knownFormattedEmails,
        appendTo: this.taggleObject.getContainer(),
        position: { at: "left bottom", of: this.taggleObject.getContainer() },
        select: function(event, data) {
          event.preventDefault();

          // Add the tag only when the user clicks on autocomplete. If user selects
          // another way (E.g.: down + enter/tab) the text will already be added as it
          // is autocompleted on the input and added by taggle automatically
          if (data && data.item && event.which == 1) {
            taggle.add(data.item.value);
          }
        }
      });
    }
  }

  emailListFieldConstructor.prototype._prepopulateTaggle = function() {
    for (var i=0; i<this.options.initialEmails.length; i++) {
      this.addEmail(this.options.initialEmails[i]);
    }
  }

  // returns contructor and calls the function so EmailListField is defined immediately
  return emailListFieldConstructor;
}();
