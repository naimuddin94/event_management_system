class AppResponse<T> {
  public success: boolean;
  constructor(
    public statusCode: number,
    public data: T,
    public message: string
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default AppResponse;
