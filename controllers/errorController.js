module.exports = (err, req, res, next) => {
  if (err) {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
