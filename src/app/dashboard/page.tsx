"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Profile, type BodyMeasurement, type ProgressPhoto } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, TrendingUp, Camera, Ruler, LogOut, Plus, Calendar, Calculator, Video, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])

  // Macro calculator state
  const [macroForm, setMacroForm] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male",
    activityLevel: "moderate",
    goal: "maintain"
  })
  const [macroResults, setMacroResults] = useState<{
    calories: number
    protein: number
    carbs: number
    fats: number
  } | null>(null)

  // New measurement form
  const [newMeasurement, setNewMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    body_fat_percentage: "",
    notes: "",
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      setError(null)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error("Auth error:", authError)
        setError("Erro de autenticação. Redirecionando para login...")
        setTimeout(() => router.push("/login"), 2000)
        return
      }

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      
      // Tentar carregar dados, mas não bloquear se falhar
      try {
        await loadProfile(user.id)
        await loadMeasurements(user.id)
        await loadPhotos(user.id)
      } catch (dataError) {
        console.error("Error loading data:", dataError)
        setError("Alguns dados não puderam ser carregados, mas você pode continuar usando o dashboard.")
      }
    } catch (error) {
      console.error("Error checking user:", error)
      setError("Erro ao verificar usuário. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error("Error loading profile:", error)
      }
      if (data) setProfile(data)
    } catch (error) {
      console.error("Error in loadProfile:", error)
    }
  }

  const loadMeasurements = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (error && error.code !== 'PGRST116') {
        console.error("Error loading measurements:", error)
      }
      if (data) setMeasurements(data)
    } catch (error) {
      console.error("Error in loadMeasurements:", error)
    }
  }

  const loadPhotos = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })

      if (error && error.code !== 'PGRST116') {
        console.error("Error loading photos:", error)
      }
      if (data) setPhotos(data)
    } catch (error) {
      console.error("Error in loadPhotos:", error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const calculateMacros = (e: React.FormEvent) => {
    e.preventDefault()
    
    const age = parseInt(macroForm.age)
    const weight = parseFloat(macroForm.weight)
    const height = parseFloat(macroForm.height)
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number
    if (macroForm.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Activity level multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }
    
    // Calculate TDEE
    const tdee = bmr * activityMultipliers[macroForm.activityLevel]
    
    // Adjust calories based on goal
    let calories: number
    if (macroForm.goal === "lose") {
      calories = tdee - 500
    } else if (macroForm.goal === "gain") {
      calories = tdee + 300
    } else {
      calories = tdee
    }
    
    // Calculate macros
    const protein = weight * 2
    const fats = (calories * 0.25) / 9
    const proteinCalories = protein * 4
    const fatCalories = fats * 9
    const carbCalories = calories - proteinCalories - fatCalories
    const carbs = carbCalories / 4
    
    setMacroResults({
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats)
    })
  }

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      const { error } = await supabase
        .from("body_measurements")
        .insert({
          user_id: user.id,
          date: newMeasurement.date,
          weight: newMeasurement.weight ? parseFloat(newMeasurement.weight) : null,
          height: newMeasurement.height ? parseFloat(newMeasurement.height) : null,
          chest: newMeasurement.chest ? parseFloat(newMeasurement.chest) : null,
          waist: newMeasurement.waist ? parseFloat(newMeasurement.waist) : null,
          hips: newMeasurement.hips ? parseFloat(newMeasurement.hips) : null,
          arms: newMeasurement.arms ? parseFloat(newMeasurement.arms) : null,
          thighs: newMeasurement.thighs ? parseFloat(newMeasurement.thighs) : null,
          body_fat_percentage: newMeasurement.body_fat_percentage ? parseFloat(newMeasurement.body_fat_percentage) : null,
          notes: newMeasurement.notes || null,
        })

      if (error) throw error

      // Reset form
      setNewMeasurement({
        date: new Date().toISOString().split('T')[0],
        weight: "",
        height: "",
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: "",
        body_fat_percentage: "",
        notes: "",
      })

      // Reload measurements
      await loadMeasurements(user.id)
    } catch (error) {
      console.error("Error adding measurement:", error)
      alert("Erro ao adicionar medição. Tente novamente.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando seu dashboard...</div>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Erro ao Carregar</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button 
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold"
          >
            Ir para Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
                FitCoach Pro
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-gray-300 hidden md:block">
                Olá, {profile?.full_name || user?.email || "Usuário"}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Error Banner */}
      {error && user && (
        <div className="bg-orange-500/20 border-b border-orange-500/50 px-4 py-3">
          <div className="container mx-auto flex items-center gap-2 text-orange-300">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            Área do Cliente
          </h1>
          <p className="text-gray-400">Acompanhe sua evolução e resultados</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/40 border border-orange-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Visão Geral</TabsTrigger>
            <TabsTrigger value="measurements" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Medidas</TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Calculadora</TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Vídeo</TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Planos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-orange-400" />
                    Última Medição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {measurements.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-200">
                        <span>Peso:</span>
                        <span className="font-bold text-orange-400">{measurements[0].weight} kg</span>
                      </div>
                      <div className="flex justify-between text-gray-200">
                        <span>Data:</span>
                        <span className="text-gray-400">{new Date(measurements[0].date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">Nenhuma medição registrada</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {measurements.length >= 2 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-200">
                        <span>Variação:</span>
                        <span className="font-bold text-orange-400">
                          {((measurements[0].weight || 0) - (measurements[1].weight || 0)).toFixed(1)} kg
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-200">
                        <span>Total de medições:</span>
                        <span className="text-gray-400">{measurements.length}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">Adicione mais medições para ver o progresso</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-400" />
                    Fotos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-200">
                      <span>Total de fotos:</span>
                      <span className="font-bold text-orange-400">{photos.length}</span>
                    </div>
                    {photos.length > 0 && (
                      <div className="flex justify-between text-gray-200">
                        <span>Última foto:</span>
                        <span className="text-gray-400">{new Date(photos[0].date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Measurements Tab */}
          <TabsContent value="measurements" className="space-y-6">
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-400" />
                  Adicionar Nova Medição
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Registre suas medidas corporais para acompanhar sua evolução
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMeasurement} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-gray-200">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newMeasurement.date}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, date: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight" className="text-gray-200">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="70.5"
                        value={newMeasurement.weight}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, weight: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="height" className="text-gray-200">Altura (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        placeholder="175"
                        value={newMeasurement.height}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, height: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="chest" className="text-gray-200">Peitoral (cm)</Label>
                      <Input
                        id="chest"
                        type="number"
                        step="0.1"
                        placeholder="95"
                        value={newMeasurement.chest}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, chest: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="waist" className="text-gray-200">Cintura (cm)</Label>
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        placeholder="80"
                        value={newMeasurement.waist}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, waist: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hips" className="text-gray-200">Quadril (cm)</Label>
                      <Input
                        id="hips"
                        type="number"
                        step="0.1"
                        placeholder="95"
                        value={newMeasurement.hips}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, hips: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="arms" className="text-gray-200">Braços (cm)</Label>
                      <Input
                        id="arms"
                        type="number"
                        step="0.1"
                        placeholder="35"
                        value={newMeasurement.arms}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, arms: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="thighs" className="text-gray-200">Coxas (cm)</Label>
                      <Input
                        id="thighs"
                        type="number"
                        step="0.1"
                        placeholder="55"
                        value={newMeasurement.thighs}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, thighs: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="body_fat" className="text-gray-200">% Gordura</Label>
                      <Input
                        id="body_fat"
                        type="number"
                        step="0.1"
                        placeholder="15.5"
                        value={newMeasurement.body_fat_percentage}
                        onChange={(e) => setNewMeasurement({ ...newMeasurement, body_fat_percentage: e.target.value })}
                        className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-gray-200">Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Adicione observações sobre esta medição..."
                      value={newMeasurement.notes}
                      onChange={(e) => setNewMeasurement({ ...newMeasurement, notes: e.target.value })}
                      className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold"
                  >
                    Salvar Medição
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Measurements History */}
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  Histórico de Medições
                </CardTitle>
              </CardHeader>
              <CardContent>
                {measurements.length > 0 ? (
                  <div className="space-y-4">
                    {measurements.map((measurement) => (
                      <div
                        key={measurement.id}
                        className="bg-black/40 p-4 rounded-lg border border-orange-500/30"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-orange-400 font-bold">
                            {new Date(measurement.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {measurement.weight && (
                            <div className="text-gray-200">
                              <span className="text-gray-400">Peso:</span> {measurement.weight} kg
                            </div>
                          )}
                          {measurement.chest && (
                            <div className="text-gray-200">
                              <span className="text-gray-400">Peitoral:</span> {measurement.chest} cm
                            </div>
                          )}
                          {measurement.waist && (
                            <div className="text-gray-200">
                              <span className="text-gray-400">Cintura:</span> {measurement.waist} cm
                            </div>
                          )}
                          {measurement.hips && (
                            <div className="text-gray-200">
                              <span className="text-gray-400">Quadril:</span> {measurement.hips} cm
                            </div>
                          )}
                          {measurement.arms && (
                            <div className="text-gray-200">
                              <span className="text-gray-400">Braços:</span> {measurement.arms} cm
                            </div>
                          )}
                          {measurement.thighs && (
                            <div className="text-gray-200">
                              <span className="text-gray-400">Coxas:</span> {measurement.thighs} cm
                            </div>
                          )}
                          {measurement.body_fat_percentage && (
                            <div className="text-gray-200">
                              <span className="text-gray-400">% Gordura:</span> {measurement.body_fat_percentage}%
                            </div>
                          )}
                        </div>
                        {measurement.notes && (
                          <p className="text-gray-300 text-sm mt-3 italic">{measurement.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Nenhuma medição registrada ainda. Adicione sua primeira medição acima!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Macro Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calculator Form */}
              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-400" />
                    Calculadora de Macronutrientes
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Calcule suas necessidades diárias de calorias e macros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={calculateMacros} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="text-gray-200">Idade</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="25"
                          value={macroForm.age}
                          onChange={(e) => setMacroForm({ ...macroForm, age: e.target.value })}
                          className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="macro-weight" className="text-gray-200">Peso (kg)</Label>
                        <Input
                          id="macro-weight"
                          type="number"
                          step="0.1"
                          placeholder="70"
                          value={macroForm.weight}
                          onChange={(e) => setMacroForm({ ...macroForm, weight: e.target.value })}
                          className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="macro-height" className="text-gray-200">Altura (cm)</Label>
                        <Input
                          id="macro-height"
                          type="number"
                          placeholder="175"
                          value={macroForm.height}
                          onChange={(e) => setMacroForm({ ...macroForm, height: e.target.value })}
                          className="bg-black/40 border-orange-500/50 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="gender" className="text-gray-200">Sexo</Label>
                        <Select
                          value={macroForm.gender}
                          onValueChange={(value) => setMacroForm({ ...macroForm, gender: value })}
                        >
                          <SelectTrigger className="bg-black/40 border-orange-500/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-orange-500/50">
                            <SelectItem value="male" className="text-white hover:bg-orange-500/20">Masculino</SelectItem>
                            <SelectItem value="female" className="text-white hover:bg-orange-500/20">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="activity" className="text-gray-200">Nível de Atividade</Label>
                      <Select
                        value={macroForm.activityLevel}
                        onValueChange={(value) => setMacroForm({ ...macroForm, activityLevel: value })}
                      >
                        <SelectTrigger className="bg-black/40 border-orange-500/50 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-orange-500/50">
                          <SelectItem value="sedentary" className="text-white hover:bg-orange-500/20">Sedentário (pouco ou nenhum exercício)</SelectItem>
                          <SelectItem value="light" className="text-white hover:bg-orange-500/20">Leve (1-3 dias/semana)</SelectItem>
                          <SelectItem value="moderate" className="text-white hover:bg-orange-500/20">Moderado (3-5 dias/semana)</SelectItem>
                          <SelectItem value="active" className="text-white hover:bg-orange-500/20">Ativo (6-7 dias/semana)</SelectItem>
                          <SelectItem value="veryActive" className="text-white hover:bg-orange-500/20">Muito Ativo (2x por dia)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="goal" className="text-gray-200">Objetivo</Label>
                      <Select
                        value={macroForm.goal}
                        onValueChange={(value) => setMacroForm({ ...macroForm, goal: value })}
                      >
                        <SelectTrigger className="bg-black/40 border-orange-500/50 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-orange-500/50">
                          <SelectItem value="lose" className="text-white hover:bg-orange-500/20">Perder Peso</SelectItem>
                          <SelectItem value="maintain" className="text-white hover:bg-orange-500/20">Manter Peso</SelectItem>
                          <SelectItem value="gain" className="text-white hover:bg-orange-500/20">Ganhar Massa Muscular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold"
                    >
                      Calcular Macros
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Seus Resultados
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Suas necessidades diárias calculadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {macroResults ? (
                    <div className="space-y-6">
                      {/* Calories */}
                      <div className="bg-black/40 p-6 rounded-lg border border-orange-500/30">
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Calorias Diárias</p>
                          <p className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                            {macroResults.calories}
                          </p>
                          <p className="text-gray-400 text-sm mt-2">kcal/dia</p>
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Protein */}
                        <div className="bg-black/40 p-4 rounded-lg border border-orange-500/30 text-center">
                          <p className="text-gray-400 text-xs mb-2">Proteínas</p>
                          <p className="text-3xl font-bold text-orange-400">{macroResults.protein}</p>
                          <p className="text-gray-400 text-xs mt-1">gramas</p>
                          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500" style={{ width: '100%' }} />
                          </div>
                        </div>

                        {/* Carbs */}
                        <div className="bg-black/40 p-4 rounded-lg border border-orange-500/30 text-center">
                          <p className="text-gray-400 text-xs mb-2">Carboidratos</p>
                          <p className="text-3xl font-bold text-orange-400">{macroResults.carbs}</p>
                          <p className="text-gray-400 text-xs mt-1">gramas</p>
                          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500" style={{ width: '100%' }} />
                          </div>
                        </div>

                        {/* Fats */}
                        <div className="bg-black/40 p-4 rounded-lg border border-orange-500/30 text-center">
                          <p className="text-gray-400 text-xs mb-2">Gorduras</p>
                          <p className="text-3xl font-bold text-orange-400">{macroResults.fats}</p>
                          <p className="text-gray-400 text-xs mt-1">gramas</p>
                          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500" style={{ width: '100%' }} />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="bg-black/40 p-4 rounded-lg border border-orange-500/30">
                        <h4 className="text-white font-semibold mb-2">Informações Importantes:</h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Estes valores são estimativas baseadas em fórmulas científicas</li>
                          <li>• Ajuste conforme seus resultados e sensações</li>
                          <li>• Consulte um nutricionista para um plano personalizado</li>
                          <li>• Mantenha-se hidratado (2-3 litros de água por dia)</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calculator className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                      <p className="text-gray-400">Preencha o formulário ao lado para calcular seus macros</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Video Tab */}
          <TabsContent value="video" className="space-y-6">
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-orange-400" />
                  Vídeo Demonstrativo
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Veja como nossos treinos e planos alimentares vão transformar seu corpo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Video Player */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 border-2 border-orange-500/30">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      poster="https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1920"
                    >
                      <source src="https://videos.pexels.com/video-files/3766203/3766203-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                      Seu navegador não suporta vídeos HTML5.
                    </video>
                  </div>

                  {/* Video Description */}
                  <div className="bg-black/40 p-6 rounded-lg border border-orange-500/30">
                    <h3 className="text-xl font-bold text-white mb-4">Transforme Seu Corpo com Nosso Método</h3>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        Nosso programa completo combina treinos personalizados e planos alimentares estratégicos 
                        para garantir resultados reais e duradouros.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 p-4 rounded-lg border border-orange-500/20">
                          <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                            <Dumbbell className="w-4 h-4" />
                            Treinos Personalizados
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-300">
                            <li>• Exercícios adaptados ao seu nível</li>
                            <li>• Progressão gradual e segura</li>
                            <li>• Foco em resultados mensuráveis</li>
                            <li>• Acompanhamento profissional</li>
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 p-4 rounded-lg border border-orange-500/20">
                          <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Planos Alimentares
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-300">
                            <li>• Nutrição balanceada e saborosa</li>
                            <li>• Macros calculados para seu objetivo</li>
                            <li>• Receitas práticas e fáceis</li>
                            <li>• Flexibilidade no cardápio</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-4 rounded-lg border border-orange-500/30 mt-6">
                        <p className="text-white font-semibold text-center">
                          💪 Comece sua transformação hoje mesmo e veja resultados em semanas!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold">
                      Começar Agora
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500/20"
                    >
                      Saber Mais
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-orange-400" />
                    Plano de Treino
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">Seu plano de treino personalizado estará disponível em breve</p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold">
                    Ver Treinos
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Plano de Dieta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">Seu plano alimentar personalizado estará disponível em breve</p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold">
                    Ver Dieta
                  </Button>
                </CardContent>
              </Card>

              {/* Medidas Corporais Card */}
              <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-orange-400" />
                    Resumo de Medidas Corporais
                  </CardTitle>
                  <CardDescription className="text-gray-200 text-base">
                    Acompanhe suas medidas corporais e evolução física ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {measurements.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-orange-500/30">
                            <th className="text-orange-400 font-semibold py-3 px-2">Data</th>
                            <th className="text-orange-400 font-semibold py-3 px-2">Peso (kg)</th>
                            <th className="text-orange-400 font-semibold py-3 px-2">Peitoral (cm)</th>
                            <th className="text-orange-400 font-semibold py-3 px-2">Cintura (cm)</th>
                            <th className="text-orange-400 font-semibold py-3 px-2">Quadril (cm)</th>
                            <th className="text-orange-400 font-semibold py-3 px-2">% Gordura</th>
                          </tr>
                        </thead>
                        <tbody>
                          {measurements.slice(0, 5).map((measurement) => (
                            <tr key={measurement.id} className="border-b border-orange-500/10 hover:bg-black/20">
                              <td className="text-gray-200 py-3 px-2">
                                {new Date(measurement.date).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="text-gray-200 py-3 px-2">{measurement.weight || '-'}</td>
                              <td className="text-gray-200 py-3 px-2">{measurement.chest || '-'}</td>
                              <td className="text-gray-200 py-3 px-2">{measurement.waist || '-'}</td>
                              <td className="text-gray-200 py-3 px-2">{measurement.hips || '-'}</td>
                              <td className="text-gray-200 py-3 px-2">{measurement.body_fat_percentage || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {measurements.length > 5 && (
                        <p className="text-gray-400 text-sm mt-4 text-center">
                          Mostrando as 5 medições mais recentes. Veja todas na aba "Medidas".
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Ruler className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                      <p className="text-gray-400">Nenhuma medição registrada ainda.</p>
                      <p className="text-gray-400 text-sm mt-2">Vá para a aba "Medidas" para adicionar suas primeiras medições!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
