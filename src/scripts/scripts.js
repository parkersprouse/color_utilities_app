// https://tauri.app/v1/guides/features/command
const { invoke } = window.__TAURI__.tauri;

async function darken() {
  const output = document.getElementById('darken_output_field');
  output.value = await invoke('darken', {
    input: document.getElementById('input_color').value,
    percent: 25,
  });
}

async function lighten() {
  const output = document.getElementById('lighten_output_field');
  output.value = await invoke('lighten', {
    input: document.getElementById('input_color').value,
    percent: 25,
  });
}

function initInput() {
  const input = document.getElementById('input_color');
  const btn = document.getElementById('picker_trigger');
  window.__APP__.ColorPicker(btn, '#000000');

  btn.addEventListener('colorChange', (event) => {
    input.value = event.detail.color.hexa;
  });
}

function initOutputs() {
  document
    .getElementById('darken_output_trigger')
    .addEventListener('click', darken);

  document
    .getElementById('lighten_output_trigger')
    .addEventListener('click', lighten);
}

window.addEventListener('DOMContentLoaded', () => {
  initInput();
  initOutputs();
});
