export default function formatMessage(obj) {
  return `Data Customer
    Nama: ${obj.name}
    Alamat: ${obj.address}
    No. HP: ${obj.phone}
    Data pesanan:
    ${obj.order.map((item) => {
      return `
        Nama Produk: ${item.product.name}
        Jumlah: ${item.quantity}
        Total: ${item.total_price}`;
    })}
    Total Pembayaran: ${obj.total_price}
    Metode Pembayaran: ${obj.payment_method}
    Status: ${obj.status}
    `;
}
