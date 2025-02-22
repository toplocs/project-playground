<template>
  <div class="container">
    <ExampleList />
  </div>
</template>

<script setup lang="ts">
	import { defineComponent } from 'vue';
	import axios from 'axios';
	import ExampleList from './components/ExampleList.vue';

	const serverURL = "http://localhost:3000";
	axios.defaults.baseURL = serverURL;
</script>
