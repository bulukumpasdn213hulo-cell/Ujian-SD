// --- 1. KONFIGURASI ---
const URL_DATABASE = "https://script.google.com/macros/s/AKfycbwzcZWkup1RTL1v-9qDJgoTI3npt-ys5w0l0c7Zfig9ZQV8UdbcE1VHzOsuiT3DJId7/exec";
const WAKTU_UJIAN_MENIT = 60; 

let bankSoal = []; // Sekarang kosong, akan diisi otomatis dari Google Sheets
let soalSaatIni = 0;
let jawabanSiswa = []; 
let statusRagu = [];   
let dataSiswa = { nama: "", kelas: "", mapel: "" };
let sisaWaktu;
let intervalWaktu;

// --- 2. FUNGSI UTAMA ---

async function mulaiUjian() {
    dataSiswa.nama = document.getElementById("input-nama").value;
    dataSiswa.kelas = document.getElementById("input-kelas").value;
    dataSiswa.mapel = document.getElementById("input-mapel").value;

    if (!dataSiswa.nama || !dataSiswa.kelas || !dataSiswa.mapel) {
        alert("Mohon lengkapi Nama, Kelas, dan Proyek!"); return;
    }

    // Tampilkan pesan loading sementara mengambil soal
    const tombolMulai = document.querySelector("#halaman-login button");
    const teksAsli = tombolMulai.innerText;
    tombolMulai.innerText = "Mengunduh Soal... Mohon Tunggu";
    tombolMulai.disabled = true;

    try {
        // MENGAMBIL SOAL DARI GOOGLE SHEETS (Fungsi doGet)
        const response = await fetch(URL_DATABASE);
        bankSoal = await response.json();

        if (bankSoal.length === 0) {
            alert("Bank soal kosong! Mohon isi data soal di Google Sheets.");
            tombolMulai.innerText = teksAsli;
            tombolMulai.disabled = false;
            return;
        }

        // Persiapan Lembar Jawaban
        jawabanSiswa = new Array(bankSoal.length).fill(null);
        statusRagu = new Array(bankSoal.length).fill(false);

        // Masuk ke Halaman Ujian
        document.getElementById("halaman-login").style.display = "none";
        document.getElementById("halaman-ujian").style.display = "block";
        document.getElementById("info-siswa").innerText = dataSiswa.nama;
        
        sisaWaktu = WAKTU_UJIAN_MENIT * 60;
        jalankanTimer();
        renderKotakNavigasi(); 
        tampilkanSoal();

    } catch (error) {
        console.error("Gagal mengambil soal:", error);
        alert("Gagal terhubung ke bank soal. Pastikan koneksi internet stabil.");
        tombolMulai.innerText = teksAsli;
        tombolMulai.disabled = false;
    }
}

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
        kotak.onclick = () => lompatKeSoal(i); 
        grid.appendChild(kotak);
    }
}

function lompatKeSoal(index) {
    soalSaatIni = index;
    tampilkanSoal();
}

function updateStatusUI() {
    const kotakSoal = document.getElementById("grid-kotak-soal").children;
    let jumlahTerjawab = 0;

    for (let i = 0; i < bankSoal.length; i++) {
        kotakSoal[i].classList.remove("aktif", "terjawab", "ragu");
        if (i === soalSaatIni) kotakSoal[i].classList.add("aktif");

        let sudahDijawab = false;
        if (bankSoal[i].tipe === "ganda" && jawabanSiswa[i] !== null) sudahDijawab = true;
        if (bankSoal[i].tipe === "esai" && jawabanSiswa[i] !== null && jawabanSiswa[i].trim() !== "") sudahDijawab = true;

        if (sudahDijawab) {
            jumlahTerjawab++;
            if (statusRagu[i]) {
                kotakSoal[i].classList.add("ragu"); 
            } else {
                kotakSoal[i].classList.add("terjawab"); 
            }
        }
    }

    let persentase = (jumlahTerjawab / bankSoal.length) * 100;
    document.getElementById("progress-bar").style.width = persentase + "%";
    document.getElementById("teks-progress").innerText = Math.round(persentase) + "% Selesai";
}

function tampilkanSoal() {
    const soal = bankSoal[soalSaatIni];
    document.getElementById("teks-soal").innerText = (soalSaatIni + 1) + ". " + soal.pertanyaan;
    
    const wadahOpsi = document.getElementById("wadah-opsi");
    wadahOpsi.innerHTML = "";

    if (soal.tipe === "ganda") {
        soal.opsi.forEach((teksOpsi, index) => {
            const elemenOpsi = document.createElement("div");
            elemenOpsi.className = "opsi-jawaban";
            if (jawabanSiswa[soalSaatIni] === index) {
                elemenOpsi.classList.add("terpilih");
                if (statusRagu[soalSaatIni]) elemenOpsi.classList.add("ragu");
            }
            elemenOpsi.innerText = teksOpsi;
            elemenOpsi.onclick = () => pilihJawabanGanda(elemenOpsi, index);
            wadahOpsi.appendChild(elemenOpsi);
        });
    } else if (soal.tipe === "esai") {
        const elemenEsai = document.createElement("textarea");
        elemenEsai.className = "input-esai";
        elemenEsai.placeholder = "Ketik jawaban/laporan di sini...";
        if (jawabanSiswa[soalSaatIni] !== null) elemenEsai.value = jawabanSiswa[soalSaatIni];

        elemenEsai.oninput = (e) => {
            jawabanSiswa[soalSaatIni] = e.target.value;
            updateStatusUI(); 
            aturTombolNavigasi();
        };
        wadahOpsi.appendChild(elemenEsai);
    }

    aturTombolNavigasi();
    updateStatusUI(); 
}

function pilihJawabanGanda(elemen, index) {
    const semuaOpsi = document.querySelectorAll(".opsi-jawaban");
    semuaOpsi.forEach(opsi => { opsi.classList.remove("terpilih", "ragu"); });

    elemen.classList.add("terpilih");
    jawabanSiswa[soalSaatIni] = index; 
    statusRagu[soalSaatIni] = false;   
    
    updateStatusUI(); 
    aturTombolNavigasi();
}

function tandaiRagu() {
    if (bankSoal[soalSaatIni].tipe === "ganda" && jawabanSiswa[soalSaatIni] !== null) {
        statusRagu[soalSaatIni] = !statusRagu[soalSaatIni]; 
        tampilkanSoal(); 
    }
}

function soalSelanjutnya() { if (soalSaatIni < bankSoal.length - 1) { soalSaatIni++; tampilkanSoal(); } }
function soalSebelumnya() { if (soalSaatIni > 0) { soalSaatIni--; tampilkanSoal(); } }

function aturTombolNavigasi() {
    const soal = bankSoal[soalSaatIni];
    document.getElementById("tombol-kembali").style.display = (soalSaatIni === 0) ? "none" : "block";

    if (soal.tipe === "ganda" && jawabanSiswa[soalSaatIni] !== null) {
        document.getElementById("tombol-ragu").style.display = "block";
        document.getElementById("tombol-ragu").innerText = statusRagu[soalSaatIni] ? "Batal Ragu" : "Ragu-ragu";
    } else {
        document.getElementById("tombol-ragu").style.display = "none";
    }

    if (soalSaatIni === bankSoal.length - 1) {
        document.getElementById("tombol-lanjut").style.display = "none";
        document.getElementById("tombol-kirim").style.display = "block";
    } else {
        document.getElementById("tombol-lanjut").style.display = "block";
        document.getElementById("tombol-kirim").style.display = "none";
    }
}

function kirimNilai(waktuHabis) {
    if (!waktuHabis) {
        for (let i = 0; i < bankSoal.length; i++) {
            if (bankSoal[i].tipe === "ganda" && jawabanSiswa[i] === null) {
                lompatKeSoal(i);
                alert("Nomor " + (i+1) + " belum dijawab!"); return;
            }
            if (bankSoal[i].tipe === "esai" && (jawabanSiswa[i] === null || jawabanSiswa[i].trim() === "")) {
                lompatKeSoal(i);
                alert("Nomor " + (i+1) + " tidak boleh kosong!"); return;
            }
        }
    }

    clearInterval(intervalWaktu);

    let jumlahBenar = 0;
    let jumlahPG = 0;
    let daftarEsai = [];
    let poinPerSoal = []; 

    for (let i = 0; i < bankSoal.length; i++) {
        if (bankSoal[i].tipe === "ganda") {
            jumlahPG++;
            if (jawabanSiswa[i] === bankSoal[i].jawabanBenar) {
                jumlahBenar++; poinPerSoal.push(1); 
            } else {
                poinPerSoal.push(0); 
            }
        } else if (bankSoal[i].tipe === "esai") {
            let teksJawaban = jawabanSiswa[i] ? jawabanSiswa[i] : "(Kosong)";
            daftarEsai.push("Soal " + (i+1) + ": " + teksJawaban);
        }
    }

    let nilaiTotal = (jumlahPG > 0) ? Math.round((jumlahBenar / jumlahPG) * 100) : 0;
    let gabunganEsai = daftarEsai.join("\n\n---\n"); 

    document.getElementById("halaman-ujian").style.display = "none";
    document.getElementById("halaman-selesai").style.display = "block";
    document.getElementById("hasil-benar").innerText = jumlahBenar;
    document.getElementById("hasil-salah").innerText = jumlahPG - jumlahBenar;
    document.getElementById("hasil-total").innerText = nilaiTotal;

    const dataKirim = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas,
        mapel: dataSiswa.mapel, 
        poin: poinPerSoal, 
        nilai: nilaiTotal,
        esai: gabunganEsai
    };

    fetch(URL_DATABASE, {
        method: "POST",
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataKirim)
    })
    .then(() => {
        document.getElementById("pesan-status").innerText = "Laporan sukses terkirim ke markas guru!";
    })
    .catch(error => {
        document.getElementById("pesan-status").innerText = "Gagal mengirim. Mohon lapor ke pengawas.";
    });
}
