import { BaseResponse } from "../types/base-response.types";

export function responseSuccess<T>(data: T, statusCode = 200) {
  return {
    statusCode,
    body: {
      success: true,
      data,
      errors: null,
    } as BaseResponse<T>,
  };
}

export function responseCreated<T>(data: T) {
  return responseSuccess(data, 201);
}

export function responseNoContent() {
  return {
    statusCode: 204,
    body: {
      success: true,
      data: null,
      errors: null,
    } as BaseResponse<null>,
  };
}

export function responseError(errors: string[], statusCode = 400) {
  return {
    statusCode,
    body: {
      success: false,
      data: null,
      errors,
    } as BaseResponse<null>,
  };
}
