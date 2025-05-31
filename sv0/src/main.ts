
import '../index.css';
import { mount } from 'svelte';
import sv0App from './sv0-app.svelte';

const app = mount(sv0App, {
  target: document.getElementById('sv0')!,
});

export default app;
