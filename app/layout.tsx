import { ConvexProvider } from "convex/react"
import { convex } from "../lib/convex"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ConvexProvider client={convex}>
        <body>{children}</body>
      </ConvexProvider>
    </html>
  )
}



import './globals.css'