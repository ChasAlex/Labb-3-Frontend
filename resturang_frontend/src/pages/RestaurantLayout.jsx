import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut } from "lucide-react"

export default function RestaurantLayout({ children }) {
  const handleLogout = () => {
    // Implementera utloggningslogik här
    console.log("Loggar ut...")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Restaurang Admin</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logga ut
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ScrollArea className="h-[calc(100vh-120px)]">
          {children}
        </ScrollArea>
      </main>
    </div>
  )
}