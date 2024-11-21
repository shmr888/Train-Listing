"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPinIcon, Train, Search, UserCircle2, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Component() {
  const [passengerCount, setPassengerCount] = useState(1)
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [theme, setTheme] = useState("light")

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  const incrementPassengers = () => setPassengerCount(prev => Math.min(prev + 1, 9))
  const decrementPassengers = () => setPassengerCount(prev => Math.max(prev - 1, 1))

  // Add popular Indian stations
  const popularStations = [
    { value: "CBE", label: "Coimbatore (CBE)" },
    { value: "MAS", label: "Chennai (MAS)" },
    { value: "SBC", label: "Bengaluru (SBC)" },
    { value: "MUM", label: "Mumbai (MUM)" },
    { value: "DEL", label: "Delhi (DEL)" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Animated header */}
      <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 animate-fade-in">
        <Link className="flex items-center justify-center hover-lift" href="#">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg animate-pulse-slow">
            <Train className="h-6 w-6 text-white animate-float" />
          </div>
          <span className="ml-2 text-lg font-bold animate-gradient-text">
            RailJourney
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#">
            Routes
          </Link>
          <Link className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#">
            Schedules
          </Link>
          <Link className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#">
            Passes
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-4"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-24 md:py-32 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-900/40 dark:to-purple-900/40 animate-gradient" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-float" />
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-purple-500 rounded-full blur-xl animate-pulse-slow" />
          </div>

          {/* Hero content with animations */}
          <div className="container relative px-4 md:px-6 animate-slide-in">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter animate-gradient-text">
                  Embark on a Rail Adventure
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl animate-fade-in">
                  Discover scenic routes, comfortable journeys, and unforgettable experiences by train.
                </p>
              </div>

              {/* Animated search form */}
              <Card className="w-full max-w-md backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl hover-scale animate-float">
                <CardContent className="p-6 space-y-4">
                  {/* Your existing form content with updated styling */}
                  <form className="space-y-4">
                    <Select>
                      <SelectTrigger className="w-full bg-transparent border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Journey type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-way">One Way</SelectItem>
                        <SelectItem value="round-trip">Round Trip</SelectItem>
                        <SelectItem value="multi-city">Multi-City</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-3">
                      <Select onValueChange={setFromStation}>
                        <SelectTrigger className="bg-transparent border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularStations.map((station) => (
                            <SelectItem key={station.value} value={station.value}>
                              {station.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select onValueChange={setToStation}>
                        <SelectTrigger className="bg-transparent border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularStations.map((station) => (
                            <SelectItem key={station.value} value={station.value}>
                              {station.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        type="date" 
                        className="bg-transparent border-gray-300 dark:border-gray-600" 
                      />
                      <Input 
                        type="date" 
                        className="bg-transparent border-gray-300 dark:border-gray-600" 
                      />
                    </div>

                    {/* Passenger counter with modern styling */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={decrementPassengers}
                        disabled={passengerCount <= 1}
                        className="text-blue-600 dark:text-blue-400"
                      >
                        -
                      </Button>
                      <span className="font-medium">
                        {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={incrementPassengers}
                        disabled={passengerCount >= 9}
                        className="text-blue-600 dark:text-blue-400"
                      >
                        +
                      </Button>
                    </div>

                    <Link href="/listing" className="block">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        type="submit"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Search Trains
                      </Button>
                    </Link>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular routes with staggered animations */}
        <section className="w-full py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 animate-gradient-text">
              Popular Train Routes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 stagger-animate">
              {[
                { name: 'London to Paris', description: 'Cross the Channel on the Eurostar' },
                { name: 'Tokyo to Kyoto', description: 'Experience Japan\'s bullet trains' },
                { name: 'Venice to Rome', description: 'Traverse Italy\'s stunning landscapes' },
              ].map((route, index) => (
                <Card key={route.name} className="group hover-lift transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-border">
                  <CardContent className="p-6">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      {/* <Image
                        alt={`${route.name} train route`}
                        className="transform group-hover:scale-110 transition-transform duration-300"
                        height="200"
                        //src={`/placeholder.svg`}
                        width="300"
                        style={{ objectFit: "cover" }}
                      /> */}
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {route.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {route.description}
                    </p>
                    <Button 
                      className="mt-4 w-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300" 
                      variant="outline"
                    >
                      View Route
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features section with animations */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-6 animate-slide-in">
                <h2 className="text-4xl font-bold tracking-tighter animate-gradient-text">
                  Why Choose Train Travel?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
                  Experience the perfect blend of comfort, convenience, and sustainability.
                </p>
              </div>
              <div className="grid gap-6 stagger-animate">
                {[
                  {
                    icon: <MapPinIcon className="w-8 h-8" />,
                    title: "Scenic Routes",
                    description: "Enjoy breathtaking views along your journey"
                  },
                  {
                    icon: <CalendarIcon className="w-8 h-8" />,
                    title: "Flexible Schedules",
                    description: "Multiple departures to fit your travel plans"
                  },
                  {
                    icon: <UserCircle2 className="w-8 h-8" />,
                    title: "Comfort & Space",
                    description: "Relax in spacious seats with room to move around"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="group hover-scale transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600 dark:text-blue-400 animate-pulse-slow">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive elements */}
        <div className="fixed bottom-4 right-4 animate-bounce-slow">
          <Button 
            className="rounded-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑
          </Button>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md animate-fade-in">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 RailJourney. All rights reserved.
            </p>
            <nav className="flex gap-6">
              {["Terms", "Privacy", "Accessibility"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}