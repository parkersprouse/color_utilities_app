// https://tauri.app/v1/guides/features/command
// const { invoke } = window.__TAURI__.tauri;

/*
async function greet() {
  greetMsgEl.textContent = await invoke('greet', { name: greetInputEl.value });
}
*/

window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input_color');
  const btn = document.getElementById('picker_trigger');
  window.__APP__.ColorPicker(btn, '#000000');

  btn.addEventListener('colorChange', (event) => {
    input.value = event.detail.color.hexa;
  });
});
