"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPinIcon, Train, Search, UserCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Component() {
  const [passengerCount, setPassengerCount] = useState(1)

  const incrementPassengers = () => setPassengerCount(prev => Math.min(prev + 1, 9))
  const decrementPassengers = () => setPassengerCount(prev => Math.max(prev - 1, 1))

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-blue-700">
        <Link className="flex items-center justify-center" href="#">
          <Train className="h-6 w-6 bg-white" />
          <span className="ml-2 text-lg font-semibold text-white ">RailJourney</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 text-white">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Routes
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Schedules
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Passes
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Deals
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48  bg-cover bg-center bg-[url('/image.jpg')]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-blue-800">
                  Embark on a Rail Adventure
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Discover scenic routes, comfortable journeys, and unforgettable experiences by train.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="flex-1 space-y-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Journey type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-way">One Way</SelectItem>
                        <SelectItem value="round-trip">Round Trip</SelectItem>
                        <SelectItem value="multi-city">Multi-City</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Input className="flex-1" placeholder="From" />
                      <Input className="flex-1" placeholder="To" />
                    </div>
                    <div className="flex space-x-2">
                      <Input className="flex-1" type="date" placeholder="Departure" />
                      <Input className="flex-1" type="date" placeholder="Return (optional)" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={decrementPassengers}
                        disabled={passengerCount <= 1}
                        aria-label="Decrease passenger count"
                      >
                        <span className="text-lg font-bold">-</span>
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="text-lg font-semibold text-white">{passengerCount}</span>
                        <span className="ml-2 text-sm text-white">
                          {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={incrementPassengers}
                        disabled={passengerCount >= 9}
                        aria-label="Increase passenger count"
                      >
                        <span className="text-lg font-bold">+</span>
                      </Button>
                    </div>
                    <Link href={"/listing"}>
                  <Button className="bg-blue-700 w-full text-white hover:bg-white hover:text-blue-700 " type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Search Trains ({passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'})
                  </Button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Popular Train Routes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: 'London to Paris', description: 'Cross the Channel on the Eurostar' },
                { name: 'Tokyo to Kyoto', description: 'Experience Japan\'s bullet trains' },
                { name: 'Venice to Rome', description: 'Traverse Italy\'s stunning landscapes' },
              ].map((route) => (
                <Card key={route.name}>
                  <CardContent className="p-4">
                    <Image
                      alt={`${route.name} train route`}
                      className="rounded-lg object-cover w-full h-48"
                      height="200"
                      src={`/placeholder.svg?height=200&width=300`}
                      style={{
                        aspectRatio: "300/200",
                        objectFit: "cover",
                      }}
                      width="300"
                    />
                    <h3 className="text-2xl font-semibold mt-4">{route.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">{route.description}</p>
                    <Button className="mt-4 w-full" variant="outline">
                      View Route
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Train Travel?</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover the benefits of traveling by train. From scenic routes to eco-friendly journeys, train travel
                  offers a unique and comfortable way to explore the world.
                </p>
              </div>
              <ul className="grid gap-4 md:gap-8">
                <li className="flex items-center gap-4">
                  <MapPinIcon className="w-8 h-8" />
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Scenic Routes</h3>
                    <p className="text-gray-500 dark:text-gray-400">Enjoy breathtaking views along your journey</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <CalendarIcon className="w-8 h-8" />
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Flexible Schedules</h3>
                    <p className="text-gray-500 dark:text-gray-400">Multiple departures to fit your travel plans</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <UserCircle2 className="w-8 h-8" />
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Comfort & Space</h3>
                    <p className="text-gray-500 dark:text-gray-400">Relax in spacious seats with room to move around</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 RailJourney. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Accessibility
          </Link>
        </nav>
      </footer>
    </div>
  )
}