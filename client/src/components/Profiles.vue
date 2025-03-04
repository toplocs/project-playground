<template>
  <div class="flex gap-4 m-4">
    <h1 class="p-2">Profiles:</h1>
    <div class="border rounded-full p-2 cursor-pointer select-text"
        @click="addProfile()"
      >
        +
    </div>
    <div v-for="profile in $props.profiles.items" 
      :key="profile.id" 
    >
      <div class="border rounded-full p-2 cursor-pointer select-text"
        @click="selectProfile(profile)"
      >
        {{ profile.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Profile, ProfileList } from '@/services/Profile';

const props = defineProps<{ profiles: ProfileList }>();
const emit = defineEmits<{
  (event: 'profile-selected', profileId: string): void;
}>();

const selectProfile = (profile: Profile) => {
  emit('profile-selected', profile.id);
};

const addProfile = async () => {
  const userId = props.profiles.items[0].userId;
  const profile = await props.profiles.create({
    name: 'New', 
    userId: userId 
  });
  selectProfile(profile);
};
</script>