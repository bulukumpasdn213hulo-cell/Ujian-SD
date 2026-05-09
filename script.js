// GANTI URL DI BAWAH INI DENGAN URL WEB APP GOOGLE SCRIPT ANDA
const URL_DATABASE = "https://script.google.com/macros/s/AKfycbwzcZWkup1RTL1v-9qDJgoTI3npt-ys5w0l0c7Zfig9ZQV8UdbcE1VHzOsuiT3DJId7/exec";

// Bank Soal (Bisa ditambah atau diubah sesuai materi IPAS/lainnya)
const bankSoal = [
    {
        pertanyaan: "Tindakan mana yang paling tepat untuk mengurangi jejak kemasan plastik di lingkungan sekolah?",
        opsi: ["Membakar sampah plastik di belakang sekolah", "Membawa botol minum sendiri dari rumah", "Mengubur plastik di dalam tanah", "Membuang plastik ke sungai"],
        jawabanBenar: 1 // Ingat: urutan dimulai dari 0. Jadi indeks 1 adalah opsi kedua.
    },
    {
        pertanyaan: "Proses pembuatan makanan pada tumbuhan hijau dengan bantuan cahaya matahari disebut...",
        opsi: ["Respirasi", "Transpirasi", "Fotosintesis", "Adaptasi"],
        jawabanBenar: 2
    },
    {
        pertanyaan: "Ibukota negara Indonesia saat ini adalah...",
        opsi: ["Surabaya", "Bandung", "Medan", "Jakarta"],
        jawabanBenar: 3
    }
];

let soalSaatIni = 0;
let skor = 0;
let jawabanDipilih = null;
let dataSiswa = { nama: "", kelas: "" };

function mulaiUjian() {
    dataSiswa.nama = document.getElementById("input-nama").value;
    dataSiswa.kelas = document.getElementById("input-kelas").value;

    if (dataSiswa.nama === "" || dataSiswa.kelas === "") {
        alert("Mohon isi Nama dan Kelas terlebih dahulu!");
        return;
    }

    document.getElementById("halaman-login").style.display = "none";
    document.getElementById("halaman-ujian").style.display = "block";
    document.getElementById("info-siswa").innerText = dataSiswa.nama + " (" + dataSiswa.kelas + ")";
    
    tampilkanSoal();
}

function tampilkanSoal() {
    jawabanDipilih = null;
    const soal = bankSoal[soalSaatIni];
    
    document.getElementById("nomor-soal").innerText = "Soal " + (soalSaatIni + 1) + " dari " + bankSoal.length;
    document.getElementById("teks-soal").innerText = soal.pertanyaan;
    
    const wadahOpsi = document.getElementById("wadah-opsi");
    wadahOpsi.innerHTML = ""; // Bersihkan opsi sebelumnya

    soal.opsi.forEach((teksOpsi, index) => {
        const elemenOpsi = document.createElement("div");
        elemenOpsi.className = "opsi-jawaban";
        elemenOpsi.innerText = teksOpsi;
        elemenOpsi.onclick = () => pilihJawaban(elemenOpsi, index);
        wadahOpsi.appendChild(elemenOpsi);
    });

    document.getElementById("tombol-lanjut").style.display = "none";
    document.getElementById("tombol-kirim").style.display = "none";
}

function pilihJawaban(elemen, index) {
    // Hapus warna hijau dari pilihan sebelumnya
    const semuaOpsi = document.querySelectorAll(".opsi-jawaban");
    semuaOpsi.forEach(opsi => opsi.classList.remove("terpilih"));

    // Tambahkan warna hijau ke pilihan saat ini
    elemen.classList.add("terpilih");
    jawabanDipilih = index;

    // Munculkan tombol selanjutnya/kirim
    if (soalSaatIni < bankSoal.length - 1) {
        document.getElementById("tombol-lanjut").style.display = "block";
    } else {
        document.getElementById("tombol-kirim").style.display = "block";
    }
}

function soalSelanjutnya() {
    if (jawabanDipilih === bankSoal[soalSaatIni].jawabanBenar) {
        skor += (100 / bankSoal.length); // Hitung nilai proporsional
    }
    soalSaatIni++;
    tampilkanSoal();
}

function kirimNilai() {
    // Cek jawaban terakhir
    if (jawabanDipilih === bankSoal[soalSaatIni].jawabanBenar) {
        skor += (100 / bankSoal.length);
    }

    document.getElementById("halaman-ujian").style.display = "none";
    document.getElementById("halaman-selesai").style.display = "block";

    // Format data yang akan dikirim ke Google Sheets
    const dataKirim = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas,
        nilai: Math.round(skor) // Dibulatkan agar tidak ada desimal panjang
    };

    // Proses pengiriman data via API
    fetch(URL_DATABASE, {
        method: "POST",
        mode: 'no-cors', // Penting untuk menghindari error block pada Google Apps Script
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataKirim)
    })
    .then(() => {
        document.getElementById("pesan-status").innerText = "Selesai! Nilai Anda (" + Math.round(skor) + ") berhasil dikirim ke guru.";
    })
    .catch(error => {
        document.getElementById("pesan-status").innerText = "Terjadi kesalahan saat mengirim data. Silakan lapor ke guru.";
        console.error("Error:", error);
    });
}
