const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'app', 'old-landing.tsx');
const cssOutputPath = path.join(__dirname, 'app', 'old-landing.css');
const pageOutputPath = path.join(__dirname, 'app', 'page.tsx');

let html = fs.readFileSync(inputPath, 'utf8');

// 1. Extract CSS
let css = '';
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
while ((match = styleRegex.exec(html)) !== null) {
    css += match[1] + '\n';
}
fs.writeFileSync(cssOutputPath, css);
console.log('Saved CSS to app/old-landing.css');

// 2. Extract Body
let bodyContent = '';
const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
if (bodyMatch) {
    bodyContent = bodyMatch[1];
} else {
    // If no body tags, just take the whole thing after closing head
    const headEnd = html.indexOf('</head>');
    bodyContent = headEnd !== -1 ? html.substring(headEnd + 7) : html;
}

// 3. Strip scripts
bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// 4. Convert HTML to JSX
let jsx = bodyContent;
// class -> className
jsx = jsx.replace(/class=/g, 'className=');
// for -> htmlFor
jsx = jsx.replace(/for=/g, 'htmlFor=');
// self-closing tags
jsx = jsx.replace(/<(img|input|br|hr)([^>]*?)(?:\s*\/)?>/gi, '<$1$2 />');
// remove inline styles (naive approach to avoid syntax errors)
// Instead of converting them, we'll just remove them or try to replace them if they are simple
jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    // Convert simple style="display:none;" to style={{ display: 'none' }}
    const styles = p1.split(';').filter(s => s.trim().length > 0);
    let objStr = '{';
    styles.forEach(s => {
        const parts = s.split(':');
        if (parts.length === 2) {
            let key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            let val = parts[1].trim();
            objStr += `${key}: "${val}",`;
        }
    });
    objStr += '}';
    return `style={{${objStr}}}`;
});
// remove HTML comments (they cause issues if not enclosed in {})
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// 5. Update Register button link
jsx = jsx.replace(
    /<a href="#" onclick="openReg2Modal\(\); return false;" className="btn-register">/g,
    '<Link href="/register" className="btn-register">'
);
// replace closing </a> if needed, but the original might just be </a>. Link replaces a.
// We'll replace ALL `<a ` with `<Link ` and `</a>` with `</Link>` safely for Next.js?
// Better to just import Link and let standard <a> tags be, unless it's the register button.
jsx = jsx.replace(/<a([^>]*className="btn-register"[^>]*)>([\s\S]*?)<\/a>/gi, '<Link href="/register" $1>$2</Link>');
// Clean up onclick from the replaced link
jsx = jsx.replace(/onclick="[^"]*"/gi, '');

// Fix any raw unescaped curly braces outside of JSX logic or styles?
// Naively, we hope there aren't many.
// Replace unescaped & with &amp; if not part of an entity
// Actually, React is okay with standard HTML entities in JSX text.

const componentCode = `
'use client';
import Link from 'next/link';
import './old-landing.css';
import { useEffect } from 'react';

export default function Home() {
    return (
        <div suppressHydrationWarning>
            ${jsx}
        </div>
    );
}
`;

fs.writeFileSync(pageOutputPath, componentCode);
console.log('Saved JSX to app/page.tsx');
