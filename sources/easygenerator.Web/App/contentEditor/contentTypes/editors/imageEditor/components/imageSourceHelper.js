import $ from 'jquery';

export default class {
    static getSrc(source) {
        return $('<output>').append(source)
            .find('img')
            .attr('src');
    }
    static getInitialData(source) {
        let dataInitAttr = $('<output>').append(source)
            .find('img')
            .attr('data-init');

        return dataInitAttr ? JSON.parse(dataInitAttr) : null;
    }
    static setInitialData(source, initialData) {
        let $source = $(source);
        $source.find('img').attr('data-init', JSON.stringify(initialData));
        return $source[0].outerHTML;
    }
}