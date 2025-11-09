
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiError } from './errors';

export type HttpClientOptions = {
  baseUrl: string;
  token?: string;
  timeoutMs?: number;
};

export class HttpClient {
  private axios: AxiosInstance;
  private token?: string;

  constructor(opts: HttpClientOptions) {
    this.token = opts.token;
    this.axios = axios.create({
      baseURL: opts.baseUrl.replace(/\/+$/, ''),
      timeout: opts.timeoutMs ?? 15000,
    });
    this.axios.interceptors.request.use((config) => {
      if (this.token) {
        config.headers = config.headers ?? {};
        (config.headers as any)['Authorization'] = `Bearer ${this.token}`;
      }
      (config.headers as any)['Content-Type'] = 'application/json';
      return config;
    });
    this.axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status ?? 500;
        const msg = err?.response?.data?.message ?? err.message ?? 'HTTP error';
        throw new ApiError(msg, status, err?.response?.data?.code, err?.response?.data);
      }
    );
  }

  setToken(token?: string) {
    this.token = token;
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    const res = await this.axios.get<T>(url, config);
    return res.data;
  }
  async post<T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axios.post<T>(url, body, config);
    return res.data;
  }
  async put<T = unknown>(url: string, body?: unknown, config?: AxiosRequestConfig) {
    const res = await this.axios.put<T>(url, body, config);
    return res.data;
  }
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    const res = await this.axios.delete<T>(url, config);
    return res.data;
  }
}
