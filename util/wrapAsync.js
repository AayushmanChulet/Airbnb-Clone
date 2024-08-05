module.exports = function wrapAsync(fn){
    return function(res, req, next){
        fn(res, req, next).catch(err=> next(err));
    }
}