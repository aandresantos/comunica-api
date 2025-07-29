export enum StatusResponse {
  SUCCESS = "success",
  ERROR = "error",
  BAD_REQUEST = "bad_request",
  EXCEPTION = "exception",
  UNAUTHORIZED = "unauthorized",
}

export type SuccessResponse<T> = {
  data: T;
  success: true;
  errors: null;
};

export type ErrorResponse = {
  success: false;
  data: null;
  errors: string[];
};

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;

export type ControllerResponse<T> = {
  statusCode: number;
  body: BaseResponse<T>;
};
