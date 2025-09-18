import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Clock, Activity, Timer, Calendar, RefreshCw, Wifi, WifiOff, Calculator, ArrowRight, Server } from 'lucide-react'
import './App.css'

function App() {
  const [eraData, setEraData] = useState(null)
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [backendStatus, setBackendStatus] = useState('unknown')
  
  // Era Calculator state
  const [calculatorMode, setCalculatorMode] = useState('era') // 'era' or 'datetime'
  const [targetEra, setTargetEra] = useState('')
  const [targetDateTime, setTargetDateTime] = useState('')
  const [calculatedTime, setCalculatedTime] = useState(null)
  const [calculatorError, setCalculatorError] = useState('')

  // Backend API base URL - adjust for production
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // In production, backend serves from same domain
    : 'http://localhost:5000/api'  // In development, backend runs on port 5000

  // Fetch era data from our backend API
  const fetchEraData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/era-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      const lastEraEnd = new Date(data.last_switch_block.timestamp)
      const nextEraStart = new Date(data.next_switch_block.timestamp)
      
      setEraData({
        currentEra: data.current_era,
        lastSwitchBlock: lastEraEnd,
        nextSwitchBlock: nextEraStart,
        blockHash: data.last_switch_block.block_hash,
        blockHeight: data.current_block_height, // Current network block height
        lastSwitchBlockHeight: data.last_switch_block.block_height, // Last switch block height
        nextBlockHeight: data.last_switch_block.block_height + 450, // Each era has ~450 blocks
        cached: data.cached,
        cacheAge: data.cache_age
      })
      
      setIsOnline(true)
      setBackendStatus('connected')
      setError(null)
    } catch (err) {
      console.error('Backend API failed:', err.message)
      setIsOnline(false)
      setBackendStatus('error')
      setError(`Backend connection failed: ${err.message}`)
      
      // Fallback to mock data for demo
      setEraData(getMockEraData())
    }
    
    setLastUpdate(new Date())
    setLoading(false)
  }

  // Mock data fallback
  const getMockEraData = () => {
    const now = new Date()
    const lastSwitchTime = new Date(now.getTime() - (Math.random() * 60 * 60 * 1000))
    const nextSwitchTime = new Date(lastSwitchTime.getTime() + 2 * 60 * 60 * 1000)
    
    return {
      currentEra: 19498, // Current active era
      lastSwitchBlock: lastSwitchTime,
      nextSwitchBlock: nextSwitchTime,
      blockHash: "6f511aaa2dde00f6513f4d4c216011a273fb002dc21b808e7e703319226d9029",
      blockHeight: 5501000, // Current network block height
      lastSwitchBlockHeight: 5499162, // Last switch block height
      nextBlockHeight: 5499162 + 450, // Each era has ~450 blocks
      cached: false,
      cacheAge: 0
    }
  }

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (response.ok) {
        setBackendStatus('connected')
        return true
      }
    } catch (err) {
      setBackendStatus('error')
    }
    return false
  }

  // Calculate time left until next era
  const calculateTimeLeft = () => {
    if (!eraData) return
    
    const now = new Date()
    const timeDiff = eraData.nextSwitchBlock.getTime() - now.getTime()
    
    if (timeDiff > 0) {
      const totalMinutes = Math.floor(timeDiff / (1000 * 60))
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
      
      setTimeLeft({ hours, minutes, seconds })
    } else {
      // Era has ended, refresh data
      if (!loading) {
        fetchEraData()
      }
    }
  }

  // Calculate future era time or find era for target datetime
  const calculateFutureEra = () => {
    if (!eraData) return
    
    setCalculatorError('')
    
    if (calculatorMode === 'era') {
      // Era number mode
      if (!targetEra) return
      
      const target = parseInt(targetEra)
      
      if (isNaN(target)) {
        setCalculatorError('Please enter a valid era number')
        return
      }
      
      if (target <= eraData.currentEra) {
        setCalculatorError('Please enter a future era number (greater than current era)')
        return
      }
      
      // Calculate how many eras in the future
      const erasInFuture = target - eraData.currentEra
      
      // Each era is approximately 2 hours (7200 seconds) and ~450 blocks
      const millisecondsPerEra = 2 * 60 * 60 * 1000
      const blocksPerEra = 450
      
      // Calculate the expected time
      const expectedTime = new Date(eraData.nextSwitchBlock.getTime() + (erasInFuture - 1) * millisecondsPerEra)
      
      // Calculate expected block height
      const expectedBlockHeight = eraData.nextBlockHeight + (erasInFuture - 1) * blocksPerEra
      
      // Calculate time from now
      const now = new Date()
      const timeDiff = expectedTime.getTime() - now.getTime()
      const daysFromNow = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hoursFromNow = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutesFromNow = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      
      setCalculatedTime({
        mode: 'era',
        era: target,
        expectedTime,
        expectedBlockHeight,
        daysFromNow,
        hoursFromNow,
        minutesFromNow,
        totalHours: Math.floor(timeDiff / (1000 * 60 * 60))
      })
    } else {
      // DateTime mode
      if (!targetDateTime) return
      
      const targetDate = new Date(targetDateTime)
      const now = new Date()
      
      if (targetDate <= now) {
        setCalculatorError('Please select a future date and time')
        return
      }
      
      // Calculate time difference from next era start to target date
      const timeDiffFromNextEra = targetDate.getTime() - eraData.nextSwitchBlock.getTime()
      
      if (timeDiffFromNextEra < 0) {
        // Target is before next era, so it's in current era
        const nearestEra = eraData.currentEra
        const eraStartTime = eraData.lastSwitchBlock
        const eraEndTime = eraData.nextSwitchBlock
        
        // Calculate block height within current era
        const eraProgress = (targetDate.getTime() - eraStartTime.getTime()) / (eraEndTime.getTime() - eraStartTime.getTime())
        const blocksIntoEra = Math.floor(eraProgress * 450)
        const expectedBlockHeight = eraData.lastSwitchBlockHeight + blocksIntoEra
        
        setCalculatedTime({
          mode: 'datetime',
          era: nearestEra,
          selectedDateTime: targetDate,
          expectedBlockHeight,
          eraStartTime,
          eraEndTime,
          isCurrentEra: true,
          daysFromNow: Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          hoursFromNow: Math.floor(((targetDate.getTime() - now.getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutesFromNow: Math.floor(((targetDate.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60))
        })
      } else {
        // Target is after next era start
        const millisecondsPerEra = 2 * 60 * 60 * 1000
        const blocksPerEra = 450
        
        // Calculate how many complete eras after the next era
        const erasAfterNext = Math.floor(timeDiffFromNextEra / millisecondsPerEra)
        const nearestEra = eraData.currentEra + 1 + erasAfterNext
        
        // Calculate era start and end times
        const eraStartTime = new Date(eraData.nextSwitchBlock.getTime() + erasAfterNext * millisecondsPerEra)
        const eraEndTime = new Date(eraStartTime.getTime() + millisecondsPerEra)
        
        // Calculate block height within the era
        const eraProgress = (targetDate.getTime() - eraStartTime.getTime()) / millisecondsPerEra
        const blocksIntoEra = Math.floor(eraProgress * blocksPerEra)
        const expectedBlockHeight = eraData.nextBlockHeight + erasAfterNext * blocksPerEra + blocksIntoEra
        
        setCalculatedTime({
          mode: 'datetime',
          era: nearestEra,
          selectedDateTime: targetDate,
          expectedBlockHeight,
          eraStartTime,
          eraEndTime,
          isCurrentEra: false,
          daysFromNow: Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          hoursFromNow: Math.floor(((targetDate.getTime() - now.getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutesFromNow: Math.floor(((targetDate.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60))
        })
      }
    }
  }

  // Handle Enter key in calculator input
  const handleCalculatorKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateFutureEra()
    }
  }

  // Initial data fetch and backend health check
  useEffect(() => {
    checkBackendHealth().then(isHealthy => {
      if (isHealthy) {
        fetchEraData()
      } else {
        // If backend is not available, use mock data
        setEraData(getMockEraData())
        setLoading(false)
        setLastUpdate(new Date())
      }
    })
  }, [])

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [eraData, loading])

  // Auto-refresh data every 5 minutes (only if backend is available)
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      if (!loading && backendStatus === 'connected') {
        fetchEraData()
      }
    }, 5 * 60 * 1000)
    return () => clearInterval(refreshTimer)
  }, [loading, backendStatus])

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  const formatTimeLeft = () => {
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${String(timeLeft.minutes).padStart(2, '0')}m ${String(timeLeft.seconds).padStart(2, '0')}s`
    }
    return `${String(timeLeft.minutes).padStart(2, '0')}m ${String(timeLeft.seconds).padStart(2, '0')}s`
  }

  const formatTimeFromNow = (calculated) => {
    if (calculated.daysFromNow > 0) {
      return `${calculated.daysFromNow}d ${calculated.hoursFromNow}h ${calculated.minutesFromNow}m`
    } else if (calculated.totalHours > 0) {
      return `${calculated.totalHours}h ${calculated.minutesFromNow}m`
    } else {
      return `${calculated.minutesFromNow}m`
    }
  }

  const getStatusBadge = () => {
    if (backendStatus === 'connected') {
      return { text: 'Live Data', color: 'bg-green-600', icon: <Server className="h-3 w-3" /> }
    } else if (backendStatus === 'error') {
      return { text: 'Demo Mode', color: 'bg-orange-600', icon: <WifiOff className="h-3 w-3" /> }
    } else {
      return { text: 'Connecting...', color: 'bg-gray-600', icon: <RefreshCw className="h-3 w-3 animate-spin" /> }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading Casper network data...</p>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Casper Era Tracker
            </h1>
            {isOnline ? (
              <Wifi className="h-8 w-8 text-green-400" />
            ) : (
              <WifiOff className="h-8 w-8 text-orange-400" />
            )}
          </div>
          <p className="text-purple-200 text-lg mb-4">
            Live network status and era information
          </p>
          
          {/* Status Banner */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge 
              variant="default"
              className={`${statusBadge.color} text-white flex items-center gap-1`}
            >
              {statusBadge.icon}
              {statusBadge.text}
            </Badge>
            <Button 
              onClick={fetchEraData} 
              disabled={loading}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-3 mb-4 max-w-md mx-auto">
              <p className="text-orange-200 text-sm">{error}</p>
            </div>
          )}

          {/* Cache Status */}
          {eraData?.cached && (
            <div className="text-xs text-purple-400 mb-2">
              Cached data (age: {Math.round(eraData.cacheAge)}s)
            </div>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Era */}
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Current Era</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{eraData?.currentEra}</div>
              <Badge variant="secondary" className="mt-2 bg-purple-600/20 text-purple-200">
                Active
              </Badge>
            </CardContent>
          </Card>

          {/* Time Left Countdown - Featured */}
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-orange-500/50 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 hover:scale-105 ring-2 ring-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-200">Time Left</CardTitle>
              <Timer className="h-4 w-4 text-orange-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight">
                {formatTimeLeft()}
              </div>
              <Badge variant="secondary" className="mt-2 bg-orange-600/30 text-orange-200 animate-pulse">
                Live Countdown
              </Badge>
            </CardContent>
          </Card>

          {/* Block Height */}
          <Card className="bg-white/10 backdrop-blur-sm border-blue-500/30 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Block Height</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{eraData?.blockHeight?.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-2 bg-blue-600/20 text-blue-200">
                Latest
              </Badge>
            </CardContent>
          </Card>

          {/* Next Era */}
          <Card className="bg-white/10 backdrop-blur-sm border-green-500/30 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Next Era</CardTitle>
              <Clock className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{eraData?.currentEra + 1}</div>
              <Badge variant="secondary" className="mt-2 bg-green-600/20 text-green-200">
                Upcoming
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Era Time Calculator */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-200 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Era Time Calculator
              </CardTitle>
              <p className="text-cyan-300 text-sm">
                Calculate era information by entering an era number or selecting a date & time
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode Selector */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={calculatorMode === 'era' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCalculatorMode('era')
                    setCalculatedTime(null)
                    setCalculatorError('')
                  }}
                  className={calculatorMode === 'era' 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                    : 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
                  }
                >
                  Era Number
                </Button>
                <Button
                  variant={calculatorMode === 'datetime' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCalculatorMode('datetime')
                    setCalculatedTime(null)
                    setCalculatorError('')
                  }}
                  className={calculatorMode === 'datetime' 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                    : 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
                  }
                >
                  Date & Time
                </Button>
              </div>

              {/* Input Section */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  {calculatorMode === 'era' ? (
                    <>
                      <label className="text-sm text-cyan-300 mb-2 block">Target Era</label>
                      <Input
                        type="number"
                        placeholder={`Enter era > ${eraData?.currentEra || 0}`}
                        value={targetEra}
                        onChange={(e) => setTargetEra(e.target.value)}
                        onKeyPress={handleCalculatorKeyPress}
                        className="bg-white/10 border-cyan-500/30 text-white placeholder:text-gray-400"
                        min={eraData?.currentEra + 1}
                      />
                    </>
                  ) : (
                    <>
                      <label className="text-sm text-cyan-300 mb-2 block">Target Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={targetDateTime}
                        onChange={(e) => setTargetDateTime(e.target.value)}
                        className="bg-white/10 border-cyan-500/30 text-white"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </>
                  )}
                </div>
                <Button 
                  onClick={calculateFutureEra}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={(!targetEra && calculatorMode === 'era') || (!targetDateTime && calculatorMode === 'datetime') || !eraData}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>

              {calculatorError && (
                <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{calculatorError}</p>
                </div>
              )}

              {calculatedTime && (
                <div className="bg-white/5 rounded-lg p-4 border border-cyan-500/20">
                  {calculatedTime.mode === 'era' ? (
                    // Era mode results
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-cyan-300 mb-1">Era {calculatedTime.era} Expected Time</p>
                          <p className="text-white font-mono text-sm">
                            {formatDateTime(calculatedTime.expectedTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-cyan-300 mb-1">Expected Block Height</p>
                          <p className="text-white font-semibold">
                            {calculatedTime.expectedBlockHeight?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-cyan-300 mb-1">Time from Now</p>
                          <p className="text-white font-semibold">
                            {formatTimeFromNow(calculatedTime)}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    // DateTime mode results
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-cyan-300 mb-1">Selected Date & Time</p>
                          <p className="text-white font-mono text-sm">
                            {formatDateTime(calculatedTime.selectedDateTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-cyan-300 mb-1">Era at That Time</p>
                          <p className="text-white font-semibold text-lg">
                            {calculatedTime.era}
                            {calculatedTime.isCurrentEra && (
                              <Badge variant="secondary" className="ml-2 bg-green-600/20 text-green-200 text-xs">
                                Current Era
                              </Badge>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-cyan-300 mb-1">Expected Block Height</p>
                          <p className="text-white font-semibold">
                            {calculatedTime.expectedBlockHeight?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-cyan-300 mb-1">Time from Now</p>
                          <p className="text-white font-semibold">
                            {formatTimeFromNow(calculatedTime)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-cyan-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-cyan-300 mb-1">Era Start Time</p>
                            <p className="text-white font-mono text-xs">
                              {formatDateTime(calculatedTime.eraStartTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-cyan-300 mb-1">Era End Time</p>
                            <p className="text-white font-mono text-xs">
                              {formatDateTime(calculatedTime.eraEndTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="mt-3 pt-3 border-t border-cyan-500/20">
                    <p className="text-xs text-cyan-400">
                      * Calculation based on 2-hour era duration and ~450 blocks per era. Actual values may vary due to network conditions.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Last Switch Block */}
          <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-200 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Last Switch Block
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-purple-300 mb-1">Timestamp</p>
                <p className="text-white font-mono text-sm">
                  {eraData && formatDateTime(eraData.lastSwitchBlock)}
                </p>
              </div>
              <div>
                <p className="text-sm text-purple-300 mb-1">Block Height</p>
                <p className="text-white font-semibold">
                  {eraData?.lastSwitchBlockHeight?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-purple-300 mb-1">Block Hash</p>
                <p className="text-white font-mono text-xs break-all bg-slate-800/50 p-2 rounded">
                  {eraData?.blockHash}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Switch Block */}
          <Card className="bg-white/10 backdrop-blur-sm border-green-500/30 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-200 flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Next Switch Block
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-green-300 mb-1">Expected Time</p>
                <p className="text-white font-mono text-sm">
                  {eraData && formatDateTime(eraData.nextSwitchBlock)}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-300 mb-1">Expected Block Height</p>
                <p className="text-white font-semibold">
                  {eraData?.nextBlockHeight?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-300 mb-1">Era Duration</p>
                <p className="text-white">≈ 2 hours (~450 blocks)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-purple-300 text-sm space-y-2">
          <p>
            {lastUpdate && `Last updated: ${formatDateTime(lastUpdate)}`}
          </p>
          <p>
            {backendStatus === 'connected' 
              ? 'Live data via secure backend API' 
              : 'Demo mode - Backend unavailable'}
          </p>
          <p className="text-xs opacity-75">
            Auto-refresh every 5 minutes • Built with React & Flask
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
