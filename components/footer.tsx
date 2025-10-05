import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Mathosphère</h3>
            <p className="text-sm text-muted-foreground">
              Plateforme d'apprentissage des mathématiques pour tous les niveaux.
            </p>
            <div className="flex space-x-3">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cours" className="text-muted-foreground hover:text-primary">
                  Cours
                </Link>
              </li>
              <li>
                <Link href="/exercices" className="text-muted-foreground hover:text-primary">
                  Exercices
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-primary">
                  Quiz
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-muted-foreground hover:text-primary">
                  Vidéos YouTube
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/encadrement" className="text-muted-foreground hover:text-primary">
                  Encadrement personnalisé
                </Link>
              </li>
              <li>
                <Link href="/groupe" className="text-muted-foreground hover:text-primary">
                  Groupe Mathosphère
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/conditions" className="text-muted-foreground hover:text-primary">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-muted-foreground hover:text-primary">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-muted-foreground hover:text-primary">
                  Espace administrateur
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mathosphère. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
