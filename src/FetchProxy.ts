import fetch from 'node-fetch';
import { RequestInit, Response } from 'node-fetch';

class FetchProxy {
  static get(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    return fetch(url, options);
  }

  static async getJsonResponse(
    url: string,
    options?: RequestInit
  ): Promise<any> {
    const response = await fetch(url, options);
    let content;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      content = await response.json() as JSON;
      return content;
    }
  }
}

export default FetchProxy;
