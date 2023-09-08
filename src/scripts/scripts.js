// https://tauri.app/v1/guides/features/command
import Alwan from 'alwan';

import { initSliders } from '../lib/slider/slider';

const { invoke } = window.__TAURI__.tauri;

let picker;

async function perform(action) {
  const result = await invoke(action, {
    input: picker.getColor().hex,
    percent: Number.parseFloat(document.getElementById('percent_slider').getAttribute('data-value')),
  });

  document.getElementById(`${action}_output_field`).value = result;
  document.getElementById(`${action}_output_display`).style.backgroundColor = result;
}

function initInput() {
  picker = new Alwan('#input_picker', {
    theme: 'dark',
    toggle: false,
    popover: false,
    position: 'center',
    preset: false,
  });
}

function initOutputs() {
  document
    .getElementById('darken_output_trigger')
    .addEventListener('click', () => { perform('darken'); });

  document
    .getElementById('lighten_output_trigger')
    .addEventListener('click', () => { perform('lighten'); });
}

window.addEventListener('DOMContentLoaded', () => {
  initInput();
  initOutputs();
  initSliders();
});
