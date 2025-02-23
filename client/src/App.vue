<template>
  <div class="container mx-auto px-4">
    <ExampleList />
  </div>
</template>

<script setup lang="ts">
	import axios from 'axios';
	import ExampleList from '@/components/ExampleList.vue';

	const serverURL = "http://localhost:3000";
	axios.defaults.baseURL = serverURL;
</script>
