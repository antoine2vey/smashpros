import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res'

export function context(
  authenticated?: boolean,
  payload?: mockReqRes.RequestPayload
) {
  if (authenticated) {
    return {
      req: mockRequest(payload),
      res: mockResponse()
    }
  }

  return {
    req: mockRequest(),
    res: mockResponse()
  }
}
