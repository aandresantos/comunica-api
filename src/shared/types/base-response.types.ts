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
  status: StatusResponse.SUCCESS;
};

export type ErrorResponse = {
  success: false;
  errors: string[];
  status:
    | StatusResponse.ERROR
    | StatusResponse.UNAUTHORIZED
    | StatusResponse.EXCEPTION
    | StatusResponse.BAD_REQUEST;
};

export type BaseResponse<T> = SuccessResponse<T> | ErrorResponse;
