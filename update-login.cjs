const fs = require('fs');

let content = fs.readFileSync('src/components/LoginPage.tsx', 'utf8');

// Global string replacements
content = content.replace(/cinematic-header-bg/g, 'absolute inset-0 z-0 bg-blue-50/50');
content = content.replace(/glass-panel/g, 'bg-white border border-gray-200 shadow-sm');
content = content.replace(/text-white/g, 'text-gray-900');
content = content.replace(/text-neutral-300/g, 'text-gray-700');
content = content.replace(/text-neutral-400/g, 'text-gray-600');
content = content.replace(/text-neutral-500/g, 'text-gray-500');
content = content.replace(/text-neutral-600/g, 'text-gray-400');
content = content.replace(/bg-black\/60 border border-white\/15/g, 'bg-white border border-gray-300');
content = content.replace(/border-white\/15/g, 'border-gray-300');
content = content.replace(/border-white\/10/g, 'border-gray-200');
content = content.replace(/border-white\/20/g, 'border-gray-300');
content = content.replace(/focus:border-white focus:ring-1 focus:ring-white/g, 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500');

// Fix button text colors that were changed to text-gray-900 but should be text-white
content = content.replace(/bg-white text-black/g, 'bg-[#005E93] text-white hover:bg-[#004A75]');
// We replaced text-white with text-gray-900. Our blue button now says bg-[#005E93] text-gray-900, let's fix it:
content = content.replace(/bg-\[#005E93\] text-gray-900/g, 'bg-[#005E93] text-white');

// Role selectors
content = content.replace(/bg-sky-500\/10 border-sky-400\/40 text-gray-900 ring-1 ring-sky-400\/30 shadow-lg shadow-sky-500\/10/g, 'bg-blue-50 border-blue-200 text-blue-900 ring-1 ring-blue-300 shadow-sm');
content = content.replace(/bg-purple-500\/10 border-purple-400\/40 text-gray-900 ring-1 ring-purple-400\/30 shadow-lg shadow-purple-500\/10/g, 'bg-green-50 border-green-200 text-green-900 ring-1 ring-green-300 shadow-sm');
content = content.replace(/bg-amber-500\/10 border-amber-400\/40 text-gray-900 ring-1 ring-amber-400\/30 shadow-lg shadow-amber-500\/10/g, 'bg-orange-50 border-orange-200 text-orange-900 ring-1 ring-orange-300 shadow-sm');

// Inactive role selectors
content = content.replace(/bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-white\/5 border-gray-200/g, 'bg-white border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50');

// Icons
content = content.replace(/text-emerald-400/g, 'text-green-600');
content = content.replace(/bg-emerald-500\/10/g, 'bg-green-100');
content = content.replace(/border-emerald-500\/20/g, 'border-green-300');
content = content.replace(/text-emerald-300/g, 'text-green-800');
content = content.replace(/bg-emerald-500\/15/g, 'bg-green-50');
content = content.replace(/border-emerald-500\/30/g, 'border-green-200');
content = content.replace(/text-emerald-200/g, 'text-green-800');
content = content.replace(/text-emerald-500/g, 'text-green-600');

// Red alerts
content = content.replace(/bg-red-500\/20/g, 'bg-red-50');
content = content.replace(/border-red-500\/40/g, 'border-red-200');
content = content.replace(/text-red-200/g, 'text-red-800');
content = content.replace(/bg-red-500\/15/g, 'bg-red-50');
content = content.replace(/border-red-500\/30/g, 'border-red-200');

// Amber alerts
content = content.replace(/bg-amber-500\/15/g, 'bg-orange-50');
content = content.replace(/border-amber-500\/30/g, 'border-orange-200');
content = content.replace(/text-amber-200/g, 'text-orange-800');

// specific to OTP inputs: bg-black/60 -> bg-white
content = content.replace(/bg-black\/60/g, 'bg-white');

fs.writeFileSync('src/components/LoginPage.tsx', content, 'utf8');
console.log('LoginPage.tsx updated');
