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

let soalSaatIni = 0;
let jawabanSiswa = []; 
let statusRagu = [];   
let dataSiswa = { nama: "", kelas: "" };

function mulaiUjian() {
    dataSiswa.nama = document.getElementById("input-nama").value;
    dataSiswa.kelas = document.getElementById("input-kelas").value;

    if (dataSiswa.nama === "" || dataSiswa.kelas === "") {
        alert("Mohon isi Nama dan Kelas terlebih dahulu!");
        return;
    }

    jawabanSiswa = new Array(bankSoal.length).fill(null);
    statusRagu = new Array(bankSoal.length).fill(false);

    document.getElementById("halaman-login").style.display = "none";
    document.getElementById("halaman-ujian").style.display = "block";
    document.getElementById("info-siswa").innerText = dataSiswa.nama + " (" + dataSiswa.kelas + ")";
    
    tampilkanSoal();
}

function tampilkanSoal() {
    const soal = bankSoal[soalSaatIni];
    document.getElementById("nomor-soal").innerText = "Soal " + (soalSaatIni + 1) + " dari " + bankSoal.length;
    document.getElementById("teks-soal").innerText = soal.pertanyaan;
    
    const wadahOpsi = document.getElementById("wadah-opsi");
    wadahOpsi.innerHTML = "";

    // JIKA SOAL PILIHAN GANDA
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
    } 
    // JIKA SOAL ESAI/PARAGRAF
    else if (soal.tipe === "esai") {
        const elemenEsai = document.createElement("textarea");
        elemenEsai.className = "input-esai";
        elemenEsai.placeholder = "Ketik jawaban refleksi kamu di sini secara detail...";
        
        // Memunculkan kembali teks jika siswa menekan tombol "Kembali"
        if (jawabanSiswa[soalSaatIni] !== null) {
            elemenEsai.value = jawabanSiswa[soalSaatIni];
        }

        // Menyimpan ketikan siswa secara langsung
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

    // Tombol ragu hanya untuk pilihan ganda
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

function kirimNilai() {
    // Validasi: Cek apakah ada yang belum dijawab (atau kosong untuk esai)
    for (let i = 0; i < bankSoal.length; i++) {
        if (bankSoal[i].tipe === "ganda" && jawabanSiswa[i] === null) {
            alert("Nomor " + (i+1) + " belum dijawab!"); return;
        }
        if (bankSoal[i].tipe === "esai" && (jawabanSiswa[i] === null || jawabanSiswa[i].trim() === "")) {
            alert("Esai nomor " + (i+1) + " tidak boleh kosong!"); return;
        }
    }

    let skorAkhirPG = 0;
    let jumlahPG = 0;
    let daftarEsai = [];

    // Pemisahan penilaian otomatis (PG) dan pengumpulan teks (Esai)
    for (let i = 0; i < bankSoal.length; i++) {
        if (bankSoal[i].tipe === "ganda") {
            jumlahPG++;
            if (jawabanSiswa[i] === bankSoal[i].jawabanBenar) {
                skorAkhirPG += 1;
            }
        } else if (bankSoal[i].tipe === "esai") {
            // Merangkai jawaban esai menjadi satu paragraf panjang untuk Google Sheets
            daftarEsai.push("Soal " + (i+1) + ": " + jawabanSiswa[i]);
        }
    }

    // Kalkulasi nilai 100 khusus untuk PG
    let nilaiTotal = (jumlahPG > 0) ? Math.round((skorAkhirPG / jumlahPG) * 100) : 0;
    let gabunganEsai = daftarEsai.join("\n\n---\n"); // Pemisah antar jawaban esai

    document.getElementById("halaman-ujian").style.display = "none";
    document.getElementById("halaman-selesai").style.display = "block";
    document.getElementById("pesan-status").innerText = "Sedang mengirim laporan refleksi proyek Anda...";

    const dataKirim = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas,
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
        let pesanAkhir = "Laporan Refleksi berhasil dikirim!";
        if (jumlahPG > 0) pesanAkhir += "\nSkor Pilihan Ganda: " + nilaiTotal;
        document.getElementById("pesan-status").innerText = pesanAkhir;
    })
    .catch(error => {
        document.getElementById("pesan-status").innerText = "Terjadi kesalahan koneksi. Lapor ke guru pendamping.";
    });
}
