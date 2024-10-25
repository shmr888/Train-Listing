"use client"

import { useState, useEffect } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock API for train data
const fetchTrains = async () => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 1, name: "Express 101", from: "Coimbatore (CBE)", to: "Chennai (MAS)", departure: "08:00", arrival: "12:30", status: "On Time" },
    { id: 3, name: "Local 303", from: "Coimbatore (CBE)", to: "Chennai (MAS)", departure: "10:30", arrival: "12:00", status: "On Time" },
    { id: 4, name: "Express 404", from: "Coimbatore (CBE)", to: "Chennai (MAS)", departure: "11:45", arrival: "19:30", status: "On Time" }
  ]
}

const TrainMap = ({ center, zoom, title }:any) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
     
    </CardContent>
  </Card>
)

const TrainList = ({ trains }:any) => (
  <ScrollArea className="h-[400px]">
    {/* @ts-ignore */}
    {trains.map((train) => (
      <Card key={train.id} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center">
            {train.name}
            <Badge variant={train.status === "On Time" ? "default" : train.status === "Delayed" ? "destructive" : "secondary"}>
              {train.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">From: {train.from} - To: {train.to}</p>
          <p className="text-sm text-gray-500">Departure: {train.departure} - Arrival: {train.arrival}</p>
        </CardContent>
      </Card>
    ))}
  </ScrollArea>
)

export default function TrainListingPage() {
  const [trains, setTrains] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrains().then(data => {
        {/* @ts-ignore */}
      setTrains(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Train Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <TrainMap center={[-74.006, 40.7128]} zoom={9} title="New York Area" />
        <TrainMap center={[-71.0589, 42.3601]} zoom={9} title="Boston Area" />
        <TrainMap center={[-77.0369, 38.9072]} zoom={9} title="Washington D.C. Area" />
      </div>
      {loading ? (
        <p>Loading train data...</p>
      ) : (
        <TrainList trains={trains} />
      )}
    </div>
  )
}