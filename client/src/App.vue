<template>
  <div class="container mx-auto px-4">
	<div>
		<h1>Register</h1>
		<p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
		<p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
		<div class="flex gap-4 p-2">
			<input type="text" id="username" placeholder="Enter Mail" v-model="username" class="mb-4">
			<button @click="register" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Register</button>
			<button @click="login" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</button>
		</div>
		

	</div>
	<div v-if="user && user.profiles && user.profiles.length > 0"
		v-for="profile in user.profiles"
		:key="profile.id"
		class="flex items-center justify-between p-4">
		<h1>{{ profile.name }}</h1>
	</div>

    <ExampleList />
  </div>
</template>

<script setup lang="ts">
	import axios from 'axios';
	import { onMounted, ref, watch } from 'vue';
	import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
	import ExampleList from '@/components/ExampleList.vue';
	import { User } from '@/services/User';

	const username = ref<string>("");
	const userId = ref<string | null>("YmZMiGQuSgLpkNdNn39Eo9LtQB0brY4NRMHZpYXWMX0");
	const user = ref<User | null>(null);
	const errorMessage = ref<string>("");
	const successMessage = ref<string>("");
	
	onMounted(async () => {
		if (userId.value) {
			user.value = await User.Get(userId.value);
		}
	});

	watch(userId, async (newUserId) => {
		if (newUserId) {
			user.value = await User.Get(newUserId);
		} else {
			user.value = null
		}
	});

	const serverURL = "http://localhost:3000";
	axios.defaults.baseURL = serverURL;

	async function register() {
		errorMessage.value = '';
		successMessage.value = '';
		try {
			// Get registration options from your server. Here, we also receive the challenge.
			const response = await fetch(serverURL + '/api/passkey/registerStart', {
				method: 'POST', headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username: username.value})
			});
			console.log(response)

			// Check if the registration options are ok.
			if (!response.ok) {
				errorMessage.value = 'User already exists or failed to get registration options from server';
				throw new Error('User already exists or failed to get registration options from server');
			}

			// Convert the registration options to JSON.
			const options = await response.json();

			// This triggers the browser to display the passkey / WebAuthn modal (e.g. Face ID, Touch ID, Windows Hello).
			// A new attestation is created. This also means a new public-private-key pair is created.
			const attestationResponse = await startRegistration(options);

			// Send attestationResponse back to server for verification and storage.
			const verificationResponse = await fetch(serverURL + '/api/passkey/registerFinish', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(attestationResponse)
			});

			if (verificationResponse.ok) {
				successMessage.value = 'Registration successful';
				console.log('Registration successful');
			} else {
				errorMessage.value = 'Registration failed';
				console.log('Registration failed');
			}
		} catch (error) {
			errorMessage.value = 'Error: ' + error;
			console.log('Error: ' + error);
		}
	}

	async function login() {
		errorMessage.value = '';
		successMessage.value = '';
		try {
			// Get login options from your server. Here, we also receive the challenge.
			const response = await fetch('/api/passkey/loginStart', {
				method: 'POST', headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username: username.value})
			});
			// Check if the login options are ok.
			if (!response.ok) {
				throw new Error('Failed to get login options from server');
			}
			// Convert the login options to JSON.
			const options = await response.json();

			// This triggers the browser to display the passkey / WebAuthn modal (e.g. Face ID, Touch ID, Windows Hello).
			// A new assertionResponse is created. This also means that the challenge has been signed.
			const assertionResponse = await startAuthentication(options);

			// Send assertionResponse back to server for verification.
			const verificationResponse = await fetch('/api/passkey/loginFinish', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(assertionResponse)
			});

			if (verificationResponse.ok) {
				successMessage.value = 'Login successful';
				const data = await verificationResponse.json();
				userId.value = data.userId;
				console.log('Login successful', userId.value);
			} else {
				errorMessage.value = 'Login failed';
				console.log('Login failed', true);
			}
		} catch (error) {
			console.log('Error: ' + error, true);
		}
	}
</script>
