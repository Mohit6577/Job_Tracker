const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  res.json({
    message: err.message,
  });
};
export default errorHandler;
