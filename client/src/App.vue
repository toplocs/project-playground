<template>
  <div class="container mx-auto px-4">
    <Authentication @login-success="handleLoginSuccess" />
    <button v-if="user" @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
	
	<div v-if="user && user.profiles && user.profiles.length > 0"
      v-for="profile in user.profiles"
      :key="profile.id"
      class="flex items-center justify-between p-4">
      <h1>{{ profile.name }}</h1>
    </div>
    <ExampleList />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { serverURL } from '@/config';
import Authentication from '@/components/Authentication.vue';
import ExampleList from '@/components/ExampleList.vue';
import { User } from '@/services/User';

axios.defaults.baseURL = serverURL;
axios.defaults.withCredentials = true;

const userId = ref<string | null>(null);
const user = ref<User | null>(null);

onMounted(async () => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    userId.value = storedUserId;
    user.value = await User.Get(storedUserId);
  }
});

watch(userId, async (newUserId) => {
  if (newUserId) {
    user.value = await User.Get(newUserId);
    localStorage.setItem('userId', newUserId);
  } else {
    user.value = null;
    localStorage.removeItem('userId');
  }
});

function handleLoginSuccess(newUserId: string) {
  userId.value = newUserId;
}

async function logout() {
  userId.value = null;
  await axios.post('/api/passkey/logout');
}
</script>
