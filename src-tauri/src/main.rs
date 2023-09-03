// https://tauri.app/v1/guides/features/command
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::process::{Command, CommandEvent};

#[tauri::command]
async fn darken(input: String, percent: i32) -> String {
    let (mut rx, mut child) = Command::new_sidecar("sass")
        .unwrap()
        .args(["--stdin"])
        .spawn()
        .unwrap();

    child
        .write(
            format!(
                "@use 'sass:color'; :root {{ $input: {}; --output: #{{color.scale($input, $lightness: -{}%)}}; }}",
                input, percent
            ).as_bytes()
        )
        .unwrap();
    drop(child);

    let mut output = String::new();
    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            if line.contains("--output: #") {
                output.push_str(&line);
            }
        } else if let CommandEvent::Terminated(payload) = event {
            if payload.code.unwrap() != 0 {
                panic!("SASS command failed");
            }
        }
    }

    output
        .replace("--output:", "")
        .replace(';', "")
        .trim()
        .to_string()
}

#[tauri::command]
async fn lighten(input: String, percent: i32) -> String {
    let (mut rx, mut child) = Command::new_sidecar("sass")
        .unwrap()
        .args(["--stdin"])
        .spawn()
        .unwrap();

    child
        .write(
            format!(
                "@use 'sass:color'; :root {{ $input: {}; --output: #{{color.scale($input, $lightness: {}%)}}; }}",
                input, percent
            ).as_bytes()
        )
        .unwrap();
    drop(child);

    let mut output = String::new();
    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            if line.contains("--output: #") {
                output.push_str(&line);
            }
        }
    }

    output
        .replace("--output:", "")
        .replace(';', "")
        .trim()
        .to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![darken, lighten])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
