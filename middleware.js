function checkHeaderFromRequest(req, header, value) {
  const v = req.headers[header];
  return v === value;
}

function checkAccessCookie(req, name, value) {
  const v = req.cookies[name];
  return v === value;
}

export function authCheck() {
  return (req, res, next) => {
    // TODO: Check if gateway bootstrap request
    if (
      checkHeaderFromRequest(
        req,
        process.env.GATEWAY_INIT_HEADER_NAME,
        process.env.GATEWAY_INIT_HEADER_VALUE
      )
    ) {
      next();
      return;
    }

    if (!req.headers["authorization"])
      res.status(401).send("Auth token missing");

    if (
      checkHeaderFromRequest(
        req,
        "authorization",
        `Bearer ${process.env.SIGNED_ACCESS_TOKEN}`
      ) &&
      checkAccessCookie(
        req,
        process.env.SIGNED_COOKIE_NAME,
        process.env.SIGNED_COOKIE_TOKEN
      )
    ) {
      next();
      return;
    }

    res.status(401);
    res.json({});
  };
}
