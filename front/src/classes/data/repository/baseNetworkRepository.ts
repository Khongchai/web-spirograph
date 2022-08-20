import { REACT_APP_BASE_API_ENDPOINT } from "../../../environmentVariables";
import { UndefinedError } from "../../customEvents";

export class BaseNetworkRepository {
  static async handle<T>({
    path,
    method,
    body,
  }: {
    path: string;
    method: "GET" | "POST";
    body?: any;
  }): Promise<T> {
    const url = `http://${REACT_APP_BASE_API_ENDPOINT}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`Operation failed for ${REACT_APP_BASE_API_ENDPOINT}`);
      throw new UndefinedError(res);
    }

    const json = (await res.json()) as T;

    return json;
  }
}
