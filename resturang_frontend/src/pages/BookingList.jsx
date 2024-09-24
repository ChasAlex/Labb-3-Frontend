"use client"
import { useState, useEffect } from "react"
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function BookingList() {
  const [bookings, setBooking] = useState([]);
  const [newBooking, setNewBooking] = useState({
    antal: 0,
    namn: "",
    datum: "",
    bordnummer: 0,
    email: "",
  })

  const [editingBooking, setEditingBooking] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)

  // Function to fetch booking list from the API
  async function getBookingList() {
    try {
      // Axios performs the request and converts the result to a JSON object
      const response = await axios.get('https://localhost:7256/getAll');
      setBooking(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('Error fetching booking: ', error);
    }
  }
  useEffect(() => {
    getBookingList();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedBooking = editingBooking ? { ...editingBooking } : { ...newBooking };
    
    // Hantera tomma fält och konvertera till nummer om nödvändigt
    if (name === "antal" || name === "bordnummer") {
      updatedBooking[name] = value === "" ? "" : parseInt(value, 10);
    } else {
      updatedBooking[name] = value;
    }
    
    editingBooking ? setEditingBooking(updatedBooking) : setNewBooking(updatedBooking);
  };

  const handleAddBooking = async () => {
    try {
      console.log('Adding booking:', newBooking);
      const response = await axios.post('https://localhost:7256/add', newBooking);
      
      setBooking((prev) => [...prev, response.data]);
      setNewBooking({ antal: 0, namn: "", datum: "", bordnummer: 0 , email: ""});
    } catch (error) {
      console.error('Error adding booking: ', error);
    }
  }

  
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsEditDialogOpen(true);
  }

  const handleUpdateBooking = async () => {
    const updatedBooking = {
      bokningId: editingBooking.bokningId,
      antal: editingBooking.antal,
      bordnummer: editingBooking.bordnummer,
      namn: editingBooking.namn,
      datum: editingBooking.datum,
    };

    console.log('Updating booking:', updatedBooking);

    try {
      const response = await axios.put(`https://localhost:7256/update`, updatedBooking);
      setBooking((prev) => prev.map((booking) => 
        booking.bokningId === editingBooking.bokningId ? response.data : booking
      ));
      
      setIsEditDialogOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error('Error updating booking: ', error);
    }
  }

  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteBooking = async () => {
    
    console.log('Deleting booking:', bookingToDelete);
    try {
      await axios.delete(`https://localhost:7256/delte/${bookingToDelete.bokningId}`);
      setBooking((prev) => prev.filter((booking) => booking.bokningId !== bookingToDelete.bokningId));
    } catch (error) {
      console.error('Error deleting booking: ', error);
    }
    
    setIsDeleteDialogOpen(false)
    setBookingToDelete(null)
  }

  return (
    <div className="p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lägg till ny bokning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="antal">Antal</Label>
              <Input
                id="antal"
                name="antal"
                type="number"
                value={newBooking.antal}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="namn">Namn</Label>
              <Input
                id="namn"
                name="namn"
                value={newBooking.namn}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="namn">Email</Label>
              <Input
                id="email"
                name="email"
                value={newBooking.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="datum">Datum</Label>
              <Input
                id="datum"
                name="datum"
                type="date"
                value={newBooking.datum}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="bordnummer">Bordsnummer</Label>
              <Input
                id="bordnummer"
                name="bordnummer"
                type="number"
                value={newBooking.bordnummer}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddBooking}>Lägg till bokning</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bokningar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Antal</TableHead>
                <TableHead>Namn</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Bordsnummer</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.antal}</TableCell>
                  <TableCell>{booking.namn}</TableCell>
                  <TableCell>{booking.datum}</TableCell>
                  <TableCell>{booking.bordNummer}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditBooking(booking)}>
                      Redigera
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteBooking(booking)}>
                      Ta bort
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redigera bokning</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <Input
              id="edit-id"
              name="id"
              type="hidden"
              value={editingBooking?.bokningId || ""}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-antal" className="text-right">
                Antal
              </Label>
              <Input
                id="edit-antal"
                name="antal"
                type="number"
                value={editingBooking?.antal || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-namn" className="text-right">
                Namn
              </Label>
              <Input
                id="edit-namn"
                name="namn"
                value={editingBooking?.namn || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-datum" className="text-right">
                Datum
              </Label>
              <Input
                id="edit-datum"
                name="datum"
                type="date"
                value={editingBooking?.datum || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-bordnummer" className="text-right">
                Bordsnummer
              </Label>
              <Input
                id="edit-bordnummer"
                name="bordnummer"
                type="number"
                value={editingBooking?.bordnummer || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
              
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateBooking}>Spara ändringar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker på att du vill ta bort denna bokning?</AlertDialogTitle>
            <AlertDialogDescription>
              Denna åtgärd kan inte ångras. Detta kommer permanent ta bort bokningen för {bookingToDelete?.namn}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBooking}>Ta bort</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )



}


