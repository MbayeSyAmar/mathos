"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Calendar, ArrowRight, MapPin, Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Separator } from "@/components/ui/separator"
import { BackButton } from "@/components/back-button"

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  category: string
}

interface Order {
  orderNumber: string
  userInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  items: OrderItem[]
  total: number
  subtotal: number
  status: string
  paymentMethod: string
  createdAt: any
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const orderNumber = searchParams.get("orderNumber")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderNumber || !user) {
        setLoading(false)
        return
      }

      try {
        const ordersRef = collection(db, "orders")
        const q = query(
          ordersRef,
          where("orderNumber", "==", orderNumber),
          where("userId", "==", user.uid)
        )
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const orderDoc = querySnapshot.docs[0]
          setOrder(orderDoc.data() as Order)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la commande:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderNumber, user])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  if (loading) {
    return (
      <div className="container py-10 max-w-3xl mx-auto text-center">
        <p>Chargement de votre commande...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-10 max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
        <p className="text-muted-foreground mb-6">
          Nous n'avons pas pu trouver cette commande.
        </p>
        <Button onClick={() => router.push("/boutique")}>
          Retour à la boutique
        </Button>
      </div>
    )
  }

  const statusInfo = {
    pending: {
      label: "En attente de validation",
      description: "Votre commande est en cours de vérification par notre équipe",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    approved: {
      label: "Approuvée",
      description: "Votre commande a été approuvée et sera bientôt expédiée",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    shipped: {
      label: "Expédiée",
      description: "Votre commande est en cours de livraison",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    delivered: {
      label: "Livrée",
      description: "Votre commande a été livrée",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    rejected: {
      label: "Rejetée",
      description: "Votre commande a été rejetée. Veuillez nous contacter pour plus d'informations",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  }

  const currentStatus = statusInfo[order.status as keyof typeof statusInfo] || statusInfo.pending

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <div className="mb-6">
        <BackButton href="/boutique" label="Retour à la boutique" />
      </div>

      <motion.div className="text-center mb-10" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Commande confirmée !</h1>
        <p className="text-muted-foreground text-lg">
          Merci pour votre commande. Nous avons bien reçu votre demande.
        </p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
        {/* Numéro de commande */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Numéro de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-mono text-lg font-semibold">
                  {order.orderNumber}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(order.orderNumber)
                  }}
                >
                  Copier
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statut de la commande */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Statut de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${currentStatus.bgColor}`}>
                <div className="flex items-center gap-3">
                  <Package className={`h-6 w-6 ${currentStatus.color}`} />
                  <div>
                    <p className={`font-semibold ${currentStatus.color}`}>
                      {currentStatus.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentStatus.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informations de livraison */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">
                    {order.userInfo.firstName} {order.userInfo.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.userInfo.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.userInfo.postalCode} {order.userInfo.city}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.userInfo.country}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{order.userInfo.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{order.userInfo.email}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Livraison</p>
                  <p className="text-sm text-muted-foreground">
                    Les détails de livraison seront discutés avec l'administrateur selon votre localisation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Articles commandés */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Articles commandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantité : {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{order.subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-muted-foreground">À discuter</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{order.total.toLocaleString()} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">Voir mes commandes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/boutique">Continuer mes achats</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
