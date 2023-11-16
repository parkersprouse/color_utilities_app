// https://tauri.app/v1/guides/features/command
import Alwan from 'alwan';
import tinycolor from 'tinycolor2';
// import { initSliders } from '../lib/slider/slider.js';

const { invoke } = window.__TAURI__.tauri;

let picker;

async function perform(action) {
  const result = await invoke(action, {
    input: picker.getColor().hex,
    percent: 50,
    // percent: Number.parseFloat(document.querySelector('#percent_slider').getAttribute('data-value')),
  });

  document.querySelector(`#${action}_output_field`).value = tinycolor(result).toHexString();
  document.querySelector(`#${action}_output_display`).style.backgroundColor = tinycolor(result).toHexString();
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
    .querySelector('#darken_output_trigger')
    .addEventListener('click', () => perform('darken'));

  document
    .querySelector('#lighten_output_trigger')
    .addEventListener('click', () => perform('lighten'));
}

window.addEventListener('DOMContentLoaded', () => {
  initInput();
  initOutputs();
  // initSliders();
});
