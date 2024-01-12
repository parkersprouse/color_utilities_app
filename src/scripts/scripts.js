// https://tauri.app/v1/guides/features/command
import '@material/web/button/filled-tonal-button.js';
import '@material/web/slider/slider.js';
import Alwan from 'alwan';
import tinycolor from 'tinycolor2';

const { invoke } = window.__TAURI__.tauri;

let picker;
let dl_trigger;
let slider;

function initInput() {
  picker = new Alwan('#input_picker', {
    popover: false,
    position: 'center',
    preset: false,
    theme: 'dark',
    toggle: false,
  });

  dl_trigger = document.querySelector('#dl_output_trigger');
}

function initOutputs() {
  document
    .querySelector('#dl_output_trigger')
    .addEventListener('click', async () => {
      const result = await invoke('adjust_dl', {
        input: picker.getColor().hex,
        percent: slider.value,
      });

      document.querySelector('#dl_output_field').value = tinycolor(result).toHexString();
      document.querySelector('#dl_output_display').style.backgroundColor = tinycolor(result).toHexString();
    });
}

function initSlider() {
  slider = document.querySelector('#dl_slider');
  const label = document.querySelector('#dl_label');
  if (!slider || !label) return;
  slider.addEventListener('input', (event) => {
    const { value } = event.target;
    dl_trigger.disabled = !value;
    if (!value) label.textContent = '';
    else if (value < 0) label.textContent = `${Math.abs(value)}% Darker`;
    else label.textContent = `${value}% Lighter`;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initInput();
  initOutputs();
  initSlider();
});
