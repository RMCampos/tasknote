
const getHeaders = (): Headers => {
  let headers = new Headers();
  return headers;
}

const api = {
  get: (url: string, params?: object) => fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    ...params
  }),

  post: (url: string, data: BodyInit) => fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: data
  }),

  put: (url: string, data: BodyInit) => fetch(url, {
    method: 'PUT',
    headers: getHeaders(),
    body: data
  }),

  patch: (url: string, data: any) => fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: data
  }),

  delete: (url: string) => fetch(url, {
    method: 'DELETE',
    headers: getHeaders()
  })
};

export default api;
