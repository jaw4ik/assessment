if (!String.prototype.capitalize) {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}

if (!String.prototype.toCamelCase) {
    String.prototype.toCamelCase = function () {
        return this.toLowerCase().replace(/ (.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    }
}