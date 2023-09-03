// https://tauri.app/v1/guides/features/command
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs::{File, DirBuilder},
    io::{
        BufRead,
        BufReader,
        Error,
        Write
    }
};
use tauri::api::{
    path,
    process::{
        Command,
        CommandEvent
    }
};

async fn create_tmp_file(window: tauri::Window, app_handle: &tauri::AppHandle, input: String, percent: i32) -> Result<(), Error> {
    DirBuilder::new().recursive(true).create(app_handle.path_resolver().app_local_data_dir().unwrap()).unwrap();

    let input_file_path = app_handle.path_resolver().app_local_data_dir().unwrap().join("input.scss");
    let output_file_path = app_handle.path_resolver().app_local_data_dir().unwrap().join("output.css");

    let mut input_file = File::create(&input_file_path)?;
    write!(input_file, "{}", format!("@use 'sass:color';
    :root {{
        $input: {};
        --output: #{{color.scale($input, $lightness: {}%)}};
    }}", input, percent))?;

    let (mut rx, mut child) = Command::new_sidecar("sass")
        .expect("failed to create `sass` binary command")
        .args([
            "--no-source-map",
            &format!("\"{}\"", input_file_path.to_str().unwrap()),
            &format!("\"{}\"", output_file_path.to_str().unwrap())
        ])
        .spawn()
        .expect("Failed to spawn `sass` sidecar");

    // let result = tauri::async_runtime::spawn(async move {
    //     while let Some(_event) = rx.recv().await {};
    // }).await.unwrap();
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line) = event {
                // println!("{}", line);
                window
                    .emit("message", Some(format!("'{}'", line)))
                    .expect("failed to emit event");
                child.write("message from Rust\n".as_bytes()).unwrap();
            }
        }
    }).await.expect("Failed to wait for SASS command");

    println!("After the SCSS translation");

    let output_file = File::open(output_file_path)?;
    let output_contents = BufReader::new(output_file);

    for line in output_contents.lines() {
        println!("{}", line?);
    }

    Ok(())
}

#[tauri::command]
async fn darken(app_handle: tauri::AppHandle, input: String, percent: i32) -> String {
    create_tmp_file(&app_handle, input, percent).await.expect("Failed to perform SASS parsing");
    app_handle.path_resolver().app_local_data_dir().unwrap().display().to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![darken])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
