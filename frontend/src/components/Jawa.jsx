export function Jawa() {
  return (
    <div>
      <h1>Provinsi Jawa</h1>
      <ol>
        <li>Jawa Barat</li>
        <li>Jawa Tengah</li>
        <li>Jawa Timur</li>
      </ol>
    </div>
  )
}

export function Kota() {
  return (
    <div>
      <h1>Kota Jawa</h1>
      <ol>
        <li>Bandung</li>
        <li>Yogyakarta</li>
        <li>Surabaya</li>
      </ol>
    </div>
  )
}

export function Gubernur({ nama1, nama2, nama3 }) {
  return (
    <div>
      <h1>Gubernur Provinsi Jawa</h1>
      <ol>
        <li>Jawa Barat: {nama1}</li>
        <li>Jawa Tengah: {nama2}</li>
        <li>Jawa Timur: {nama3}</li>
      </ol>
    </div>
  )
}

export function PaymentChecker({ payments }) {
  return (
    <div>
      <h1>Daftar Pembayaran</h1>
      <ul>
        {payments.map((p) => (
          <li key={p.id}>
            {p.status === "pending" ? (
              <span>💳 Payment #{p.id} masih pending, segera selesaikan pembayaran</span>
            ) : (
              <span>✅ Payment #{p.id} sukses — Quantity: {p.quantity}, Amount: {p.amount}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}