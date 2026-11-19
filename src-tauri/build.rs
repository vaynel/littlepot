fn main() {
    println!("cargo:rerun-if-changed=gen/rust-builtin-themes.json");
    tauri_build::build();
}
