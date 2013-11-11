var app = app || {};

app.openHomePage = function () {
    window.location.replace('/');
};

app.reload = function () {
    window.location.reload();
};


app.constants = {
    events: {
        signin: 'Sign in',
        signup: 'Sign up'
    },
    patterns: {
        email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/
    },
    countries: [
        { name: 'Afghanistan' }, { name: 'Albania' }, { name: 'Algeria' }, { name: 'Andorra' }, { name: 'Angola' }, { name: 'Antigua and Barbuda' },
        { name: 'Argentina' },{ name: 'Armenia' },{ name: 'Australia' },{ name: 'Austria' },{ name: 'Azerbaijan' },{ name: 'Bahamas' },
        { name: 'Bahrain' },{ name: 'Bangladesh' },{ name: 'Barbados' },{ name: 'Belarus' },{ name: 'Belgium' },{ name: 'Belize' },
        { name: 'Benin' },{ name: 'Bhutan' },{ name: 'Bolivia' },{ name: 'Bosnia and Herzegovina' },{ name: 'Botswana' },{ name: 'Brazil' },
        { name: 'Brunei' },{ name: 'Bulgaria' },{ name: 'Burkina Faso' },{ name: 'Burma' },{ name: 'Burundi' },{ name: 'Côte d\'Ivoire' },
        { name: 'Cambodia' },{ name: 'Cameroon' },{ name: 'Canada' },{ name: 'Cape Verde' },{ name: 'Central African Republic' },{ name: 'Chad' },
        { name: 'Chile' },{ name: 'China' },{ name: 'Colombia' },{ name: 'Comoros' },{ name: 'Congo' },{ name: 'Costa Rica' },{ name: 'Croatia' },
        { name: 'Cuba' },{ name: 'Cyprus' },{ name: 'Czech Republic' },{ name: 'Democratic Republic of the Congo' },{ name: 'Denmark' },{ name: 'Djibouti' },
        { name: 'Dominica' },{ name: 'Dominican Republic' },{ name: 'East Timor' },{ name: 'Ecuador' },{ name: 'Egypt' },{ name: 'El Salvador' },{ name: 'England' },
        { name: 'Equatorial Guinea' },{ name: 'Eritrea' },{ name: 'Estonia' },{ name: 'Ethiopia' },{ name: 'Faroese' },{ name: 'Fiji' },{ name: 'Finland' },{ name: 'France' },
        { name: 'Gabon' },{ name: 'Gambia' },{ name: 'Georgia' },{ name: 'Germany' },{ name: 'Ghana' },{ name: 'Greece' },{ name: 'Grenada' },{ name: 'Guatemala' },{ name: 'Guinea' },
        { name: 'Guinea-Bissau' },{ name: 'Guyana' },{ name: 'Haiti' },{ name: 'Honduras' },{ name: 'Hong Kong' },{ name: 'Hungary' },{ name: 'Iceland' },{ name: 'India' },
        { name: 'Indonesia' },{ name: 'Iran' },{ name: 'Iraq' },{ name: 'Ireland' },{ name: 'Isle of Man' },{ name: 'Israel' },{ name: 'Italy' },{ name: 'Jamaica' },{ name: 'Japan' },
        { name: 'Jordan' },{ name: 'Kazakhstan' },{ name: 'Kenya' },{ name: 'Kiribati' },{ name: 'Korea, North' },{ name: 'Korea, South' },{ name: 'Kosovo' },{ name: 'Kuwait' },
        { name: 'Kyrgyzstan' },{ name: 'Laos' },{ name: 'Latvia' },{ name: 'Lebanon' },{ name: 'Lesotho' },{ name: 'Liberia' },{ name: 'Libya' },
        { name: 'Liechtenstein' },{ name: 'Lithuania' },{ name: 'Luxembourg' },{ name: 'Macau' },{ name: 'Macedonia' },{ name: 'Madagascar' },{ name: 'Malawi' },{ name: 'Malaysia' },
        { name: 'Maldives' },{ name: 'Mali' },{ name: 'Malta' },{ name: 'Marshall Islands' },{ name: 'Mauritania' },{ name: 'Mauritius' },{ name: 'Mexico' },
        { name: 'Micronesia' },{ name: 'Moldova' },{ name: 'Monaco' },{ name: 'Mongolia' },{ name: 'Montenegro' },{ name: 'Morocco' },{ name: 'Mozambique' },
        { name: 'Namibia' },{ name: 'Nauru' },{ name: 'Nepal' },{ name: 'Netherlands' },{ name: 'New Zealand' },{ name: 'Nicaragua' },{ name: 'Niger' },
        { name: 'Nigeria' },{ name: 'Norway' },{ name: 'Oman' },{ name: 'Pakistan' },{ name: 'Palau' },{ name: 'Panama' },{ name: 'Papua New Guinea' },
        { name: 'Paraguay' },{ name: 'Peru' },{ name: 'Philippines' },{ name: 'Poland' },{ name: 'Portugal' },{ name: 'Puerto Rico' },{ name: 'Qatar' },
        { name: 'Romania' }, { name: 'Russia' }, { name: 'Rwanda' }, { name: 'São Tomé and Príncipe' }, { name: 'Saint Kitts and Nevis' }, { name: 'Saint Lucia' },
        { name: 'Saint Vincent and the Grenadines' },{ name: 'Samoa' },{ name: 'San Marino' },{ name: 'Saudi Arabia' },{ name: 'Scotland' },
        { name: 'Senegal' },{ name: 'Serbia' },{ name: 'Seychelles' },{ name: 'Sierra Leone' },{ name: 'Singapore' },{ name: 'Slovakia' },{ name: 'Slovenia' },
        { name: 'Solomon Islands' }, { name: 'Somalia' }, { name: 'South Africa' }, { name: 'Spain' }, { name: 'Sri Lanka' }, { name: 'Sudan' }, { name: 'Suriname' },
        { name: 'Swaziland' },{ name: 'Sweden' },{ name: 'Switzerland' },{ name: 'Syria' },{ name: 'Taiwan' },{ name: 'Tajikistan' },{ name: 'Tanzania' },
        { name: 'Thailand' },{ name: 'Togo' },{ name: 'Tonga' },{ name: 'Trinidad and Tobago' },{ name: 'Tunisia' },{ name: 'Turkey' },
        { name: 'Turkmenistan' },{ name: 'Tuvalu' },{ name: 'Uganda' },{ name: 'Ukraine' },{ name: 'United Arab Emirates' },{ name: 'United Kingdom' },
        { name: 'United States of America' },{ name: 'Uruguay' },{ name: 'Uzbekistan' },{ name: 'Vanuatu' },{ name: 'Vatican City' },
        { name: 'Venezuela' },{ name: 'Vietnam' },{ name: 'Wales' },{ name: 'Yemen' },{ name: 'Zambia' },{ name: 'Zimbabwe' }]
};

$(function () {

    serviceUnavailableAjaxErrorHandler().subscribeOnGlobalErrorEvents();

    if ($(".sign-up").length) {
        ko.applyBindings(signupModel(), $(".sign-up")[0]);
    }

    if ($(".log-in").length) {
        ko.applyBindings(app.signinViewModel(), $(".log-in")[0]);
    }

    if ($('.sign-up-second-step').length) {
        ko.applyBindings(signUpSecondStepModel(), $('.sign-up-second-step')[0]);
    }
    
    if ($('.password-recovery').length) {
        ko.applyBindings(app.passwordRecoveryViewModel(), $('.password-recovery')[0]);
    }
});


