// Express type re-exports for ESM compatibility
import type express from 'express';

export type Express = express.Express;
export type Request = express.Request;
export type Response = express.Response;
export type NextFunction = express.NextFunction;
export type RequestHandler = express.RequestHandler;
export type ErrorRequestHandler = express.ErrorRequestHandler;