// Hàm để tạo và chèn script schema vào thẻ <head>
function addSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Restaurant Les 4 Saisons",
      "image": "https://les-4saisonsgeneve.ch/images/logo-transparent.png",
      "telephone": "+41227005067",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rue Henri-Blanvalet 3",
        "addressLocality": "Genève",
        "postalCode": "1207",
        "addressCountry": "CH"
      },
      "servesCuisine": "Chinoise",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
          ],
          "opens": "11:30",
          "closes": "14:30"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
          ],
          "opens": "18:30",
          "closes": "22:30"
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Chạy hàm khi nội dung trang đã được tải xong
document.addEventListener('DOMContentLoaded', addSchema);