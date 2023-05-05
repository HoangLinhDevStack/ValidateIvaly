function getConfirmEmail() { // Take values from #email
    return document.querySelector('#form-1 #email').value
}

// function checked value day of each month is leap Year

function isLeapYear(yearValue) {
    return yearValue % 4 === 0 && (yearValue % 100 !== 0 || yearValue % 400 === 0) ? true : false
}

Validator({
    form: '#form-1',

    // properties elements
    errorElementFormGenders: '.formGender--message',
    formGendersElementSelect: '.select-gender',

    // properties messages
    errorMessage: '.form-message--notice',
    errorMessageDate: '.form-group__Date-container .form-message__date-container',
    errorMessageGenders: '.form-messageGender--notice',

    rules: [
        // deal with email
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),

        // deal with email confirmation
        Validator.isRequired('#confirmation-email'),
        Validator.isConfirmEmail('#confirmation-email'),

        // deal with password
        Validator.isRequired('#password'),
        Validator.isPassword('#password' , 6),

        // deal with how can I call yourself
        Validator.isCallYourName('#call-yourname'),

    ],
    
    ruleDates: [
        // deal with date format
        Validator.isDateDay('#date-day'),
        Validator.isDateMonth('#date-month'),
        Validator.isDateYear('#date-year')
    ],

    ruleChooseGenders: [
        Validator.isGenders('input[name="gender"]')
    ],
     
    onSubmit: function(data) {
        console.log(data)
    }
})