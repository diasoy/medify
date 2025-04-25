export default function formatRupiah(number) {
    // Convert the number to a string and remove any non-digit characters
    const cleanedNumber = number.toString().replace(/\D/g, "");

    // Format the number as a currency string
    const formattedNumber = cleanedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `Rp ${formattedNumber}`;
}
