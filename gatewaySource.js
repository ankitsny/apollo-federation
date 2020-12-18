import { RemoteGraphQLDataSource } from "@apollo/gateway";

export default class AppSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    if (context.req === undefined) {
      /**
       * This means that the gateway is starting up
       * It will ping the micro-services for their schema
       */

      request.http.headers.set(
        process.env.GATE_INIT_HEADER_NAME,
        process.env.GATE_INIT_HEADER_VALUE
      );
      return;
    }

    if (context.req.headers === undefined) return;

    const header = context.req.headers;

    Object.keys(header).forEach((key) =>
      request.http.headers.set(key, header[key])
    );
  }

  // response, request and req, res inside context how diff
  async didReceiveResponse({ response, request, context }) {
    if (context.res === undefined) return response;

    const cookie = response.http.headers.get("set-cookie");
    if (cookie) {
      // forward the cookies
      context.res.set("set-cookie", cookie);
    }
    return response;
  }
}
