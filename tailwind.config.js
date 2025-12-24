/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'runify-blue': '#025196',
                'runify-yellow': '#FDB338',
            }
        },
    },
    plugins: [],
}
