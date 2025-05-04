import { Head, Link } from "@inertiajs/react";

const products = [
  {
    id: 1,
    name: "MediRelief Plus",
    category: "obat ringan",
    price: 45000,
    description:
      "Tablet pereda nyeri dan demam yang efektif untuk sakit kepala, nyeri otot, dan demam ringan. Bekerja cepat dalam 15-30 menit setelah konsumsi.",
  },
  {
    id: 2,
    name: "FluStop",
    category: "obat ringan",
    price: 38500,
    description:
      "Kombinasi obat flu yang meredakan gejala flu seperti hidung tersumbat, bersin, sakit kepala, dan demam.",
  },
  {
    id: 3,
    name: "GastroEase",
    category: "obat ringan",
    price: 28000,
    description:
      "Obat antasida untuk meredakan sakit maag, kembung, dan nyeri lambung. Memberikan efek meredakan dalam 5 menit.",
  },
  {
    id: 4,
    name: "CardioPress-X",
    category: "obat keras",
    price: 175000,
    description:
      "Obat resep untuk mengatasi tekanan darah tinggi (hipertensi). Hanya tersedia dengan resep dokter.",
  },
  {
    id: 5,
    name: "NeuroPain Control",
    category: "obat keras",
    price: 220000,
    description:
      "Obat resep untuk mengatasi nyeri saraf kronis, seperti neuropati diabetik. Hanya tersedia dengan resep dokter.",
  },
  {
    id: 6,
    name: "KidsCough Sirup",
    category: "obat anak",
    price: 65000,
    description:
      "Sirup pereda batuk dan pilek untuk anak-anak dengan rasa buah yang disukai anak. Aman untuk anak usia 2 tahun ke atas.",
  },
  {
    id: 7,
    name: "FeverKids",
    category: "obat anak",
    price: 52000,
    description:
      "Obat penurun demam untuk anak dalam bentuk tablet kunyah dengan rasa stroberi. Aman untuk anak usia 4-12 tahun.",
  },
  {
    id: 8,
    name: "PreNatal Vita",
    category: "obat ibu hamil",
    price: 135000,
    description:
      "Suplemen multivitamin lengkap untuk ibu hamil dan menyusui. Mengandung asam folat, zat besi, kalsium, dan nutrisi penting.",
  },
  {
    id: 9,
    name: "MomEase",
    category: "obat ibu hamil",
    price: 92000,
    description:
      "Suplemen untuk mengatasi mual dan muntah pada trimester pertama kehamilan. Mengandung vitamin B6 dan ekstrak jahe.",
  },
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default function Welcome() {
  const categories = [
    "obat ringan",
    "obat keras",
    "obat anak",
    "obat ibu hamil",
  ];
  const featuredProducts = products.slice(0, 4);

  const categoryNames = {
    "obat ringan": "Obat Ringan",
    "obat keras": "Obat Keras",
    "obat anak": "Obat Anak",
    "obat ibu hamil": "Obat Ibu Hamil",
  };

  return (
    <>
      <Head title="Welcome to Medify" />

      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-blue-800">Medify</h1>
            <p className="text-xl text-blue-600 mt-2">
              Kesehatan Anda Prioritas Kami
            </p>
            <p className="py-6 text-gray-700">
              Selamat datang di Medify, partner kesehatan Anda yang terpercaya.
              Kami menyediakan berbagai produk farmasi berkualitas tinggi dengan
              harga terjangkau, dikirim langsung ke rumah Anda.
            </p>
            <Link
              href="/products"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white border-0 px-8 py-3"
            >
              Jelajahi Produk
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Kategori Produk
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg shadow-md overflow-hidden "
              >
                <div className="h-40 bg-blue-100 flex items-center justify-center">
                  <span className="text-5xl">
                    {category === "obat ringan"
                      ? "💊"
                      : category === "obat keras"
                      ? "🏥"
                      : category === "obat anak"
                      ? "👶"
                      : "🤰"}
                  </span>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-blue-800 text-xl">
                    {categoryNames[category]}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {category === "obat ringan" &&
                      "Obat umum untuk mengatasi keluhan ringan sehari-hari"}
                    {category === "obat keras" &&
                      "Obat yang memerlukan resep dokter untuk kondisi khusus"}
                    {category === "obat anak" &&
                      "Obat khusus untuk anak-anak dengan dosis yang sesuai"}
                    {category === "obat ibu hamil" &&
                      "Suplemen dan obat yang aman untuk ibu hamil dan menyusui"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Mengapa Memilih Medify?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-blue-600 text-4xl mb-4">⚕️</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Produk Berlisensi
              </h3>
              <p className="text-gray-700">
                Semua produk kami terjamin keasliannya dan telah mendapatkan
                izin BPOM.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-blue-600 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Pengiriman Cepat
              </h3>
              <p className="text-gray-700">
                Layanan pengiriman cepat ke seluruh Indonesia, dengan opsi
                pengiriman di hari yang sama.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-blue-600 text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Konsultasi Farmasi
              </h3>
              <p className="text-gray-700">
                Konsultasi gratis dengan apoteker profesional kami untuk
                membantu kebutuhan kesehatan Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {/* <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Produk Unggulan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-5xl">💊</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-blue-800">
                      {product.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {categoryNames[product.category]}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 h-12 overflow-hidden">
                    {product.description}
                  </p>
                  <p className="text-blue-800 font-bold mt-2">
                    {formatRupiah(product.price)}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                      Beli
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 py-2 px-3 rounded-md">
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="btn btn-outline text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </div> */}

      {/* Category Product Showcase - Just show Obat Anak as example */}
      {/* <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-800">
              Rekomendasi Obat Anak
            </h2>
            <Link
              href="/products/category/obat-anak"
              className="text-blue-600 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products
              .filter((p) => p.category === "obat anak")
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex"
                >
                  <div className="w-1/3 bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">👶</span>
                  </div>
                  <div className="w-2/3 p-4">
                    <h3 className="font-semibold text-blue-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {product.description}
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-blue-800 font-bold">
                        {formatRupiah(product.price)}
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm">
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div> */}

      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            Apa Kata Pelanggan Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
              <p className="italic text-gray-700">
                "Saya sangat puas dengan layanan Medify. Obat yang saya pesan
                tiba tepat waktu dan dalam kondisi baik."
              </p>
              <p className="mt-4 font-semibold text-blue-800">Budi Santoso</p>
              <p className="text-sm text-gray-600">Jakarta</p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
              <p className="italic text-gray-700">
                "Konsultasi dengan apoteker Medify sangat membantu. Mereka
                memberikan informasi yang jelas tentang obat yang saya
                butuhkan."
              </p>
              <p className="mt-4 font-semibold text-blue-800">Siti Rahayu</p>
              <p className="text-sm text-gray-600">Surabaya</p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
              <p className="italic text-gray-700">
                "Medify selalu menjadi pilihan pertama saya untuk membeli obat
                online. Harganya terjangkau dan selalu ada promo menarik."
              </p>
              <p className="mt-4 font-semibold text-blue-800">Ahmad Hidayat</p>
              <p className="text-sm text-gray-600">Bandung</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Unduh Aplikasi Medify</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Dapatkan kemudahan berbelanja obat dan produk kesehatan lainnya
            melalui aplikasi Medify. Nikmati eksklusif promo dan diskon khusus
            untuk pengguna aplikasi.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="btn bg-white text-blue-700 hover:bg-gray-100 border-0">
              Google Play
            </button>
            <button className="btn bg-white text-blue-700 hover:bg-gray-100 border-0">
              App Store
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Medify</h3>
              <p className="text-gray-400">
                Partner kesehatan terpercaya untuk keluarga Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kategori</h4>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      href={`/products/category/${category}`}
                      className="text-gray-400 hover:text-white"
                    >
                      {categoryNames[category]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/service/konsultasi"
                    className="text-gray-400 hover:text-white"
                  >
                    Konsultasi Apoteker
                  </Link>
                </li>
                <li>
                  <Link
                    href="/service/delivery"
                    className="text-gray-400 hover:text-white"
                  >
                    Pengiriman
                  </Link>
                </li>
                <li>
                  <Link
                    href="/service/resep"
                    className="text-gray-400 hover:text-white"
                  >
                    Upload Resep
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: info@medify.id</li>
                <li className="text-gray-400">Telepon: (021) 1234-5678</li>
                <li className="text-gray-400">WhatsApp: 0812-3456-7890</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Medify. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
