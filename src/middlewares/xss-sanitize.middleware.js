import xssSanitize from 'xss-sanitize';

// Sanitizador combinado — limpia body, query y params globalmente
// xss-sanitize limpia body/query vía factoría, params vía paramSanitize()
const bodyQuerySanitizer = xssSanitize();
const paramSanitizer = xssSanitize.paramSanitize();

const xssSanitizeMiddleware = (req, _res, next) => {
  bodyQuerySanitizer(req, _res, (err) => {
    if (err) return next(err);
    paramSanitizer(req, _res, next);
  });
};

export default xssSanitizeMiddleware;
