const args = process.argv.slice(2);
if (!args[0]) {
    console.log("Please provide a string to obfuscate.");
    process.exit(1);
}
const input = args[0];
let hex = '';
for (let i = 0; i < input.length; i++) {
    hex += input.charCodeAt(i).toString(16).padStart(2, '0');
}
console.log(`Original: ${input}`);
console.log(`Obfuscated (Hex): ${hex}`);
