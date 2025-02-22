<template>
  <div class="example-item">
    <div @dblclick="editName">
      <h2 v-if="!isEditingName">{{ editableExample.name }}</h2>
      <input 
        v-else
        v-model="editableExample.name" 
        @blur="updateExample" 
        ref="nameInput"
      />
    </div>
    <div @dblclick="editDescription">
      <p v-if="!isEditingDescription">{{ editableExample.description }}</p>
      <textarea 
        v-else 
        v-model="editableExample.description" 
        @blur="updateExample" 
        ref="descriptionInput">
      </textarea>
    </div>
    <button @click="fetchExample">Refresh</button>
    <button @click="deleteExample">Delete</button>
  </div>
</template>

<script setup lang="ts">
import { Example } from '../services/Example';
import { PropType } from 'vue';
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  example: {
    type: Object as PropType<Example>,
    required: true,
  },
});

const emit = defineEmits(['example-updated', 'example-deleted']);

const nameInput = ref<HTMLInputElement | null>(null);
const descriptionInput = ref<HTMLTextAreaElement | null>(null);
const isEditingName = ref(false);
const isEditingDescription = ref(false);
const editableExample = ref({ ...props.example });

watch(() => props.example, (newVal) => {
  editableExample.value = { ...newVal };
});

function editName() {
  isEditingName.value = true;
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus();
      nameInput.value.select();
    }
  });
}

function editDescription() {
  isEditingDescription.value = true;
  nextTick(() => {
    if (descriptionInput.value) {
      descriptionInput.value.focus();
      descriptionInput.value.select();
    }
  });
}

async function fetchExample() {
  try {
    await props.example.get();
    console.log('Example refreshed', props.example, editableExample);
    emit('example-updated', props.example);
  } catch (err) {
    console.error('Failed to fetch example', err);
  }
}

async function updateExample() {
  try {
    isEditingName.value = false;
    isEditingDescription.value = false;
    props.example.name = editableExample.value.name;
    props.example.description = editableExample.value.description;
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
