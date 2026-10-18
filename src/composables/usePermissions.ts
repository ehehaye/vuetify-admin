import type { MaybeRefOrGetter } from 'vue';
import { useAccountStore } from '@/store/modules/account';

export function checkPermission(
  required: string | readonly string[] | undefined,
  permissions: readonly string[],
) {
  if (!required) return true;

  const requiredList = Array.isArray(required) ? required : [required];
  if (!requiredList.length) return true;

  return requiredList.every((permission) => permissions.includes(permission));
}

export function usePermissions() {
  const { permissions } = storeToRefs(useAccountStore());

  const hasPermission = (
    required?: MaybeRefOrGetter<string | readonly string[] | undefined>,
  ) => computed(() => checkPermission(toValue(required), permissions.value));

  return { permissions, hasPermission };
}
