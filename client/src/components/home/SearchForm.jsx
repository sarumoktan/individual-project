import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchForm() {
  const [pickupPoint, setPickupPoint] = useState('')
  const [droppingPoint, setDroppingPoint] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/bus-booking/search-buses', { 
      state: { pickupPoint, droppingPoint, departureDate }
    })
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Choose Your Ticket</h3>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <select 
            value={pickupPoint}
            onChange={(e) => setPickupPoint(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="">Pickup Point</option>
            <option value="city1">City 1</option>
            <option value="city2">City 2</option>
          </select>
        </div>

        <div>
          <select 
            value={droppingPoint}
            onChange={(e) => setDroppingPoint(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="">Dropping Point</option>
            <option value="city1">City 1</option>
            <option value="city2">City 2</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary/90 transition"
        >
          Find Tickets
        </button>
      </form>
    </div>
  )
}