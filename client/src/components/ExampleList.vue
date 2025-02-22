<template>
  <div class="examples-list">
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="!loading && !error">
      <h1>Examples</h1>

      <input v-model="newExampleName" placeholder="Name" />
      <input v-model="newExampleDescription" placeholder="Description" />
      <button @click="createExample">Create New Example</button>

      <ExampleListItem v-for="example in exampleList.examples" 
        :key="example.id" 
        :example="example" 
        @example-updated="updateExample" 
        @example-deleted="removeExample"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Uuid } from '../../../types/uuid';
import { Example } from '../services/Example';
import { ExampleList } from '../services/ExampleList';
import ExampleListItem from './ExampleListItem.vue';

const loading = ref(false);
const error= ref<string | null>(null);
const exampleList = ref<ExampleList>(new ExampleList());
const newExampleName = ref('');
const newExampleDescription = ref('');

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
    const newExample = new Example({
      name: newExampleName.value,
      description: newExampleDescription.value
    });
    const createdExample = await exampleList.value.create(newExample);
    newExampleName.value = '';
    newExampleDescription.value = '';
  } catch (err) {
    console.error('Failed to create example', err);
  }
};

const updateExample = async (example: Example) => {
  exampleList.value.replace(example);
};

const removeExample = async (id: Uuid) => {
  exampleList.value.remove(id);
};
</script>
