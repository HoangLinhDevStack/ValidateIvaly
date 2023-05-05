function Validator(options) {

    // deal with blur event of validate 
    function Validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorMessage)
        var errorMessage
        var rules = takeElementRules[rule.selector]

        if (rules) { // check rules before using length
            var rulesLength = rules.length // number of each element in rules
            for (var i = 0; i < rulesLength; i++) {
                errorMessage = rules[i](inputElement.value)
                if (errorMessage) break
            }
        }

        if (errorMessage && errorElement !== null) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else if (errorElement !== null) {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage

    }


    // deal with blur event of date validate
    function ValidateDate(inputElementDates, ruleDate) {
        var errorMessageDate = ruleDate.test(inputElementDates.value)
        var errorMessageDateId = ruleDate.selector

        var elementChildRuleDates = inputElementDates.parentElement.parentElement.parentElement.querySelectorAll(options.errorMessageDate + ' > *')

        if (errorMessageDate) {
            inputElementDates.parentElement.classList.add('invalid')

            elementChildRuleDates.forEach(function (childRudeDate, index) { // loop through child to add error message

                switch (index) {
                    case 0:
                        if (errorMessageDateId === '#date-day') {
                            errorMessageDate = errorMessageDateDayUsers
                        } else {
                            return // skip this iteration if no error should be shown
                        }
                        break
                    case 1:
                        if (errorMessageDateId === '#date-month') {
                            errorMessageDate = errorMessageDateMonthUsers
                        } else {
                            return
                        }
                        break
                    case 2:
                        if (errorMessageDateId === '#date-year') {
                            errorMessageDate = errorMessageDateYearUsers
                        } else {
                            return
                        }
                        break
                }

                childRudeDate.innerHTML = `
                    <div class="form-message__date">
                        <div class="form-message__date-error">
                            <i class="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <span class="form-message--notice">${errorMessageDate}</span>
                    </div>
                `
            })

        } else {
            inputElementDates.parentElement.classList.remove('invalid')

            elementChildRuleDates.forEach(function (childRudeDate, index) { // loop through child to remove error message

                switch (index) {
                    case 0:
                        if (errorMessageDateId === '#date-day') {
                            // errorMessageDate = ''
                        } else {
                            return // skip this iteration if no error should be shown
                        }
                        break
                    case 1:
                        if (errorMessageDateId === '#date-month') {
                            // errorMessageDate = ''
                        } else {
                            return
                        }
                        break
                    case 2:
                        if (errorMessageDateId === '#date-year') {
                            // errorMessageDate = ''
                        } else {
                            return
                        }
                        break
                }

                childRudeDate.innerHTML = ''
            })

        }

        return !errorMessageDate

    }

    // deal with event of gender validate
    function ValidateGender(inputElementGender, ruleChooseGender) {

        var errorElementGender = formElement.querySelector(options.errorElementFormGenders)
        var takeElementNoticeGender = inputElementGender.closest(options.formGendersElementSelect).querySelector(options.errorMessageGenders)
        var errorMessageGenders // put error message in screen

        var arrRuleChooseGenders = arrayRuleChooseGenders[ruleChooseGender.selector]

        for (var i = 0; i < arrRuleChooseGenders.length; i++) {
            errorMessageGenders = arrRuleChooseGenders[i](formElement.querySelector(ruleChooseGender.selector + ':checked'))
        }

        if (errorMessageGenders) {
            takeElementNoticeGender.innerText = errorMessageGenders
            errorElementGender.classList.add('invalid')
        } else {
            takeElementNoticeGender.innerText = ''
            errorElementGender.classList.remove('invalid')
        }

        return !errorElementGender

    }


    // Take form validation
    var formElement = document.querySelector(options.form)
    // console.log(formElement)

    var takeElementRules = {}

    if (formElement) {
        // options of form validate for user input
        options.rules.forEach(function (rule) {

            if (Array.isArray(takeElementRules[rule.selector])) {
                takeElementRules[rule.selector].push(rule.test)
            } else {
                takeElementRules[rule.selector] = [rule.test]
            }

            // take input form form validation rules
            var inputElement = formElement.querySelector(rule.selector)
            // console.log(inputElement)
            if (inputElement) { // deal with action blur and input events
                inputElement.onblur = function () {
                    Validate(inputElement, rule)
                }

                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorMessage)
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }


        })

        // --------------------------------------------------------------------------------------------------------------------

        // options of form validate for user date input
        options.ruleDates.forEach(function (ruleDate) {
            var inputElementDates = formElement.querySelector(ruleDate.selector)
            if (inputElementDates) {
                inputElementDates.onblur = function () {
                    ValidateDate(inputElementDates, ruleDate)
                }
            }
        })

        // ------------------------------------------------------------------------------------------------



        // Take all of the ruleChooseGenders and convert the to be array
        var arrayRuleChooseGenders = {}

        // options of form validate deal with thẻ gender form elements
        options.ruleChooseGenders.forEach(function (ruleChooseGender) {
            var inputElementGenders = formElement.querySelectorAll(ruleChooseGender.selector)

            if (Array.isArray(ruleChooseGender.selector)) {
                arrayRuleChooseGenders[ruleChooseGender.selector].push(ruleChooseGender.test)
            } else {
                arrayRuleChooseGenders[ruleChooseGender.selector] = [ruleChooseGender.test]
            }

            inputElementGenders.forEach(function (inputElementGender) {
                if (inputElementGender) {
                    inputElementGender.onclick = function () {
                        ValidateGender(inputElementGender, ruleChooseGender)
                    }
                }

            })

        })

        // to deal with behavior submit and take information user when submitting
        formElement.onsubmit = function (e) {
            e.preventDefault()

            var takeAllOfArraysRules = []

            // take all the rules
            var takeAllOfArraysRules = options.rules.concat(options.ruleDates, options.ruleChooseGenders)

            var isValid = true
            takeAllOfArraysRules.forEach(function (arrayRule) {
                var inputElementOfArrayRules = formElement.querySelector(arrayRule.selector)

                var validElementFormUser
                var validElementFormDate
                var validElementFormGender

                validElementFormUser = Validate(inputElementOfArrayRules, arrayRule)
                validElementFormDate = ValidateDate(inputElementOfArrayRules, arrayRule)

                if (inputElementOfArrayRules.type === 'radio') {
                    validElementFormGender = ValidateGender(inputElementOfArrayRules, arrayRule)
                }

                if (!validElementFormGender && !validElementFormUser && !validElementFormDate) {
                    isValid = false
                }

            })


            if (!isValid) { // false 
                console.log('có lỗi')
            } else {
                console.log('ko có lỗi')
            }
            var takeInformation = formElement.querySelectorAll('[name]')

            // enableInfors take information form user
            var enableInfors = Array.from(takeInformation).reduce(function (enableInfor, crrInfors) {

                switch (crrInfors.type) {
                    // check radio take value  
                    case 'radio':
                        var input = formElement.querySelector(`input[name="${crrInfors.name}"]:checked`)
                        enableInfor[crrInfors.name] = input ? input.value : undefined
                        break
                    // check checkbox to take value 
                    case 'checkbox':
                        if (!crrInfors.matches(':checked')) return enableInfor // inspecting checkbox were checked 
                        // if we don't check the checkbox it will take all values
                        if (!Array.isArray(enableInfor[crrInfors.name])) { // inspeting checkbox is array
                            enableInfor[crrInfors.name] = [] // convert name="checkboxForAgree" is array
                        }
                        enableInfor[crrInfors.name].push(crrInfors.value)
                        break
                    default:
                        enableInfor[crrInfors.name] = crrInfors.value
                }
                return enableInfor
            }, {})
            options.onSubmit(enableInfors) // take all of infor user 

        }

    } // formElement



}


// Method to deal with form validation
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim(value) ? undefined : 'You need to provide this data field.'
        }
    }
}

var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // inspecting regex email
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return regex.test(value) ? undefined : 'You need to enter your email.'
        }
    }
}

Validator.isConfirmEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return regex.test(value) && value === getConfirmEmail() ? undefined : 'You need to confirm your email.'
        }
    }
}

Validator.isPassword = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : 'You need to enter a password.'
        }
    }
}

Validator.isCallYourName = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Enter a name for your profile.'
        }
    }
}

// innitialize valuables date format
var currentDate = new Date()
var day = currentDate.getDay()
var month = currentDate.getMonth() + 1
var year = currentDate.getFullYear()

var errorMessageDateDayUsers = 'Enter a valid day of the month.'
Validator.isDateDay = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var yearBirthsDayUser = document.querySelector('#date-year').value
            var monthBirthsDayUser = document.querySelector('#date-month').value

            // checked the year is leap year
            if (isLeapYear(yearBirthsDayUser)) {
                //  have 29 day in febuary month in the leap year
                if (monthBirthsDayUser == 2 && value > 0 && value <= 29) {
                    return undefined
                } else if (monthBirthsDayUser == 2 && value >= 0) {
                    return errorMessageDateDayUsers
                }
            }

            // console.log(typeof monthBirthsDayUser) // Type of string value

            if (monthBirthsDayUser == 2) { // checked febuary in the normal year 
                return value.trim() <= 28 && value.trim() > 0 ? undefined : errorMessageDateDayUsers // just 28 day
            }

            // check the month have 31 day  in the year
            var monthsWith31Days = ['1', '3', '5', '7', '8', '10', '12']
            if(monthsWith31Days.includes(monthBirthsDayUser) && value > 0 && value <= 31) {
                return undefined 
            } else if(monthsWith31Days.includes(monthBirthsDayUser) && value <= 0 && value > 31) {
                return errorMessageDateDayUsers
            }
            return value > 0  && value <= 30 ? undefined : errorMessageDateDayUsers // remaining day just have 30 day
            
        }
    }
}

var errorMessageDateMonthUsers = 'Select your birth month.'
Validator.isDateMonth = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : errorMessageDateMonthUsers
        }
    }
}

var errorMessageDateYearUsers = 'Enter a valid year.'
Validator.isDateYear = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            if (!Number(value) || value.trim() < 1900 || value.trim() > year) {
                return errorMessageDateYearUsers;
            }
            return undefined;
        }
    }
}

// error message gender users
Validator.isGenders = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Select your gender.'
        }
    }
}

