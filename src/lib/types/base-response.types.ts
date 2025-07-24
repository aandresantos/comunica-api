export enum Status {
  SUCCESS = "success",
  ERROR = "error",
  EXCEPTION = "exception",
  UNAUTHORIZED = "unauthorized",
}

export type SuccessResponse<T> = {
  data: T;
  success: true;
  status: Status.SUCCESS;
};

export type ErrorResponse = {
  success: false;
  errors: string[];
  status: Status.ERROR | Status.UNAUTHORIZED | Status.EXCEPTION;
};

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;
