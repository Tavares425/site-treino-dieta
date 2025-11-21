"use client"

import { useState } from "react"
import { Dumbbell, Home, Utensils, TrendingUp, BookOpen, MessageCircle, Menu, X, Clock, Target, Zap, Calculator, ChefHat, Award, Users, Play, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-orange-500/30">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
                FitCoach Pro
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Início</a>
              <a href="#treinos" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Treinos</a>
              <a href="#dieta" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Dieta</a>
              <a href="#resultados" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Resultados</a>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold">
                  Área do Cliente
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-3">
              <a href="#home" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Início</a>
              <a href="#treinos" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Treinos</a>
              <a href="#dieta" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Dieta</a>
              <a href="#resultados" className="text-gray-200 hover:text-orange-400 transition-colors font-medium">Resultados</a>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold">
                  Área do Cliente
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
            TRANSFORME SEU CORPO
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-4 font-bold drop-shadow-lg">
            Treinos + Dieta + Acompanhamento
          </p>
          <p className="text-xl text-gray-300 mb-8 drop-shadow-lg">
            Tudo que você precisa para alcançar seus objetivos, direto no seu celular
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105">
              COMEÇAR AGORA
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500/20 font-bold text-lg shadow-lg hover:scale-105 transition-all">
              VER PLANOS
            </Button>
          </div>
        </div>

        {/* O QUE VOCÊ VAI ENCONTRAR */}
        <div className="mt-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              O QUE VOCÊ VAI ENCONTRAR?
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Treinos Academia */}
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 backdrop-blur-sm overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                <Dumbbell className="w-20 h-20 text-black" />
              </div>
              <CardHeader>
                <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold px-4 py-2 rounded-lg mb-2">
                  TREINOS ACADEMIA
                </div>
                <CardDescription className="text-gray-200 text-base">
                  Programas completos de hipertrofia e emagrecimento com vídeos explicativos passo a passo
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Treinos em Casa */}
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 backdrop-blur-sm overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Home className="w-20 h-20 text-black" />
              </div>
              <CardHeader>
                <div className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-4 py-2 rounded-lg mb-2">
                  TREINOS EM CASA
                </div>
                <CardDescription className="text-gray-200 text-base">
                  Treinos funcionais de 15, 30 e 45 minutos sem necessidade de equipamentos
                </CardDescription>
              </CardHeader>
            </Card>

            {/* E-Book Dicas */}
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 backdrop-blur-sm overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-black" />
              </div>
              <CardHeader>
                <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-600 text-black font-bold px-4 py-2 rounded-lg mb-2">
                  E-BOOK DICAS
                </div>
                <CardDescription className="text-gray-200 text-base">
                  Receitas práticas, dicas de nutrição e guias completos para sua jornada
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-gradient-to-br from-orange-500 to-yellow-500 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">
              TUDO ISSO DE FORMA PRÁTICA
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                <Check className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Vídeos Explicativos</h3>
                  <p className="text-black/80">
                    Cada exercício com vídeo passo a passo para você executar com perfeição
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                <Check className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Planos Personalizados</h3>
                  <p className="text-black/80">
                    Dietas adaptadas para diferentes objetivos e estilos de vida
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                <Check className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Receitas Práticas</h3>
                  <p className="text-black/80">
                    E-books com receitas saborosas e fáceis de preparar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                <Check className="w-8 h-8 text-black flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Novos Treinos Todo Mês</h3>
                  <p className="text-black/80">
                    Conteúdo atualizado mensalmente para você nunca estagnar
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-2xl font-bold text-black mb-2">
                Tudo isso direto no seu celular!
              </p>
              <p className="text-xl text-black/80">
                Acesse de qualquer lugar, a qualquer hora
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vídeo Demonstração */}
      <section id="treinos" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              VEJA COMO FUNCIONA
            </h2>

            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 backdrop-blur-sm overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-24 h-24 text-black mx-auto mb-4" />
                  <p className="text-black font-bold text-xl">Vídeo Demonstrativo</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-200 text-center text-lg">
                  Assista ao vídeo e veja como nossos treinos e planos alimentares vão transformar seu corpo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Área do Cliente Preview */}
      <section id="resultados" className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              ACOMPANHE SUA EVOLUÇÃO
            </h2>
            <p className="text-xl text-gray-300">
              Área exclusiva para clientes com ferramentas profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-orange-400 mb-2" />
                <CardTitle className="text-white text-xl">Gráficos de Progresso</CardTitle>
                <CardDescription className="text-gray-200">
                  Acompanhe sua evolução com gráficos detalhados de peso, medidas e composição corporal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <Target className="w-12 h-12 text-yellow-400 mb-2" />
                <CardTitle className="text-white text-xl">Fotos de Evolução</CardTitle>
                <CardDescription className="text-gray-200">
                  Registre fotos antes/depois e veja sua transformação ao longo do tempo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <Calculator className="w-12 h-12 text-orange-400 mb-2" />
                <CardTitle className="text-white text-xl">Medidas Corporais</CardTitle>
                <CardDescription className="text-gray-200">
                  Registre e acompanhe todas as suas medidas: peso, altura, circunferências e mais
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105">
                ACESSAR ÁREA DO CLIENTE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section id="dieta" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              ESCOLHA SEU PLANO
            </h2>
            <p className="text-xl text-gray-300">
              Invista em você e comece sua transformação hoje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Mensal */}
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Mensal</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-orange-400">R$ 97</span>
                  <span className="text-gray-300">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    Todos os treinos
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    Planos de dieta
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    E-books de receitas
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    Área do cliente
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold">
                  ASSINAR AGORA
                </Button>
              </CardContent>
            </Card>

            {/* Plano Trimestral - DESTAQUE */}
            <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 border-4 border-yellow-400 transform scale-105 shadow-2xl shadow-orange-500/50">
              <div className="bg-black text-center py-2">
                <span className="text-yellow-400 font-bold uppercase tracking-wider">MAIS POPULAR</span>
              </div>
              <CardHeader>
                <CardTitle className="text-black text-2xl">Trimestral</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-black">R$ 247</span>
                  <span className="text-black/80">/3 meses</span>
                </div>
                <p className="text-black/80 font-semibold mt-2">Economize R$ 44</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-black">
                    <Check className="w-5 h-5 text-black" />
                    Todos os treinos
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <Check className="w-5 h-5 text-black" />
                    Planos de dieta
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <Check className="w-5 h-5 text-black" />
                    E-books de receitas
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <Check className="w-5 h-5 text-black" />
                    Área do cliente
                  </li>
                  <li className="flex items-center gap-2 text-black font-bold">
                    <Check className="w-5 h-5 text-black" />
                    Suporte prioritário
                  </li>
                </ul>
                <Button className="w-full bg-black hover:bg-gray-900 text-orange-400 font-bold border-2 border-black">
                  ASSINAR AGORA
                </Button>
              </CardContent>
            </Card>

            {/* Plano Anual */}
            <Card className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Anual</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-orange-400">R$ 797</span>
                  <span className="text-gray-300">/ano</span>
                </div>
                <p className="text-orange-400 font-semibold mt-2">Economize R$ 367</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    Todos os treinos
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    Planos de dieta
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    E-books de receitas
                  </li>
                  <li className="flex items-center gap-2 text-gray-200">
                    <Check className="w-5 h-5 text-orange-400" />
                    Área do cliente
                  </li>
                  <li className="flex items-center gap-2 text-gray-200 font-bold">
                    <Check className="w-5 h-5 text-orange-400" />
                    Consultoria mensal
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold">
                  ASSINAR AGORA
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contato WhatsApp */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-yellow-500">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <MessageCircle className="w-20 h-20 text-black mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              FICOU COM DÚVIDAS?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              Entre em contato pelo WhatsApp e tire todas as suas dúvidas
            </p>
            <Button size="lg" className="bg-black hover:bg-gray-900 text-orange-400 font-bold text-lg shadow-2xl hover:scale-105 transition-all">
              <MessageCircle className="w-6 h-6 mr-2" />
              FALAR NO WHATSAPP
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-orange-500/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-bold text-white">FitCoach Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transformando vidas através de treinos e nutrição personalizados.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Treinos</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Academia</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Em Casa</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">HIIT</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Nutrição</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Receitas</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">E-books</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contato</a></li>
                <li><Link href="/login" className="hover:text-orange-400 transition-colors">Área do Cliente</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-orange-500/30 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 FitCoach Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
