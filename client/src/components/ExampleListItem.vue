<template>
  <div class="example-item">
    <h2>{{ example.name }}</h2>
    <p>{{ example.description }}</p>
    <button @click="updateExample">Update</button>
    <button @click="deleteExample">Delete</button>
  </div>
</template>

<script setup lang="ts">
import { Example } from '../services/Example';
import { PropType } from 'vue';

const props = defineProps({
  example: {
    type: Object as PropType<Example>,
    required: true,
  },
});

const emit = defineEmits(['example-updated', 'example-deleted']);

async function updateExample() {
  try {
    props.example.description += " LALA"
    const updatedExample = await props.example.update();
    console.log('Example updated:', updatedExample);
    emit('example-updated', props.example);
  } catch (err) {
    console.error('Failed to update example', err);
  }
}

async function deleteExample() {
  try {
    console.log(props.example);
    await props.example.delete();
    console.log('Example deleted');
    emit('example-deleted', props.example.id);
  } catch (err) {
    console.error('Failed to delete example', err);
  }
}
</script>
