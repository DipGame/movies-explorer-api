const CREATED = 201;
const OK = 200;
const INTERNAL_SERVERE_ERROR = 500;

class NOT_FOUND extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class BAD_REQUEST extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class UNAUTHORIZED extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class CONFLICT extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class FORBIDDEN extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVERE_ERROR,
  CREATED,
  UNAUTHORIZED,
  CONFLICT,
  OK,
  FORBIDDEN,
};
