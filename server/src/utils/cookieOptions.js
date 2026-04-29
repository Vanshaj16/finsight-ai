const cookieOptions = (isProduction) => ({
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

export default cookieOptions;
