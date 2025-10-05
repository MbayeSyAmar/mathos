"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export default function Cart() {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Votre panier ({totalItems || 0})
          </SheetTitle>
        </SheetHeader>

        {!items || items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-10 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Votre panier est vide</h3>
            <p className="text-muted-foreground mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Button asChild onClick={() => setIsCartOpen(false)}>
              <Link href="/boutique">Voir la boutique</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-auto py-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 py-3"
                  >
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link
                        href={`/boutique/${item.id}`}
                        className="font-medium text-foreground hover:underline line-clamp-1"
                        onClick={() => setIsCartOpen(false)}
                      >
                        {item.title}
                      </Link>
                      <div className="text-sm text-muted-foreground mb-2">{item.price.toFixed(0)} FCFA</div>
                      <div className="flex items-center">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="w-8 text-center text-sm">{item.quantity}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right font-medium">{(item.price * item.quantity).toFixed(0)} FCFA</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{totalPrice.toFixed(2)} FCFA</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span>{totalPrice >= 30000 ? "Gratuite" : "3000 FCFA"}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span className="text-lg">
                  {(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toFixed(0)} FCFA
                </span>
              </div>
              <Button className="w-full bg-gray-900 hover:bg-gray-800" asChild>
                <Link href="/boutique/checkout" onClick={() => setIsCartOpen(false)}>
                  Passer la commande
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild onClick={() => setIsCartOpen(false)}>
                <Link href="/boutique">Continuer mes achats</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
