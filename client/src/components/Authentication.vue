<template>
  <div>
    <h1>Authenticate Please</h1>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
    <div class="flex gap-4 p-2">
      <input type="text" id="email" placeholder="Enter Mail" v-model="email" class="mb-4">
      <button @click="register" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Register</button>
      <button @click="login" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const email = ref<string>("");
const errorMessage = ref<string>("");
const successMessage = ref<string>("");

const emit = defineEmits(['login-success']);

async function register() {
  errorMessage.value = '';
  successMessage.value = '';
  if (email.value === "") {
    errorMessage.value = 'Email cannot be empty';
    return;
  }
  try {
    const response = await axios.post('/api/passkey/registerStart', {
      username: email.value
    });

    if (response.status !== 200) {
      errorMessage.value = 'User already exists or failed to get registration options from server';
      throw new Error('User already exists or failed to get registration options from server');
    }

    const options = response.data;
    const attestationResponse = await startRegistration({ optionsJSON: options });

    const verificationResponse = await axios.post('/api/passkey/registerFinish', attestationResponse);

    if (verificationResponse.status === 200) {
      successMessage.value = 'Registration successful';
    } else {
      errorMessage.value = 'Registration failed';
    }
  } catch (error) {
    errorMessage.value = 'Error: ' + error;
  }
}

async function login() {
  errorMessage.value = '';
  successMessage.value = '';
  if (email.value === "") {
    errorMessage.value = 'Email cannot be empty';
    return;
  }

  try {
    const response = await axios.post('/api/passkey/loginStart', {
      username: email.value
    });

    if (response.status !== 200) {
      errorMessage.value = 'Failed to get login options from server';
      throw new Error('Failed to get login options from server');
    }

    const options = response.data;
    const assertionResponse = await startAuthentication({ optionsJSON: options });

    const verificationResponse = await axios.post('/api/passkey/loginFinish', assertionResponse);

    if (verificationResponse.status === 200) {
      successMessage.value = 'Login successful';
      const data = verificationResponse.data;
      emit('login-success', data.userId, data.token);
    } else {
      errorMessage.value = 'Login failed';
    }
  } catch (error) {
    errorMessage.value = 'Error: ' + error;
  }
}
</script>
