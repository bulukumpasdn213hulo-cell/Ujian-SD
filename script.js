// --- 1. KONFIGURASI ---
const URL_DATABASE = "https://script.google.com/macros/s/AKfycbwzcZWkup1RTL1v-9qDJgoTI3npt-ys5w0l0c7Zfig9ZQV8UdbcE1VHzOsuiT3DJId7/exec";
const WAKTU_UJIAN_MENIT = 60; 

let bankSoal = []; 
let soalSaatIni = 0;
let jawabanSiswa = []; 
let statusRagu = [];   
let dataSiswa = { nama: "", kelas: "", mapel: "" };
let sisaWaktu;
let intervalWaktu;

// --- 2. FUNGSI LOGIN & VERIFIKASI ---
async function mulaiUjian() {
    dataSiswa.nama = document.getElementById("input-nama").value;
    dataSiswa.kelas = document.getElementById("input-kelas").value;
    dataSiswa.mapel = document.getElementById("input-mapel").value;
    const inputToken = document.getElementById("input-token").value;

    if (!dataSiswa.nama || !dataSiswa.kelas || !dataSiswa.mapel || !inputToken) {
        alert("Mohon lengkapi semua data, termasuk Token!"); return;
    }

    const tombolMulai = document.querySelector("#halaman-login button");
    const teksAsli = tombolMulai.innerText;
    tombolMulai.innerText = "Memverifikasi... Mohon Tunggu";
    tombolMulai.disabled = true;

    try {
        const response = await fetch(URL_DATABASE);
        const dataServer = await response.json();
        
        // 1. Verifikasi Token
        const tokenAsli = dataServer.tokens[dataSiswa.mapel];
        if (!tokenAsli || tokenAsli !== inputToken) {
            alert("TOKEN SALAH untuk mata pelajaran " + dataSiswa.mapel + "!");
            tombolMulai.innerText = teksAsli;
            tombolMulai.disabled = false;
            return;
        }

        // 2. Filter Soal berdasarkan Mapel & Kelas
        bankSoal = dataServer.soal.filter(s => s.mapel === dataSiswa.mapel && s.kelas === dataSiswa.kelas);
        
        if (bankSoal.length === 0) {
            alert("Maaf, soal untuk " + dataSiswa.mapel + " " + dataSiswa.kelas + " belum tersedia.");
            tombolMulai.innerText = teksAsli;
            tombolMulai.disabled = false;
            return;
        }

        // 3. Lapor Login ke Admin
        fetch(URL_DATABASE, {
            method: "POST",
            mode: 'no-cors',
            body: JSON.stringify({ 
                action: "loginSiswa", 
                nama: dataSiswa.nama, 
                kelas: dataSiswa.kelas, 
                mapel: dataSiswa.mapel 
            })
        });

        // 4. Masuk ke Halaman Ujian
        jawabanSiswa = new Array(bankSoal.length).fill(null);
        statusRagu = new Array(bankSoal.length).fill(false);

        document.getElementById("halaman-login").style.display = "none";
        document.getElementById("halaman-ujian").style.display = "block";
        document.getElementById("info-siswa").innerText = dataSiswa.nama + " (" + dataSiswa.mapel + ")";
        
        sisaWaktu = WAKTU_UJIAN_MENIT * 60;
        jalankanTimer();
        renderKotakNavigasi(); 
        tampilkanSoal();

    } catch (error) {
        console.error(error);
        alert("Gagal terhubung ke database. Pastikan link Apps Script benar dan sudah di-deploy sebagai 'Anyone'.");
        tombolMulai.innerText = teksAsli;
        tombolMulai.disabled = false;
    }
}

// --- 3. LOGIKA TIMER & NAVIGASI ---
function jalankanTimer() {
    clearInterval(intervalWaktu);
    intervalWaktu = setInterval(() => {
        sisaWaktu--;
        let menit = Math.floor(sisaWaktu / 60);
        let detik = sisaWaktu % 60;
        document.getElementById("waktu-mundur").innerText = 
            (menit < 10 ? "0" + menit : menit) + ":" + (detik < 10 ? "0" + detik : detik);

        if (sisaWaktu <= 0) {
            clearInterval(intervalWaktu);
            alert("Waktu habis! Laporan dikirim otomatis.");
            kirimNilai(true);
        }
    }, 1000);
}

function renderKotakNavigasi() {
    const grid = document.getElementById("grid-kotak-soal");
    grid.innerHTML = "";
    for (let i = 0; i < bankSoal.length; i++) {
        const kotak = document.createElement("div");
        kotak.className = "kotak-soal";
        kotak.innerText = i + 1;
        kotak.onclick = () => { soalSaatIni = i; tampilkanSoal(); }; 
        grid.appendChild(kotak);
    }
}

function updateStatusUI() {
    const kotakSoal = document.getElementById("grid-kotak-soal").children;
    let terjawab = 0;

    for (let i = 0; i < bankSoal.length; i++) {
        kotakSoal[i].classList.remove("aktif", "terjawab", "ragu");
        if (i === soalSaatIni) kotakSoal[i].classList.add("aktif");

        let isi = false;
        if (bankSoal[i].tipe === "ganda" && jawabanSiswa[i] !== null) isi = true;
        if (bankSoal[i].tipe === "esai" && jawabanSiswa[i] !== null && jawabanSiswa[i].trim() !== "") isi = true;

        if (isi) {
            terjawab++;
            if (statusRagu[i]) kotakSoal[i].classList.add("ragu");
            else kotakSoal[i].classList.add("terjawab");
        }
    }
    let persen = (terjawab / bankSoal.length) * 100;
    document.getElementById("progress-bar").style.width = persen + "%";
    document.getElementById("teks-progress").innerText = Math.round(persen) + "% Selesai";
}

function tampilkanSoal() {
    const soal = bankSoal[soalSaatIni];
    
    // FITUR GAMBAR: Menyusun HTML untuk teks soal dan gambar (jika ada)
    let htmlSoal = (soalSaatIni + 1) + ". " + soal.pertanyaan;
    
    if (soal.gambar && soal.gambar !== "") {
        htmlSoal += `<br><img src="${soal.gambar}" alt="Gambar Soal" style="max-width: 100%; max-height: 250px; margin-top: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">`;
    }
    
    // Menggunakan innerHTML agar tag <img> bisa dirender menjadi gambar sungguhan
    document.getElementById("teks-soal").innerHTML = htmlSoal;
    
    const wadah = document.getElementById("wadah-opsi");
    wadah.innerHTML = "";

    if (soal.tipe === "ganda") {
        soal.opsi.forEach((teks, idx) => {
            const div = document.createElement("div");
            div.className = "opsi-jawaban";
            if (jawabanSiswa[soalSaatIni] === idx) div.classList.add("terpilih");
            div.innerText = teks;
            div.onclick = () => {
                jawabanSiswa[soalSaatIni] = idx;
                statusRagu[soalSaatIni] = false;
                tampilkanSoal();
            };
            wadah.appendChild(div);
        });
    } else {
        const txt = document.createElement("textarea");
        txt.className = "input-esai";
        txt.value = jawabanSiswa[soalSaatIni] || "";
        txt.oninput = (e) => { jawabanSiswa[soalSaatIni] = e.target.value; updateStatusUI(); };
        wadah.appendChild(txt);
    }
    aturTombol();
    updateStatusUI();
}
function aturTombol() {
    document.getElementById("tombol-kembali").style.display = (soalSaatIni === 0) ? "none" : "inline-block";
    document.getElementById("tombol-lanjut").style.display = (soalSaatIni === bankSoal.length - 1) ? "none" : "inline-block";
    document.getElementById("tombol-kirim").style.display = (soalSaatIni === bankSoal.length - 1) ? "inline-block" : "none";
    document.getElementById("tombol-ragu").style.display = (bankSoal[soalSaatIni].tipe === "ganda") ? "inline-block" : "none";
    document.getElementById("tombol-ragu").innerText = statusRagu[soalSaatIni] ? "Batal Ragu" : "Ragu-ragu";
}

function soalSelanjutnya() { soalSaatIni++; tampilkanSoal(); }
function soalSebelumnya() { soalSaatIni--; tampilkanSoal(); }
function tandaiRagu() { statusRagu[soalSaatIni] = !statusRagu[soalSaatIni]; tampilkanSoal(); }

// --- 4. KIRIM HASIL AKHIR ---
function kirimNilai(waktuHabis) {
    if (!waktuHabis) {
        let kosong = jawabanSiswa.findIndex((j, i) => j === null || (bankSoal[i].tipe === "esai" && j.trim() === ""));
        if (kosong !== -1) { alert("Nomor " + (kosong+1) + " belum diisi!"); soalSaatIni = kosong; tampilkanSoal(); return; }
        if (!confirm("Kirim jawaban sekarang?")) return;
    }

    clearInterval(intervalWaktu);
    let benar = 0, pg = 0, esai = [], poin = [];

    bankSoal.forEach((s, i) => {
        if (s.tipe === "ganda") {
            pg++;
            if (jawabanSiswa[i] === s.jawabanBenar) { benar++; poin.push(1); } else { poin.push(0); }
        } else {
            esai.push("Soal " + (i+1) + ": " + (jawabanSiswa[i] || "(Kosong)"));
        }
    });

    let skor = pg > 0 ? Math.round((benar/pg)*100) : 0;
    
    document.getElementById("halaman-ujian").style.display = "none";
    document.getElementById("halaman-selesai").style.display = "block";
    document.getElementById("hasil-benar").innerText = benar;
    document.getElementById("hasil-salah").innerText = pg - benar;
    document.getElementById("hasil-total").innerText = skor;

    fetch(URL_DATABASE, {
        method: "POST",
        mode: 'no-cors',
        body: JSON.stringify({
            action: "submitNilai",
            nama: dataSiswa.nama, kelas: dataSiswa.kelas, mapel: dataSiswa.mapel,
            poin: poin, nilai: skor, esai: esai.join("\n\n---\n")
        })
    }).then(() => {
        document.getElementById("pesan-status").innerText = "Data sukses tersimpan di Google Sheets SD Negeri 213 Hulo!";
    });
}
