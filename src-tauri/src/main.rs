// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::process::{
  Command,
  CommandEvent
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
  let (mut rx, mut _child) = Command::new_sidecar("sass")
    .expect("failed to create `sass` binary command")
    .args(["--version"])
    .spawn()
    .expect("Failed to spawn `sass` sidecar");

  tauri::async_runtime::spawn(async move {
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        // child.write("message from Rust\n".as_bytes()).unwrap();
        println!("{}", line);
      }
    }
  });

  format!("You provided the parameter {}", name)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
