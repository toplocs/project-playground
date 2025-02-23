<template>
  <div class="flex items-center justify-between p-4">
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="!loading && !error">
      <h1 class="font-bold text-xl mb-2">Examples</h1>

      <div class="rounded shadow max-w-md p-4">
        <h2 class="font-bold text-xl mb-2">Create New Example</h2>
        <input v-model="newExample.name" placeholder="Title" />
        <input v-model="newExample.description" placeholder="Description" />
        <button class="bg-blue-500 text-white p-2 mt-4"
          @click="createExample">Add</button>
      </div>
      
      <ExampleListItem v-for="example in exampleList.examples" 
        :key="example.id" 
        :example="example" 
        @example-updated="updateExampleInList" 
        @example-deleted="removeExampleFromList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Uuid } from '@playground/types/uuid';
import { Example } from '@/services/Example';
import { ExampleList } from '@/services/ExampleList';
import ExampleListItem from '@/components/ExampleListItem.vue';

const loading = ref(false);
const error= ref<string | null>(null);
const exampleList = ref<ExampleList>(new ExampleList());
const newExample = ref<Example>(new Example());

onMounted(async () => {
  await fetchExamples();
});

const fetchExamples = async () => {
  loading.value = true;
  try {
    await exampleList.value.fetchAll();
  } catch (err) {
    error.value = 'Failed to fetch examples';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const createExample = async () => {
  try {
    if (!newExample.value.name) {
      newExample.value.name = 'Untitled';
    }
    if (!newExample.value.description) {
      newExample.value.description = 'No description';
    }
    console.log("Create this:", newExample.value);
    await exampleList.value.create(newExample.value);
    newExample.value.name = '';
    newExample.value.description = '';
  } catch (err) {
    console.error('Failed to create example', err);
  }
};

const updateExampleInList = async (example: Example) => {
  exampleList.value.replace(example);
};

const removeExampleFromList = async (id: Uuid) => {
  exampleList.value.remove(id);
};
</script>
