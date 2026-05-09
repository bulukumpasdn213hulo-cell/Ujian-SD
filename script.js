// GANTI URL DI BAWAH INI DENGAN URL WEB APP GOOGLE SCRIPT ANDA
const URL_DATABASE = "https://script.google.com/macros/s/AKfycbwzcZWkup1RTL1v-9qDJgoTI3npt-ys5w0l0c7Zfig9ZQV8UdbcE1VHzOsuiT3DJId7/exec";

// Bank Soal (Bisa ditambah atau diubah sesuai materi IPAS/lainnya)
const bankSoal = [
    {
        pertanyaan: "Siapakah nama Bapak Pandu Sedunia?",
        opsi: ["Baden Powell", "William Smith", "Ir. Soekarno", "Sri Sultan Hamengkubuwono IX"],
        jawabanBenar: 0
    },
    {
        pertanyaan: "Siapakah tokoh yang dikenal sebagai Bapak Pramuka Indonesia?",
        opsi: ["Ki Hajar Dewantara", "Jenderal Sudirman", "Sri Sultan Hamengkubuwono IX", "B.J. Habibie"],
        jawabanBenar: 2
    },
    {
        pertanyaan: "Lambang Gerakan Pramuka di Indonesia adalah...",
        opsi: ["Bintang emas", "Pohon beringin", "Tunas kelapa", "Padi dan kapas"],
        jawabanBenar: 2
    },
    {
        pertanyaan: "Hari Pramuka di Indonesia diperingati setiap tanggal...",
        opsi: ["14 Agustus", "17 Agustus", "2 Mei", "1 Juni"],
        jawabanBenar: 0
    },
    {
        pertanyaan: "Golongan Pramuka untuk anak seusia 7 sampai 10 tahun disebut...",
        opsi: ["Penggalang", "Siaga", "Penegak", "Pandega"],
        jawabanBenar: 1
    },
    {
        pertanyaan: "Warna pakaian seragam utama Gerakan Pramuka adalah...",
        opsi: ["Merah dan Putih", "Hijau Muda dan Hijau Tua", "Biru Tua dan Biru Muda", "Cokelat Tua dan Cokelat Muda"],
        jawabanBenar: 3
    },
    {
        pertanyaan: "Janji atau kode kehormatan bagi Pramuka Siaga disebut...",
        opsi: ["Dwi Satya", "Tri Satya", "Dasa Darma", "Dwi Darma"],
        jawabanBenar: 0
    },
    {
        pertanyaan: "Bunyi Dasa Darma Pramuka yang pertama adalah...",
        opsi: ["Cinta alam dan kasih sayang sesama manusia", "Takwa kepada Tuhan Yang Maha Esa", "Patuh dan suka bermusyawarah", "Rajin, terampil, dan gembira"],
        jawabanBenar: 1
    },
    {
        pertanyaan: "Satuan kelompok terkecil dalam Pramuka Siaga disebut...",
        opsi: ["Regu", "Sangga", "Barung", "Reka"],
        jawabanBenar: 2
    },
    {
        pertanyaan: "Berapa kali jumlah tepukan pada 'Tepuk Pramuka'?",
        opsi: ["10 kali", "12 kali", "13 kali", "15 kali"],
        jawabanBenar: 2
    }
];

let soalSaatIni = 0;
let jawabanSiswa = []; // Mengingat jawaban siswa
let statusRagu = [];   // Mengingat mana yang ragu-ragu
let dataSiswa = { nama: "", kelas: "" };

function mulaiUjian() {
    dataSiswa.nama = document.getElementById("input-nama").value;
    dataSiswa.kelas = document.getElementById("input-kelas").value;

    if (dataSiswa.nama === "" || dataSiswa.kelas === "") {
        alert("Mohon isi Nama dan Kelas terlebih dahulu!");
        return;
    }

    // Menyiapkan lembar jawaban kosong sebanyak jumlah soal
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

    // Memunculkan opsi dan mengecek apakah sebelumnya sudah dijawab
    soal.opsi.forEach((teksOpsi, index) => {
        const elemenOpsi = document.createElement("div");
        elemenOpsi.className = "opsi-jawaban";
        
        // Memulihkan warna jika sudah dijawab atau ragu-ragu sebelumnya
        if (jawabanSiswa[soalSaatIni] === index) {
            elemenOpsi.classList.add("terpilih");
            if (statusRagu[soalSaatIni]) {
                elemenOpsi.classList.add("ragu");
            }
        }

        elemenOpsi.innerText = teksOpsi;
        elemenOpsi.onclick = () => pilihJawaban(elemenOpsi, index);
        wadahOpsi.appendChild(elemenOpsi);
    });

    aturTombolNavigasi();
}

function pilihJawaban(elemen, index) {
    const semuaOpsi = document.querySelectorAll(".opsi-jawaban");
    semuaOpsi.forEach(opsi => {
        opsi.classList.remove("terpilih");
        opsi.classList.remove("ragu");
    });

    elemen.classList.add("terpilih");
    jawabanSiswa[soalSaatIni] = index; // Simpan jawaban ke memori
    statusRagu[soalSaatIni] = false;   // Hilangkan status ragu jika memilih ulang
    
    aturTombolNavigasi();
}

function tandaiRagu() {
    if (jawabanSiswa[soalSaatIni] !== null) {
        statusRagu[soalSaatIni] = !statusRagu[soalSaatIni]; // Ubah status ragu
        tampilkanSoal(); // Segarkan tampilan
    } else {
        alert("Pilih jawaban terlebih dahulu sebelum menandai ragu-ragu!");
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
    // Tombol Kembali
    document.getElementById("tombol-kembali").style.display = (soalSaatIni === 0) ? "none" : "block";

    // Tombol Ragu-ragu muncul jika sudah ada jawaban
    document.getElementById("tombol-ragu").style.display = (jawabanSiswa[soalSaatIni] !== null) ? "block" : "none";
    document.getElementById("tombol-ragu").innerText = statusRagu[soalSaatIni] ? "Batal Ragu" : "Ragu-ragu";

    // Tombol Lanjut dan Kirim
    if (soalSaatIni === bankSoal.length - 1) {
        document.getElementById("tombol-lanjut").style.display = "none";
        document.getElementById("tombol-kirim").style.display = "block";
    } else {
        document.getElementById("tombol-lanjut").style.display = "block";
        document.getElementById("tombol-kirim").style.display = "none";
    }
}

function kirimNilai() {
    // Cek apakah ada soal yang belum dijawab
    if (jawabanSiswa.includes(null)) {
        alert("Masih ada soal yang belum dijawab. Silakan periksa kembali!");
        return;
    }

    // Hitung skor akhir
    let skorAkhir = 0;
    for (let i = 0; i < bankSoal.length; i++) {
        if (jawabanSiswa[i] === bankSoal[i].jawabanBenar) {
            skorAkhir += (100 / bankSoal.length);
        }
    }

    document.getElementById("halaman-ujian").style.display = "none";
    document.getElementById("halaman-selesai").style.display = "block";

    const dataKirim = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas,
        nilai: Math.round(skorAkhir)
    };

    fetch(URL_DATABASE, {
        method: "POST",
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataKirim)
    })
    .then(() => {
        document.getElementById("pesan-status").innerText = "Selesai! Nilai Anda (" + Math.round(skorAkhir) + ") berhasil dikirim.";
    })
    .catch(error => {
        document.getElementById("pesan-status").innerText = "Terjadi kesalahan. Silakan lapor ke guru.";
    });
}
