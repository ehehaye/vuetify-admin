<script setup lang="ts">
import { useAccountStore } from '@/store/modules/account';
import { LoginReq } from '@/api/account';
import { usePromiseFn } from '@/composables';
import { useRules } from 'vuetify';

defineOptions({ name: 'Login' });

const usernameRules = useRules(() => [['required', '请输入用户名']]);
const passwordRules = useRules(() => [['required', '请输入密码']]);

const model = reactive<LoginReq>({
  username: 'Admin',
  password: 'h97rpXts8',
});

const formRef = ref<IoGC<'VForm'>>(null);

const { login } = useAccountStore();
const { loading, exec } = usePromiseFn(login);

const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) exec(model);
};
</script>

<template>
  <v-container
    class="tw:flex tw:h-full tw:items-center tw:justify-center"
    fluid
  >
    <v-row class="tw:h-full tw:items-center tw:justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-card class="tw:shadow-lg">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>用户登录</v-toolbar-title>
              <v-spacer />
            </v-toolbar>

            <v-card-text>
              <v-text-field
                v-model="model.username"
                variant="underlined"
                autofocus
                label="用户名"
                name="login"
                prepend-icon="person"
                :rules="usernameRules"
                type="text"
                validate-on-blur
                autocomplete="username"
              />
              <v-text-field
                id="password"
                v-model="model.password"
                variant="underlined"
                label="密码"
                name="password"
                prepend-icon="lock"
                :rules="passwordRules"
                type="password"
                validate-on-blur
                autocomplete="current-password"
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" :loading="loading" type="submit">
                登录
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
