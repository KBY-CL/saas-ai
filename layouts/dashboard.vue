<template>
  <v-app id="inspire">
    <client-only>
      <v-navigation-drawer v-model="drawer" temporary>
        <v-card class="mx-auto" max-width="300">
          <v-list>
            <v-list-subheader>Plain Variant</v-list-subheader>

            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :value="item"
              color="primary"
              variant="plain"
              @click="goToPage(item.page)"
            >
              <template #:prepend>
                <v-icon :icon="item.icon" />
              </template>

              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-list>
            <v-list-subheader>Tonal Variant</v-list-subheader>

            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :value="item"
              color="primary"
              variant="tonal"
            >
              <template #:prepend>
                <v-icon :icon="item.icon" />
              </template>

              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-navigation-drawer>
    </client-only>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
theme.change('dark');

const drawer = ref(null);

const items = [
  { text: 'Real-Time', icon: 'mdi-clock', page: '/' },
  { text: 'Audience', icon: 'mdi-account', page: '/index2' },
  { text: 'Conversions', icon: 'mdi-flag' },
];

function goToPage(page) {
  console.log(page);
  if (page) {
    navigateTo(page);
  }
}
</script>
