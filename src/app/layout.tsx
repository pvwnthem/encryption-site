import './globals.css'


export const metadata = {
  title: 'Encrypt',
  description: 'By 2x1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
