// GANTI URL DI BAWAH INI DENGAN URL WEB APP GOOGLE SCRIPT ANDA
const URL_DATABASE = "https://script.google.com/macros/s/AKfycbwzcZWkup1RTL1v-9qDJgoTI3npt-ys5w0l0c7Zfig9ZQV8UdbcE1VHzOsuiT3DJId7/exec";

const bankSoal = [
    // --- 10 SOAL PILIHAN GANDA (PjBL DETEKTIF PLASTIK) ---
    {
        tipe: "ganda",
        pertanyaan: "Sebagai agen Detektif Plastik, langkah pertama yang paling tepat saat memulai investigasi sampah di lingkungan sekolah adalah...",
        opsi: [
            "Langsung membuang semua sampah ke tempat pembuangan akhir", 
            "Mencatat jenis dan menghitung jumlah kemasan plastik yang ditemukan", 
            "Menyalahkan teman yang terlihat membuang sampah sembarangan", 
            "Membakar sampah yang terkumpul agar cepat hilang"
        ],
        jawabanBenar: 1
    },
    {
        tipe: "ganda",
        pertanyaan: "Saat menggeledah tempat sampah kantin, kalian menemukan botol air mineral bening (PET). Berdasarkan investigasimu, botol jenis ini termasuk kategori plastik yang...",
        opsi: [
            "Tidak bisa didaur ulang sama sekali menjadi barang apapun", 
            "Bisa didaur ulang dan diolah kembali menjadi produk baru", 
            "Mudah terurai menyatu dengan tanah hanya dalam satu minggu",
            "Sangat beracun dan tidak boleh disentuh tangan kosong"
        ],
        jawabanBenar: 1
    },
    {
        tipe: "ganda",
        pertanyaan: "Berdasarkan data pantauan timmu, sebagian besar sampah sekolah berasal dari bungkus plastik makanan ringan. Solusi atau rekomendasi terbaik yang bisa kalian berikan kepada pihak sekolah adalah...",
        opsi: [
            "Menutup kantin sekolah selamanya agar tidak ada sampah", 
            "Membiarkan saja karena jajan adalah hal yang biasa di sekolah", 
            "Meminta kantin mulai menggunakan kemasan alternatif seperti daun pisang atau kertas", 
            "Menyuruh seluruh siswa tidak makan saat jam istirahat"
        ],
        jawabanBenar: 2
    },
    {
        tipe: "ganda",
        pertanyaan: "Tim detektifmu diberi misi khusus untuk mengurangi jejak sedotan plastik. Aksi nyata paling efektif yang bisa dilakukan oleh seluruh siswa kelas 5 adalah...",
        opsi: [
            "Membawa botol minum sendiri dari rumah yang tidak memerlukan sedotan", 
            "Memotong sedotan plastik menjadi kecil-kecil agar tidak terlihat penuh", 
            "Membeli sedotan plastik lebih banyak untuk disimpan di kelas", 
            "Mengubur sedotan plastik di kebun sekolah"
        ],
        jawabanBenar: 0
    },
    {
        tipe: "ganda",
        pertanyaan: "Mengapa jejak kemasan plastik yang dibuang sembarangan dianggap sebagai 'musuh utama' bagi lingkungan sekitar sekolah kita?",
        opsi: [
            "Karena plastik membuat tanah di kebun sekolah menjadi lebih subur", 
            "Karena plastik dapat menjadi makanan bergizi bagi hewan di sekitarnya", 
            "Karena sampah plastik membuat udara menjadi lebih sejuk dan segar",
            "Karena plastik membutuhkan waktu puluhan hingga ratusan tahun untuk hancur"
        ],
        jawabanBenar: 3
    },
    {
        tipe: "ganda",
        pertanyaan: "Timmu menemukan banyak gelas plastik bekas minuman yang masih dalam kondisi utuh dan bersih. Proyek pemanfaatan kembali (Reuse) apa yang paling kreatif untuk dibuat di kelas?",
        opsi: [
            "Menghancurkannya dan membuangnya ke selokan depan sekolah", 
            "Melukis dan menjadikannya pot untuk menanam bibit tanaman hias kelas", 
            "Membakarnya secara sembunyi-sembunyi di area belakang sekolah", 
            "Menyimpannya di dalam laci meja masing-masing sampai menumpuk penuh"
        ],
        jawabanBenar: 1
    },
    {
        tipe: "ganda",
        pertanyaan: "Misi rahasia selanjutnya adalah menyebarkan informasi bahaya plastik kepada adik-adik kelas. Media kampanye apa yang paling efektif dan menarik untuk dibuat oleh timmu?",
        opsi: [
            "Membuat buku tebal berisi tulisan panjang tanpa gambar", 
            "Memarahi adik kelas yang ketahuan membuang sampah sembarangan", 
            "Membuat poster berwarna-warni dengan slogan menarik lalu menempelkannya di mading", 
            "Menyembunyikan semua tempat sampah agar mereka bingung"
        ],
        jawabanBenar: 2
    },
    {
        tipe: "ganda",
        pertanyaan: "Sesuai dengan prinsip 'Reduce' (Mengurangi), saat berbelanja alat tulis atau keperluan sekolah di warung, agen detektif harus menolak kantong plastik (kresek). Sebagai gantinya, agen harus...",
        opsi: [
            "Membawa tas atau kantong berbahan kain yang bisa dipakai berulang kali", 
            "Meminta kantong kertas sekali pakai dalam jumlah yang sangat banyak", 
            "Membawa kardus bekas televisi yang besar dan berat ke warung", 
            "Membawa pulang barang belanjaan dengan cara dilempar"
        ],
        jawabanBenar: 0
    },
    {
        tipe: "ganda",
        pertanyaan: "Bagaimana cara tim Detektif Plastik membuktikan secara nyata bahwa misi kampanye pengurangan sampah kalian di sekolah telah berhasil?",
        opsi: [
            "Banyak siswa kelas lain yang mulai membeli mainan berbahan plastik", 
            "Volume timbunan sampah plastik di tempat sampah utama sekolah terlihat jauh berkurang", 
            "Kantin sekolah justru menjual lebih banyak makanan dengan bungkus plastik ganda", 
            "Teman-teman kelas 5 mendapatkan nilai ulangan yang bagus semua"
        ],
        jawabanBenar: 1
    },
    {
        tipe: "ganda",
        pertanyaan: "Dalam menyelesaikan misi besar PjBL ini, mengapa kerja sama tim antarsiswa sangat penting?",
        opsi: [
            "Agar ada satu orang saja yang bekerja keras menyelesaikan semua tugas", 
            "Supaya anggota tim bisa bermain-main saat jam pelajaran berlangsung", 
            "Karena kita bisa membagi tugas investigasi, membuat poster kampanye, dan mencatat data dengan adil", 
            "Agar kita bisa menyalahkan teman lain jika misi pengurangan sampah ini gagal"
        ],
        jawabanBenar: 2
    },

    // --- 2 SOAL ESAI (REFLEKSI PjBL) ---
    {
        tipe: "esai",
        pertanyaan: "Ceritakan langkah demi langkah bagaimana kelompokmu melakukan investigasi jejak sampah plastik di area sekolah! Apa penemuan yang paling mengejutkan bagi timmu saat melakukan pengamatan di lapangan?"
    },
    {
        tipe: "esai",
        pertanyaan: "Sebagai seorang 'Detektif Plastik' yang telah berhasil menyelesaikan misi di sekolah, apa rencana aksi nyata yang akan kamu lakukan di rumah untuk mengajak anggota keluargamu ikut mengurangi penggunaan kemasan plastik sekali pakai?"
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

    if (!dataSiswa.nama || !dataSiswa.kelas || !dataSiswa.mapel) {
        alert("Mohon lengkapi Nama, Kelas, dan Mata Pelajaran!"); return;
    }

    jawabanSiswa = new Array(bankSoal.length).fill(null);
    statusRagu = new Array(bankSoal.length).fill(false);

    document.getElementById("halaman-login").style.display = "none";
    document.getElementById("halaman-ujian").style.display = "block";
    document.getElementById("info-siswa").innerText = dataSiswa.nama;
    
    sisaWaktu = WAKTU_UJIAN_MENIT * 60;
    jalankanTimer();
    renderKotakNavigasi(); // Menyiapkan kotak nomor soal
    tampilkanSoal();
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
            alert("Waktu ujian habis! Laporan dikirim otomatis.");
            kirimNilai(true);
        }
    }, 1000);
}

// FUNGSI BARU: Membuat kotak navigasi
function renderKotakNavigasi() {
    const grid = document.getElementById("grid-kotak-soal");
    grid.innerHTML = "";
    for (let i = 0; i < bankSoal.length; i++) {
        const kotak = document.createElement("div");
        kotak.className = "kotak-soal";
        kotak.innerText = i + 1;
        kotak.onclick = () => lompatKeSoal(i); // Bisa diklik untuk pindah soal
        grid.appendChild(kotak);
    }
}

// FUNGSI BARU: Pindah soal berdasarkan klik kotak
function lompatKeSoal(index) {
    soalSaatIni = index;
    tampilkanSoal();
}

// FUNGSI BARU: Memperbarui warna kotak dan bilah kemajuan
function updateStatusUI() {
    let jumlahTerjawab = 0;
    const kotakSoal = document.getElementById("grid-kotak-soal").children;

    for (let i = 0; i < bankSoal.length; i++) {
        // Hapus semua kelas tambahan dulu
        kotakSoal[i].classList.remove("aktif", "terjawab", "ragu");

        // Tandai yang sedang aktif dilihat
        if (i === soalSaatIni) kotakSoal[i].classList.add("aktif");

        // Cek apakah sudah dijawab (termasuk cek spasi kosong untuk esai)
        let sudahDijawab = false;
        if (bankSoal[i].tipe === "ganda" && jawabanSiswa[i] !== null) sudahDijawab = true;
        if (bankSoal[i].tipe === "esai" && jawabanSiswa[i] !== null && jawabanSiswa[i].trim() !== "") sudahDijawab = true;

        if (sudahDijawab) {
            jumlahTerjawab++;
            if (statusRagu[i]) {
                kotakSoal[i].classList.add("ragu"); // Warna kuning
            } else {
                kotakSoal[i].classList.add("terjawab"); // Warna hijau
            }
        }
    }

    // Update Progress Bar
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
        elemenEsai.placeholder = "Ketik laporan investigasimu di sini...";
        if (jawabanSiswa[soalSaatIni] !== null) elemenEsai.value = jawabanSiswa[soalSaatIni];

        elemenEsai.oninput = (e) => {
            jawabanSiswa[soalSaatIni] = e.target.value;
            updateStatusUI(); // Update warna kotak saat ngetik esai
            aturTombolNavigasi();
        };
        wadahOpsi.appendChild(elemenEsai);
    }

    aturTombolNavigasi();
    updateStatusUI(); // Panggil fungsi pembaruan warna setiap ganti soal
}

function pilihJawabanGanda(elemen, index) {
    const semuaOpsi = document.querySelectorAll(".opsi-jawaban");
    semuaOpsi.forEach(opsi => { opsi.classList.remove("terpilih", "ragu"); });

    elemen.classList.add("terpilih");
    jawabanSiswa[soalSaatIni] = index; 
    statusRagu[soalSaatIni] = false;   
    
    updateStatusUI(); // Langsung ubah warna kotak jadi hijau saat diklik
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
                lompatKeSoal(i); // Langsung otomatis lompat ke soal yang kosong
                alert("Misi nomor " + (i+1) + " belum diselesaikan!"); return;
            }
            if (bankSoal[i].tipe === "esai" && (jawabanSiswa[i] === null || jawabanSiswa[i].trim() === "")) {
                lompatKeSoal(i);
                alert("Laporan esai nomor " + (i+1) + " tidak boleh kosong!"); return;
            }
        }
    }

    clearInterval(intervalWaktu);

    let jumlahBenar = 0;
    let jumlahSalah = 0;
    let jumlahPG = 0;
    let daftarEsai = [];

    for (let i = 0; i < bankSoal.length; i++) {
        if (bankSoal[i].tipe === "ganda") {
            jumlahPG++;
            if (jawabanSiswa[i] === bankSoal[i].jawabanBenar) {
                jumlahBenar++;
            } else {
                jumlahSalah++; // Menghitung yang salah
            }
        } else if (bankSoal[i].tipe === "esai") {
            let teksJawaban = jawabanSiswa[i] ? jawabanSiswa[i] : "(Kosong karena waktu habis)";
            daftarEsai.push("Soal " + (i+1) + ": " + teksJawaban);
        }
    }

    let nilaiTotal = (jumlahPG > 0) ? Math.round((jumlahBenar / jumlahPG) * 100) : 0;
    let gabunganEsai = daftarEsai.join("\n\n---\n"); 

    // Tampilkan rincian nilai di antarmuka sebelum dikirim
    document.getElementById("halaman-ujian").style.display = "none";
    document.getElementById("halaman-selesai").style.display = "block";
    document.getElementById("hasil-benar").innerText = jumlahBenar;
    document.getElementById("hasil-salah").innerText = jumlahSalah;
    document.getElementById("hasil-total").innerText = nilaiTotal;

    const dataKirim = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas,
        mapel: dataSiswa.mapel, 
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
        document.getElementById("pesan-status").innerText = "Data sukses disinkronkan ke Google Sheets Guru!";
        document.getElementById("pesan-status").style.color = "#28a745";
    })
    .catch(error => {
        document.getElementById("pesan-status").innerText = "Gagal menyinkronkan data. Segera lapor ke guru pengawas.";
        document.getElementById("pesan-status").style.color = "#dc3545";
    });
}
