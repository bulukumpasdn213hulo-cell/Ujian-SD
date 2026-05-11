const URL_DATABASE = "https://script.google.com/macros/s/AKfycbwzcZWkup1RTL1v-9qDJgoTI3npt-ys5w0l0c7Zfig9ZQV8UdbcE1VHzOsuiT3DJId7/exec";
const WAKTU_UJIAN_MENIT = 60; 

let bankSoal = []; 
let soalSaatIni = 0;
let jawabanSiswa = []; let statusRagu = [];   
let dataSiswa = { nama: "", kelas: "", mapel: "" };
let sisaWaktu; let intervalWaktu;

async function mulaiUjian() {
    dataSiswa.nama = document.getElementById("input-nama").value;
    dataSiswa.kelas = document.getElementById("input-kelas").value;
    dataSiswa.mapel = document.getElementById("input-mapel").value;
    const inputToken = document.getElementById("input-token").value;

    if (!dataSiswa.nama || !dataSiswa.kelas || !dataSiswa.mapel || !inputToken) {
        return alert("Mohon lengkapi semua data, termasuk Token!");
    }

    const tombolMulai = document.querySelector("#halaman-login button");
    tombolMulai.innerText = "Memverifikasi... Mohon Tunggu";
    tombolMulai.disabled = true;

    try {
        const response = await fetch(URL_DATABASE);
        const dataServer = await response.json();
        
        // 1. VERIFIKASI TOKEN DARI DATABASE
        const tokenAsli = dataServer.tokens[dataSiswa.mapel];
        if (tokenAsli !== inputToken) {
            alert("TOKEN SALAH! Silakan minta token yang benar kepada Guru pengawas.");
            tombolMulai.innerText = "Mulai Kerjakan";
            tombolMulai.disabled = false;
            return;
        }

        // 2. FILTER SOAL
        bankSoal = dataServer.soal.filter(s => s.mapel === dataSiswa.mapel && s.kelas === dataSiswa.kelas);
        if (bankSoal.length === 0) {
            alert("Maaf, soal untuk " + dataSiswa.mapel + " tingkat " + dataSiswa.kelas + " belum tersedia.");
            tombolMulai.innerText = "Mulai Kerjakan"; tombolMulai.disabled = false; return;
        }

        // 3. LAPORKAN KE ADMIN BAHWA SISWA INI SUDAH LOGIN
        fetch(URL_DATABASE, {
            method: "POST", mode: 'no-cors',
            body: JSON.stringify({ action: "loginSiswa", nama: dataSiswa.nama, kelas: dataSiswa.kelas, mapel: dataSiswa.mapel })
        });

        // 4. MASUK KE UJIAN
        jawabanSiswa = new Array(bankSoal.length).fill(null);
        statusRagu = new Array(bankSoal.length).fill(false);

        document.getElementById("halaman-login").style.display = "none";
        document.getElementById("halaman-ujian").style.display = "block";
        document.getElementById("info-siswa").innerText = dataSiswa.nama;
        
        sisaWaktu = WAKTU_UJIAN_MENIT * 60;
        jalankanTimer(); renderKotakNavigasi(); tampilkanSoal();

    } catch (error) {
        alert("Gagal terhubung. Cek internet Anda.");
        tombolMulai.innerText = "Mulai Kerjakan"; tombolMulai.disabled = false;
    }
}

// === FUNGSI LAINNYA TETAP SAMA (Timer, Navigasi, Tampil Soal) ===
// (Salin fungsi jalankanTimer, renderKotakNavigasi, tampilkanSoal, dll dari script Anda sebelumnya ke sini)

function kirimNilai(waktuHabis) {
    // ... (Validasi soal kosong sama seperti sebelumnya) ...
    
    // ... (Perhitungan nilai sama seperti sebelumnya) ...
    
    // FITUR BARU: Tambahkan action "submitNilai" saat fetch
    const dataKirim = {
        action: "submitNilai", // <--- PENTING UNTUK ROUTING DI APPS SCRIPT
        nama: dataSiswa.nama, kelas: dataSiswa.kelas, mapel: dataSiswa.mapel, 
        poin: poinPerSoal, nilai: nilaiTotal, esai: gabunganEsai
    };

    fetch(URL_DATABASE, {
        method: "POST", mode: 'no-cors',
        body: JSON.stringify(dataKirim)
    }).then(() => {
        document.getElementById("pesan-status").innerText = "Laporan sukses terkirim!";
    });
}
