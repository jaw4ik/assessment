import _ from 'underscore';
import http from 'http/apiHttpWrapper';
import dataContext from 'dataContext';

export default class {
    static async execute() {
        if (!dataContext.courseExamples) {
            dataContext.courseExamples = await http.post('api/examples/courses');
        }
        
        return dataContext.courseExamples;
    }
}