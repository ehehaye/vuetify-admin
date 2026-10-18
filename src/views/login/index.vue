<script setup lang="ts">
import type { VForm } from 'vuetify/components';
import { useRules } from 'vuetify';
import type { LoginReq } from '@/api/account';
import { useAccountStore } from '@/store/modules/account';
import { usePromiseFn } from '@/composables';

const appTitle = import.meta.env.VITE_APP_TITLE;
const route = useRoute();
const router = useRouter();
const { login } = useAccountStore();
const { loading, exec } = usePromiseFn(login);

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const errorMessage = ref('');
const showPassword = ref(false);

const model = reactive<LoginReq>({ username: '', password: '' });

const usernameRules = useRules(() => [['required', '请输入用户名']]);
const passwordRules = useRules(() => [['required', '请输入密码']]);

const features = [
  {
    icon: 'route',
    title: '动态路由与权限',
    text: '菜单驱动的路由注册与权限校验',
  },
  {
    icon: 'tab',
    title: '多页签与状态保持',
    text: '页签联动 keep-alive，切换不丢状态',
  },
  {
    icon: 'palette',
    title: 'Material Design',
    text: '基于 Vuetify 4 的设计系统与主题',
  },
];

function fillDemo(username: 'admin' | 'guest') {
  model.username = username;
  model.password = username;
  errorMessage.value = '';
}

async function submit() {
  errorMessage.value = '';
  const { valid } = (await formRef.value?.validate()) ?? { valid: false };
  if (!valid) return;

  try {
    await exec({
      username: model.username.trim(),
      password: model.password,
    });

    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/home';
    await router.replace(redirect);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '登录失败，请稍后重试';
  }
}
</script>

<template>
  <div class="login-page">
    <section class="login-brand">
      <div class="login-brand__orb login-brand__orb--one" />
      <div class="login-brand__orb login-brand__orb--two" />

      <router-link
        to="/login"
        class="tw:relative tw:flex tw:items-center tw:gap-3"
      >
        <img src="/logo.svg" alt="" class="tw:h-11 tw:w-11" />
        <div>
          <div class="text-h6 tw:font-semibold">{{ appTitle }}</div>
          <div class="text-body-2 tw:opacity-80">Vuetify 4 Admin Template</div>
        </div>
      </router-link>

      <div class="tw:relative tw:mt-16">
        <h1 class="text-h3 tw:font-semibold tw:leading-tight">
          让后台管理
          <br />
          更简洁、更一致
        </h1>
        <p class="text-body-1 tw:mt-4 tw:max-w-[420px] tw:opacity-85">
          开箱即用的动态路由、权限控制、多页签与主题切换，帮助团队把精力放在业务本身。
        </p>

        <ul class="tw:mt-10 tw:space-y-4">
          <li
            v-for="feature in features"
            :key="feature.title"
            class="tw:flex tw:items-start tw:gap-3"
          >
            <span class="login-brand__icon">
              <v-icon :icon="feature.icon" size="20" />
            </span>
            <span>
              <span class="text-body-1 tw:font-medium">{{
                feature.title
              }}</span>
              <span class="text-body-2 tw:mt-0.5 tw:block tw:opacity-75">
                {{ feature.text }}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <div class="text-caption tw:relative tw:opacity-70">
        © {{ new Date().getFullYear() }} {{ appTitle }}
      </div>
    </section>

    <section class="login-form">
      <div class="login-form__inner">
        <div class="tw:mb-8 tw:flex tw:items-center tw:gap-3 d-lg-none">
          <img src="/logo.svg" alt="" class="tw:h-10 tw:w-10" />
          <div>
            <div class="text-h6 tw:font-semibold">{{ appTitle }}</div>
            <div class="text-caption text-medium-emphasis">
              Vuetify 4 Admin Template
            </div>
          </div>
        </div>

        <h2 class="text-h5 tw:font-semibold">欢迎回来</h2>
        <p class="text-body-2 text-medium-emphasis tw:mt-1">
          使用演示账号登录，体验完整的后台功能。
        </p>

        <v-form ref="formRef" class="tw:mt-7" @submit.prevent="submit">
          <v-text-field
            v-model="model.username"
            label="用户名"
            name="username"
            autocomplete="username"
            autofocus
            prepend-inner-icon="person"
            :rules="usernameRules"
            validate-on-blur
          />

          <v-text-field
            v-model="model.password"
            class="tw:mt-4"
            label="密码"
            name="password"
            autocomplete="current-password"
            prepend-inner-icon="lock"
            :append-inner-icon="showPassword ? 'visibility_off' : 'visibility'"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordRules"
            validate-on-blur
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert
            v-if="errorMessage"
            class="tw:mt-4"
            type="error"
            density="compact"
            :text="errorMessage"
          />

          <v-btn
            class="tw:mt-6"
            block
            color="primary"
            size="large"
            type="submit"
            :loading="loading"
          >
            登录
          </v-btn>
        </v-form>

        <div class="tw:mt-8">
          <div class="tw:flex tw:items-center tw:gap-3">
            <v-divider />
            <span
              class="text-caption text-medium-emphasis tw:whitespace-nowrap"
            >
              演示账号
            </span>
            <v-divider />
          </div>

          <div class="tw:mt-4 tw:grid tw:grid-cols-2 tw:gap-3">
            <v-btn
              variant="tonal"
              prepend-icon="admin_panel_settings"
              @click="fillDemo('admin')"
            >
              管理员
            </v-btn>
            <v-btn
              variant="tonal"
              prepend-icon="person_outline"
              @click="fillDemo('guest')"
            >
              访客
            </v-btn>
          </div>

          <p class="text-caption text-medium-emphasis tw:mt-3">
            账号密码分别为 admin / admin、guest / guest。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100dvh;
  background: rgb(var(--v-theme-background));
}

.login-brand {
  position: relative;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 48px 56px;
  color: rgb(var(--v-theme-on-primary));
  background:
    radial-gradient(
      circle at 18% 18%,
      rgba(var(--v-theme-primary-lighten-1), 0.55),
      transparent 42%
    ),
    linear-gradient(
      140deg,
      rgb(var(--v-theme-primary)) 0%,
      rgb(var(--v-theme-primary-darken-2)) 100%
    );
}

.login-brand__orb {
  position: absolute;
  border: 1px solid rgba(var(--v-theme-on-primary), 0.18);
  border-radius: 50%;
}

.login-brand__orb--one {
  top: -120px;
  right: -80px;
  width: 360px;
  height: 360px;
}

.login-brand__orb--two {
  right: 120px;
  bottom: -160px;
  width: 280px;
  height: 280px;
}

.login-brand__icon {
  display: grid;
  flex: none;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-primary), 0.14);
}

.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.login-form__inner {
  width: 100%;
  max-width: 420px;
}

@media (min-width: 960px) {
  .login-page {
    grid-template-columns: 1.05fr 1fr;
  }

  .login-brand {
    display: flex;
  }

  .login-form {
    padding: 48px;
  }
}
</style>
