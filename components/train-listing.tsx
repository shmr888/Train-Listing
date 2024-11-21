"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'
import { Input } from "@/components/ui/input"
import { Train } from 'lucide-react'
import Link from 'next/link'

// Import Leaflet types only on client side
let L: any
if (typeof window !== 'undefined') {
  L = require('leaflet')
}

// Dynamically import map components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)

// Create a new file for storing route data
export interface Station {
  code: string;
  name: string;
  coordinates: [number, number];
}

export interface TrainRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  price: number;
  type: 'direct' | 'indirect';
  stops?: {
    station: string;
    arrival: string;
    departure: string;
  }[];
  alternateRoute?: {
    nearestStation: string;
    distance: number;
    trainName: string;
    departure: string;
    arrival: string;
  };
}

export const stations: { [key: string]: Station } = {
  CBE: {
    code: "CBE",
    name: "Coimbatore",
    coordinates: [11.0168, 76.9558]
  },
  MAS: {
    code: "MAS",
    name: "Chennai",
    coordinates: [13.0827, 80.2707]
  },
  MV: {
    code: "MV",
    name: "Mayiladuthurai",
    coordinates: [11.1014, 79.6583]
  },
  TPJ: {
    code: "TPJ",
    name: "Tiruchirappalli",
    coordinates: [10.7905, 78.7047]
  },
  ALU: {
    code: "ALU",
    name: "Ariyalur",
    coordinates: [11.1400, 79.0800]
  },
  // Add more stations easily here
};

export const routes: TrainRoute[] = [
  {
    id: "CBE-MV-1",
    name: "Jan Shatabdi Express",
    from: "CBE",
    to: "MV",
    departure: "07:00",
    arrival: "14:00",
    price: 270,
    type: "direct"
  },
  {
    id: "CBE-MV-2",
    name: "ERS KIK + Chozhan SF",
    from: "CBE",
    to: "MV",
    departure: "03:15",
    arrival: "11:30",
    price: 270,
    type: "indirect",
    stops: [
      {
        station: "TPJ",
        arrival: "07:55",
        departure: "09:30"
      }
    ]
  },
  {
    id: "CBE-MAS-1",
    name: "Vande Bharat Express",
    from: "CBE",
    to: "MAS",
    departure: "06:00",
    arrival: "11:50",
    price: 1200,
    type: "direct"
  },
  {
    id: "CBE-MAS-2",
    name: "West Coast Express",
    from: "CBE",
    to: "MAS",
    departure: "07:50",
    arrival: "15:25",
    price: 300,
    type: "direct"
  },
  {
    id: "CBE-ALU-1",
    name: "MAQ Chennai Express",
    from: "CBE",
    to: "ALU",
    departure: "15:35",
    arrival: "23:05",
    price: 250,
    type: "direct"
  },
  // Example of a route with an alternate suggestion
  {
    id: "CBE-ALU-2",
    name: "Chemmozhi Express",
    from: "CBE",
    to: "ALU",
    departure: "12:05",
    arrival: "17:30",
    price: 200,
    type: "direct",
    alternateRoute: {
      nearestStation: "Budhalur",
      distance: 41,
      trainName: "Chemmozhi Express",
      departure: "12:05",
      arrival: "17:30"
    }
  }
];

// Add this helper function at the top of the file, after the imports
function calculateDuration(departure: string, arrival: string): string {
  const [depHours, depMinutes] = departure.split(':').map(Number);
  const [arrHours, arrMinutes] = arrival.split(':').map(Number);
  
  let durationMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
  if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight journeys
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours}h ${minutes}m`;
}

const TrainMap = ({ train }: { train: TrainRoute }) => {
  useEffect(() => {
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    });
  }, []);

  const fromCoords = stations[train.from].coordinates;
  const toCoords = stations[train.to].coordinates;
  
  const positions = train.type === 'indirect' 
    ? [fromCoords, ...train.stops!.map(stop => 
        stations[stop.station].coordinates
      ), toCoords]
    : [fromCoords, toCoords];

  // Calculate center point between stations
  const center: LatLngExpression = [
    (fromCoords[0] + toCoords[0]) / 2,
    (fromCoords[1] + toCoords[1]) / 2
  ];

  return (
    <div className="h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-100">
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full"
        style={{ borderRadius: "0.75rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {positions.map((position, idx) => (
          <Marker key={idx} position={position}>
            <Popup>
              {idx === 0 ? stations[train.from].name : 
               idx === positions.length - 1 ? stations[train.to].name :
               stations[train.stops![idx - 1].station].name}
            </Popup>
          </Marker>
        ))}
        
        <Polyline
          positions={positions}
          pathOptions={{
            color: train.type === 'indirect' ? "red" : "blue",
            dashArray: train.type === 'indirect' ? "10, 10" : ""
          }}
        />
      </MapContainer>
    </div>
  )
}

const TrainCard = ({ route }: { route: TrainRoute }) => (
  <Card className="hover:shadow-lg transition-all duration-300 border-none bg-white rounded-xl overflow-hidden">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl font-bold text-blue-900">{route.name}</CardTitle>
          <CardDescription className="text-blue-600">
            {stations[route.from].name} → {stations[route.to].name}
          </CardDescription>
        </div>
        {route.type === 'indirect' && (
          <Badge className="bg-blue-100 text-blue-600 rounded-full px-3">Connected</Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Departure</p>
          <p className="text-2xl font-bold text-gray-900">{route.departure}</p>
        </div>
        <div className="flex-1 px-4">
          <div className="h-0.5 bg-blue-100 relative">
            <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-blue-400" />
            <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-blue-400" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Arrival</p>
          <p className="text-2xl font-bold text-gray-900">{route.arrival}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

const TrainList = ({ routes, onSelectRoute }: { routes: TrainRoute[], onSelectRoute: (route: TrainRoute) => void }) => (
  <ScrollArea className="h-[600px]">
    {routes.map((route) => (
      <TrainCard key={route.id} route={route} />
    ))}
  </ScrollArea>
)

// Update the search section with this modern design
const SearchSection = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 space-y-2">
        <Input
          type="text"
          placeholder="From..."
          className="h-12 rounded-lg border-blue-200 focus:border-blue-400"
        />
        <Input
          type="text"
          placeholder="To..."
          className="h-12 rounded-lg border-blue-200 focus:border-blue-400"
        />
      </div>
      <Button 
        className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Search Trains
      </Button>
    </div>
  </div>
)

// Replace header section with this modern design
const Header = () => (
  <header className="fixed top-0 w-full z-50 px-6 py-3 bg-white/80 backdrop-blur-md border-b">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <Link className="flex items-center space-x-2" href="/">
        <Train className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          RailJourney
        </span>
      </Link>
      <nav className="hidden md:flex space-x-8">
        <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="#">
          Routes
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="#">
          Schedules
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" href="#">
          Passes
        </Link>
      </nav>
    </div>
  </header>
)

export default function TrainListingPage() {
  const [selectedRoute, setSelectedRoute] = useState<TrainRoute | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('departure')
  const [fromStation, setFromStation] = useState<string>("")
  const [toStation, setToStation] = useState<string>("")

  // Filter and sort routes
  const filteredRoutes = routes
    .filter(route => 
      stations[route.from].name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stations[route.to].name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          const aDuration = calculateDuration(a.departure, a.arrival);
          const bDuration = calculateDuration(b.departure, b.arrival);
          return aDuration.localeCompare(bDuration);
        case 'departure':
          return a.departure.localeCompare(b.departure);
        default:
          return 0;
      }
    });

  useEffect(() => {
    // Initialize with the first route
    setSelectedRoute(routes[0])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (selectedRoute) {
      setFromStation(stations[selectedRoute.from].name)
      setToStation(stations[selectedRoute.to].name)
    }
  }, [selectedRoute])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Train Listings</h1>
        
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="From..."
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="flex-1"
              />
              <span className="flex items-center text-blue-700">→</span>
              <Input
                type="text"
                placeholder="To..."
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline"
                onClick={() => {
                  const temp = fromStation;
                  setFromStation(toStation);
                  setToStation(temp);
                }}
                className="border-blue-700 text-blue-700 hover:bg-blue-50"
              >
                Swap
              </Button>
            </div>
            <select 
              className="px-4 py-2 border rounded-md border-blue-700 text-blue-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'duration' | 'departure')}
            >
              <option value="departure">Sort by Departure</option>
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
          
          {selectedRoute && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Route: <span className="font-semibold text-blue-700">{stations[selectedRoute.from].name}</span> to <span className="font-semibold text-blue-700">{stations[selectedRoute.to].name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  setFromStation(stations[selectedRoute.from].name)
                  setToStation(stations[selectedRoute.to].name)
                }}
              >
                Edit Route
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[600px]">
            {!loading && selectedRoute && (
              <TrainMap train={selectedRoute} />
            )}
          </div>
          
          <div>
            <TrainList 
              routes={filteredRoutes} 
              onSelectRoute={(route) => setSelectedRoute(route)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}