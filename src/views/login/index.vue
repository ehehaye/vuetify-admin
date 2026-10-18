<script setup lang="ts">
import { useAccountStore } from '@/store/modules/account';
import { LoginReq } from '@/api/account';
import { usePromiseFn } from '@/composables';

defineOptions({ name: 'Login' });

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
  <v-container class="d-flex h-100 align-center justify-center" fluid>
    <v-row class="full-height align-center justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-card class="elevation-4">
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
                :rules="[(v) => !!v || '请输入用户名']"
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
                :rules="[(v) => !!v || '请输入密码']"
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

<style lang="scss"></style>
