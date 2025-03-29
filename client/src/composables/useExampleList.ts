import type { Uuid } from '@playground/types/uuid';
import { Example } from '@/services/Example';
import { ExampleList } from '@/services/ExampleList';
import { ref } from 'vue';

export function useExampleList() {
  const exampleList = ref<ExampleList>(new ExampleList());
  const newExample = ref<Example>(new Example());
  const loading = ref(false);
  const error = ref<string | null>(null);

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

    return {
      exampleList,
      newExample,
      loading,
      error,
      fetchExamples,
      createExample,
      updateExampleInList,
      removeExampleFromList
    };
}

