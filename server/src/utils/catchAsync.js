/**
 * Async Error Wrapper
 *
 * Wraps an async route handler or middleware function so that
 * any rejected promise is automatically forwarded to Express's
 * next() error handler — eliminating the need for try/catch
 * blocks in every controller.
 *
 * Usage:
 *   router.get('/users', catchAsync(async (req, res, next) => {
 *     const users = await User.find();
 *     res.json(users);
 *   }));
 */

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
