const response = (statusCode: number, data: any, message: string, res: any) => {
  res.status(statusCode).json({
    payload: {
      status_code: statusCode,
      datas: data,
    },
    message: message,
    pagination: {
      prev: "",
      max: "",
      next: "",
    },
  });
};


export { response };