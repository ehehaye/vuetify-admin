import Toast from './index.vue';
import event from './event';
import type { Color, Payload } from './event';

export type ToastOptions = {
  message: string;
  timeout?: number;
};

const add =
  (color: Color) =>
  ({ message, timeout = 3500 }: ToastOptions) => {
    event.emit({
      id: crypto.randomUUID(),
      message,
      color,
      timeout,
    } satisfies Payload);
  };

const toast = {
  success: add('success'),
  warning: add('warning'),
  error: add('error'),
  info: add('info'),
};

export { Toast, toast };
export default toast;
