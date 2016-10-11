export default class RavenWrapper {
    constructor() {
        this.raven = window.Raven;
    }
    setUserContext(email) {
        if (!this.raven) {
            return;
        }

        this.raven.setUserContext({
            email: email
        });
    }
}