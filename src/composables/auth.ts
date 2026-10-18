import { useAccountStore } from '@/store/modules/account';

export const usePermissions = () => {
  const { permissions } = storeToRefs(useAccountStore());
  return { permissions };
};

export const hasPermissions = (required?: string | string[]) => {
  if (!required) return true;

  const requiredList = Array.isArray(required) ? required : [required];
  if (!requiredList.length) return true;

  const { permissions } = usePermissions();
  return requiredList.every((permission) =>
    permissions.value.includes(permission),
  );
};
