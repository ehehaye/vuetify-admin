/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Connector {
  private worker: Worker;
  private requests: Map<
    number,
    { resolve: (value?: any) => void; reject: (reason?: any) => void }
  >;
  private currentRequestId: number;

  constructor(worker: Worker) {
    this.worker = worker;
    this.requests = new Map();
    this.currentRequestId = 0;

    this.worker.onmessage = (event: MessageEvent<WorkerReceiveMsg>) => {
      const { requestId, response } = event.data;
      const request = this.requests.get(requestId);

      if (request) {
        request.resolve(response);
        this.requests.delete(requestId);
      }
    };

    this.worker.onerror = (error: ErrorEvent) => {
      for (const request of this.requests.values()) {
        request.reject(error);
      }
      this.requests.clear();
    };
  }

  send(message: WorkerSendMsgContent): Promise<any> {
    const requestId = this.currentRequestId++;

    const { resolve, reject, promise } = Promise.withResolvers();

    const request = { resolve, reject };

    this.requests.set(requestId, request);
    this.worker.postMessage({
      requestId,
      // https://github.com/vuejs/Discussion/issues/292
      message: JSON.parse(JSON.stringify(message)),
    } as WorkerSendMsg);

    return promise;
  }
}
