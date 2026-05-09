// GANTI URL DI BAWAH INI DENGAN URL WEB APP GOOGLE SCRIPT ANDA
const URL_DATABASE = "https://script.google.com/macros/s/AKfycbwzcZWkup1RTL1v-9qDJgoTI3npt-ys5w0l0c7Zfig9ZQV8UdbcE1VHzOsuiT3DJId7/exec";

// FORMAT SOAL CAMPURAN (Pilihan Ganda & Esai)
const bankSoal = [
    {
        tipe: "ganda",
        pertanyaan: "Sebagai Detektif Plastik, jenis kemasan apa yang paling banyak kalian temukan berserakan di area kantin sekolah?",
        opsi: ["Daun pisang dan kertas minyak", "Botol air mineral PET", "Kantong kresek hitam", "Gelas plastik minuman ringan"],
        jawabanBenar: 3 // Kunci jawaban PG
    },
    {
        tipe: "esai",
        pertanyaan: "Ceritakan pengalaman kelompokmu hari ini. Solusi spesifik apa yang kalian temukan di lapangan untuk mengurangi jejak kemasan plastik tersebut?"
    },
    {
        tipe: "esai",
        pertanyaan: "Apa kendala terbesar yang kelompokmu hadapi saat mencoba mengedukasi teman-teman dari kelas lain tentang bahaya plastik?"
    }
];

// --- PENGATURAN WAKTU UJIAN (DALAM MENIT) ---
const WAKTU_UJIAN_MENIT = 60; 

let soalSaatIni = 0;
let jawabanSiswa = []; 
let statusRagu = [];   
let dataSiswa = { nama: "", kelas: "", mapel: "" };

let sisaWaktu;
let intervalWaktu;

function mulaiUjian() {
    dataSiswa.nama = document.getElementById("input-nama").value;
    dataSiswa.kelas = document.getElementById("input-kelas").value;
    dataSiswa.mapel = document.getElementById("input-mapel").value;

    if (dataSiswa.nama === "" || dataSiswa.kelas === "" || dataSiswa.mapel === "") {
        alert("Mohon lengkapi Nama, Kelas, dan Mata Pelajaran!");
        return;
    }

    jawabanSiswa = new Array(bankSoal.length).fill(null);
    statusRagu = new Array(bankSoal.length).fill(false);

    document.getElementById("halaman-login").style.display = "none";
    document.getElementById("halaman-ujian").style.display = "block";
    document.getElementById("info-siswa").innerText = dataSiswa.nama + " - " + dataSiswa.mapel;
    
    // Memulai hitung mundur
    sisaWaktu = WAKTU_UJIAN_MENIT * 60;
    jalankanTimer();
    
    tampilkanSoal();
}

function jalankanTimer() {
    clearInterval(intervalWaktu);
    intervalWaktu = setInterval(() => {
        sisaWaktu--;
        
        let menit = Math.floor(sisaWaktu / 60);
        let detik = sisaWaktu % 60;
        
        // Menambahkan angka 0 di depan jika di bawah 10
        let teksMenit = menit < 10 ? "0" + menit : menit;
        let teksDetik = detik < 10 ? "0" + detik : detik;
        
        document.getElementById("waktu-mundur").innerText = teksMenit + ":" + teksDetik;

        // Jika waktu habis
        if (sisaWaktu <= 0) {
            clearInterval(intervalWaktu);
            alert("Waktu ujian telah habis! Jawaban Anda akan dikirim secara otomatis.");
            kirimNilai(true); // true = abaikan peringatan soal kosong
        }
    }, 1000);
}

function tampilkanSoal() {
    const soal = bankSoal[soalSaatIni];
    document.getElementById("nomor-soal").innerText = "Soal " + (soalSaatIni + 1) + " dari " + bankSoal.length;
    document.getElementById("teks-soal").innerText = soal.pertanyaan;
    
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
        elemenEsai.placeholder = "Ketik jawaban refleksi kamu di sini...";
        
        if (jawabanSiswa[soalSaatIni] !== null) {
            elemenEsai.value = jawabanSiswa[soalSaatIni];
        }

        elemenEsai.oninput = (e) => {
            jawabanSiswa[soalSaatIni] = e.target.value;
            aturTombolNavigasi();
        };
        wadahOpsi.appendChild(elemenEsai);
    }

    aturTombolNavigasi();
}

function pilihJawabanGanda(elemen, index) {
    const semuaOpsi = document.querySelectorAll(".opsi-jawaban");
    semuaOpsi.forEach(opsi => {
        opsi.classList.remove("terpilih");
        opsi.classList.remove("ragu");
    });

    elemen.classList.add("terpilih");
    jawabanSiswa[soalSaatIni] = index; 
    statusRagu[soalSaatIni] = false;   
    
    aturTombolNavigasi();
}

function tandaiRagu() {
    if (bankSoal[soalSaatIni].tipe === "ganda" && jawabanSiswa[soalSaatIni] !== null) {
        statusRagu[soalSaatIni] = !statusRagu[soalSaatIni]; 
        tampilkanSoal(); 
    }
}

function soalSelanjutnya() {
    if (soalSaatIni < bankSoal.length - 1) {
        soalSaatIni++;
        tampilkanSoal();
    }
}

function soalSebelumnya() {
    if (soalSaatIni > 0) {
        soalSaatIni--;
        tampilkanSoal();
    }
}

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

// Parameter waktuHabis mendeteksi apakah sistem yang memaksa kirim atau siswa
function kirimNilai(waktuHabis) {
    // Jika dikirim manual oleh siswa, lakukan pengecekan soal kosong
    if (!waktuHabis) {
        for (let i = 0; i < bankSoal.length; i++) {
            if (bankSoal[i].tipe === "ganda" && jawabanSiswa[i] === null) {
                alert("Nomor " + (i+1) + " belum dijawab!"); return;
            }
            if (bankSoal[i].tipe === "esai" && (jawabanSiswa[i] === null || jawabanSiswa[i].trim() === "")) {
                alert("Esai nomor " + (i+1) + " tidak boleh kosong!"); return;
            }
        }
    }

    // Hentikan timer agar tidak terus berjalan di latar belakang
    clearInterval(intervalWaktu);

    let skorAkhirPG = 0;
    let jumlahPG = 0;
    let daftarEsai = [];

    for (let i = 0; i < bankSoal.length; i++) {
        if (bankSoal[i].tipe === "ganda") {
            jumlahPG++;
            if (jawabanSiswa[i] === bankSoal[i].jawabanBenar) {
                skorAkhirPG += 1;
            }
        } else if (bankSoal[i].tipe === "esai") {
            let teksJawaban = jawabanSiswa[i] ? jawabanSiswa[i] : "(Kosong karena waktu habis)";
            daftarEsai.push("Soal " + (i+1) + ": " + teksJawaban);
        }
    }

    let nilaiTotal = (jumlahPG > 0) ? Math.round((skorAkhirPG / jumlahPG) * 100) : 0;
    let gabunganEsai = daftarEsai.join("\n\n---\n"); 

    document.getElementById("halaman-ujian").style.display = "none";
    document.getElementById("halaman-selesai").style.display = "block";
    document.getElementById("pesan-status").innerText = "Sedang mengirim lembar jawaban Anda...";

    const dataKirim = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas,
        mapel: dataSiswa.mapel, // <-- Mengirim data mata pelajaran ke database
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
        let pesanAkhir = "Berhasil! Nilai Anda sudah masuk ke sistem sekolah.";
        if (jumlahPG > 0) pesanAkhir += "\nSkor Pilihan Ganda: " + nilaiTotal;
        document.getElementById("pesan-status").innerText = pesanAkhir;
    })
    .catch(error => {
        document.getElementById("pesan-status").innerText = "Terjadi kesalahan jaringan. Jangan tutup halaman ini dan lapor ke pengawas.";
    });
}
