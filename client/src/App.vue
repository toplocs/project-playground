<template>
  <div class="container mx-auto px-4">
    <div class="navbar">
      <Authentication v-if="!user" @login-success="handleLoginSuccess" />
      <div v-else>
        <div class="flex items-center justify-between">
          <Profiles :profiles="profiles" @profile-selected="updateSelectedProfile" />
          <button @click="logout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
        </div>
      </div>
    </div>
    <ExampleList :key="selectedProfileId"/>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { serverURL } from '@/config';
import Authentication from '@/components/Authentication.vue';
import Profiles from '@/components/Profiles.vue';
import ExampleList from '@/components/ExampleList.vue';
import { User } from '@/services/User';
import { Profile, ProfileList } from '@/services/Profile';


function getAuthHeaders(): string {
  const token = localStorage.getItem('authToken');
  return token ? `Bearer ${token}` : '';
}

axios.defaults.baseURL = serverURL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = getAuthHeaders();

const userId = ref<string | null>(null);
const user = ref<User | null>(null);
const profiles: ProfileList = new ProfileList();
const selectedProfileId = ref<string>('');

onMounted(async () => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    userId.value = storedUserId;
  }
});

watch(userId, async (newUserId) => {
  user.value = null;
  profiles.items = [];
  if (newUserId) {
    user.value = await User.Get(newUserId)
    if (user.value && user.value.profiles) {
      profiles.items = user.value.profiles.map(profile => new Profile(profile));
    } 
  }
});

function updateSelectedProfile(profileId: string) {
  selectedProfileId.value = profileId;
}

function handleLoginSuccess(newUserId: string, token: string) {
  userId.value = newUserId;
  localStorage.setItem('authToken', token);
  localStorage.setItem('userId', newUserId);
  axios.defaults.headers.common['Authorization'] = getAuthHeaders();
}

async function logout() {
  userId.value = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  axios.defaults.headers.common['Authorization'] = '';
  await axios.post('/api/passkey/logout');
}
</script>
