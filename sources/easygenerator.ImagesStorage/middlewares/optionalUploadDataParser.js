'use strict';

module.exports = (req, res, next) => {
    let data = req.body.data;
    try{ 
        req.optionalData = JSON.parse(data);
        next();
    } catch(e) {
        next();
    }
};