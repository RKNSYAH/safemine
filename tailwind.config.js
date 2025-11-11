/** @type {import('tailwindcss').Config} */
module.exports = {
    // The 'content' section tells TailwindCSS which files to scan for class names.
    // This setup ensures it finds classes used in all your React component files.
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      // This 'extend' section is where you would add custom colors, fonts, etc.
      // We are leaving it empty for now, as your code uses Tailwind's defaults.
      extend: {
        colors: {
            primary: '#F3F4F6',
            secondary: '#2563EB',
            tone: '#1F2937'
          },
      },
    },
    plugins: [],
  }