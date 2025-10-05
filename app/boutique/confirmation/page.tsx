"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function ConfirmationPage() {
  // Générer un numéro de commande aléatoire
  const orderNumber = `CMD-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`

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

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <motion.div className="text-center mb-10" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Commande confirmée !</h1>
        <p className="text-muted-foreground text-lg">
          Merci pour votre achat. Votre commande a été traitée avec succès.
        </p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de commande</p>
                  <p className="font-medium">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">client@exemple.com</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Méthode de paiement</p>
                  <p className="font-medium">Carte bancaire</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Statut de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                <div className="space-y-8 relative">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Commande confirmée</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Préparation en cours</p>
                      <p className="text-sm text-muted-foreground">Votre commande est en cours de préparation</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Expédition</p>
                      <p className="text-sm text-muted-foreground">Votre commande sera expédiée prochainement</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Livraison estimée</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} -
                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Et maintenant ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Vous recevrez un email de confirmation avec les détails de votre commande. Vous pouvez également suivre
                l'état de votre commande dans votre espace client.
              </p>
              <p>
                Si vous avez des questions concernant votre commande, n'hésitez pas à contacter notre service client.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800" asChild>
                <Link href="/dashboard">
                  Mon compte <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/boutique">Continuer mes achats</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
