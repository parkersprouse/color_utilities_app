// https://tauri.app/v1/guides/features/command
const { invoke } = window.__TAURI__.tauri;

async function initAction(action) {
  const result = await invoke(action, {
    input: document.getElementById('input_color').value,
    percent: 25,
  });

  document.getElementById(`${action}_output_field`).value = result;
  document.getElementById(`${action}_output_display`).style.backgroundColor =
    result;
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
    .addEventListener('click', () => {
      initAction('darken');
    });

  document
    .getElementById('lighten_output_trigger')
    .addEventListener('click', () => {
      initAction('lighten');
    });
}

window.addEventListener('DOMContentLoaded', () => {
  initInput();
  initOutputs();
});
