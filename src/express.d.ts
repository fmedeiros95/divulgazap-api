declare namespace Express {
  export interface Request {
    user?: import('~/modules/users/entities').User;
  }
}
