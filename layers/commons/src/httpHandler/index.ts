import axios from "axios";
/**
 *
 * @param {{}} options - Son las opciones que normalmente se pasan a axios.
 * @param {"get"|"post"|"put"|"delete"} options[].method - Tipo de http request.
 * @param {object} options.headers - Heaeders de la request.
 * @param {object} options.data - Body de la request.
 * @param {object} options.url - URL a la que apunta la request.
 * @param {object} options.params - Query params.
 *
 */

interface HTTPHandlerTypes {
  method: "get" | "post" | "put" | "update" | "delete";
  url: string | undefined;
  headers?: any;
  data?: any;
  params?: any;
}

export const httpHandler = async (options: HTTPHandlerTypes) => {
  const response: {
    error: boolean;
    message: string;
    data: any;
    headers: any;
    status: number;
  } = {
    error: true,
    message: "",
    data: {},
    headers: {},
    status: 200,
  };
  try {
    if (options) {
      const result = await axios(options);
      response.error = false;
      response.data = result.data;
      response.headers = result.headers;
    } else {
      response.message = "Bad Request";
    }
  } catch (error: any) {
    response.message = error.message;
    if (error.response) {
      response.data = error.response.data;
      response.status = error.response.status;
      response.headers = error.response.headers;
    }
  }
  return response;
};
