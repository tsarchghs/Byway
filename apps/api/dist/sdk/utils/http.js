import axios from 'axios';
import { ApiError } from './errors';
export class HttpClient {
    constructor(opts) {
        this.token = opts.token;
        this.axios = axios.create({
            baseURL: opts.baseUrl.replace(/\/+$/, ''),
            timeout: opts.timeoutMs ?? 15000,
        });
        this.axios.interceptors.request.use((config) => {
            if (this.token) {
                config.headers = config.headers ?? {};
                config.headers['Authorization'] = `Bearer ${this.token}`;
            }
            config.headers['Content-Type'] = 'application/json';
            return config;
        });
        this.axios.interceptors.response.use((res) => res, (err) => {
            const status = err?.response?.status ?? 500;
            const msg = err?.response?.data?.message ?? err.message ?? 'HTTP error';
            throw new ApiError(msg, status, err?.response?.data?.code, err?.response?.data);
        });
    }
    setToken(token) {
        this.token = token;
    }
    async get(url, config) {
        const res = await this.axios.get(url, config);
        return res.data;
    }
    async post(url, body, config) {
        const res = await this.axios.post(url, body, config);
        return res.data;
    }
    async put(url, body, config) {
        const res = await this.axios.put(url, body, config);
        return res.data;
    }
    async delete(url, config) {
        const res = await this.axios.delete(url, config);
        return res.data;
    }
}
