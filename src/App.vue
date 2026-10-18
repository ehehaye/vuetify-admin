<template>
  <v-app id="v-application">
    <router-view v-slot="{ Component }">
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </router-view>
    <Toast />
  </v-app>
</template>
