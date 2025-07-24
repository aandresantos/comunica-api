export enum StatusResponse {
  SUCCESS = "success",
  ERROR = "error",
  EXCEPTION = "exception",
  UNAUTHORIZED = "unauthorized",
}

export type SuccessResponse<T> = {
  data: T;
  success: true;
  status: StatusResponse.SUCCESS;
};

export type ErrorResponse = {
  success: false;
  errors: string[];
  status:
    | StatusResponse.ERROR
    | StatusResponse.UNAUTHORIZED
    | StatusResponse.EXCEPTION;
};

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;
