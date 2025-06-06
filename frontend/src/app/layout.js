import './globals.css'; 

export const metadata = {
title: 'NoteVault',
description: 'Secure notes with encryption',
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}