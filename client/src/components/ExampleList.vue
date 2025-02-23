<template>
  <div class="examples-list">
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="!loading && !error">
      <h1>Examples</h1>

      <input v-model="newExample.name" placeholder="Name" />
      <input v-model="newExample.description" placeholder="Description" />
      <button @click="createExample">Create New Example</button>

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
import type { Uuid } from '@/types/uuid';
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
