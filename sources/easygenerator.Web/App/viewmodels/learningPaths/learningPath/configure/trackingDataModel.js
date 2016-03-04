import LrsOption from './lrsOption.js';
import TextField from './textField.js';

export default class TrackingDataModel {
    constructor(xApiSettings, callback) {
        this.advancedSettingsExpanded = ko.observable(false);

        this.enableXAPI = ko.observable(true);
        this.allowToSkipTracking = ko.observable(true);

        this.lrsOptions = [
            new LrsOption('default', true),
            new LrsOption('custom')
        ];

        this.selectedLrs = ko.computed(() => {
            let that = this;

            let selectedName = '';
            ko.utils.arrayForEach(that.lrsOptions, lrsOption => { //foreach because of we need to track selecting of all themes
                if (lrsOption.isSelected()) {
                    selectedName = lrsOption.name;
                }
            });
            return selectedName;
        }, this);

        this.customLrsEnabled = ko.computed(() => {
            return this.enableXAPI() && this.selectedLrs() != this.lrsOptions[0].name;
        });

        this.lrsUrl = new TextField();
        this.authenticationRequired = ko.observable(false);
        this.lapLogin = new TextField();
        this.lapPassword = new TextField();
        
        this.credentialsEnabled = ko.computed(() => {
            return this.customLrsEnabled() && this.authenticationRequired();
        });

        this.statements = {
            started: ko.observable(true),
            stopped: ko.observable(true),
            mastered: ko.observable(true),
            answered: ko.observable(true),
            passed: ko.observable(true),
            experienced: ko.observable(true),
            failed: ko.observable(true)
        };

        this.init(xApiSettings, callback);
    }

    init(xApiSettings, callback) {
        this.onSettingsChanged = callback;

        if (!xApiSettings) {
            return;
        }

        this.enableXAPI(xApiSettings.enabled);
        this.allowToSkipTracking(!xApiSettings.required);

        if (xApiSettings.selectedLrs) {
            this.selectLrsByName(xApiSettings.selectedLrs);
        }

        if (xApiSettings.lrs) {
            this.setCustomLrsSettings(xApiSettings.lrs);
        }

        if (xApiSettings.allowedVerbs) {
            this.setStatements(xApiSettings.allowedVerbs);
        }
    }

    settingsChanged() {
        if (_.isFunction(this.onSettingsChanged)) {
            this.onSettingsChanged();
        }
    }

    toggleAdvancedSettings() {
        this.advancedSettingsExpanded(!this.advancedSettingsExpanded());
    }

    toggleAuthenticationRequired() {
        this.authenticationRequired(!this.authenticationRequired());
        this.settingsChanged();
    }

    selectLrs(lrs) {
        ko.utils.arrayForEach(this.lrsOptions, lrsOptions => {
            lrsOptions.isSelected(false);
        });
        lrs.isSelected(true);
        this.settingsChanged();
    }

    selectLrsByName(name) {
        let that = this;
        ko.utils.arrayForEach(that.lrsOptions, lrsOption => {
            lrsOption.isSelected(lrsOption.name === name);
        });
    }

    setStatements(statements) {
        let that = this;
        ko.utils.objectForEach(that.statements, (key, value) => {
            value(statements.indexOf(key) > -1);
        });
    }

    setCustomLrsSettings(customLrsSettings) {
        this.lrsUrl.init(customLrsSettings.uri || '', this.onSettingsChanged);
        this.authenticationRequired(customLrsSettings.authenticationRequired || false);
        this.lapLogin.init(customLrsSettings.credentials.username || '', this.onSettingsChanged);
        this.lapPassword.init(customLrsSettings.credentials.password || '', this.onSettingsChanged);
    }

    getData() {
        let that = this;
        let allowedVerbs = [];

        ko.utils.objectForEach(that.statements, (key, value) => {
            if (value()) {
                allowedVerbs.push(key);
            }
        });

        return {
            enabled: that.enableXAPI(),
            required: !that.allowToSkipTracking(),
            selectedLrs: that.selectedLrs(),
            lrs: {
                uri: that.lrsUrl.value(),
                authenticationRequired: that.authenticationRequired(),
                credentials: {
                    username: that.lapLogin.value(),
                    password: that.lapPassword.value()
                }
            },
            allowedVerbs: allowedVerbs
        };
    }
}
