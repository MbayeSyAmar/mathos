"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createProduit, updateProduit, type Produit } from "@/lib/services/produit-service"
import { X, Plus, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface ProductFormProps {
  product?: Produit
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Produit>>({
    nom: "",
    description: "",
    prix: 0,
    categorie: "livres",
    imageUrl: "/placeholder.svg?height=200&width=400",
    stock: 0,
    estPublie: false,
    tags: [],
    bestseller: false,
    oldPrice: null,
    longDescription: "",
    details: {},
    rating: 4,
    niveau: null,
    auteur: null,
  })
  const [newTag, setNewTag] = useState("")
  const [newDetailKey, setNewDetailKey] = useState("")
  const [newDetailValue, setNewDetailValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Catégories de produits
  const categories = [
    { id: "livres", name: "Livres" },
    { id: "informatique", name: "Informatique" },
    { id: "fournitures", name: "Fournitures scolaires" },
    { id: "calculatrices", name: "Calculatrices" },
  ]

  // Niveaux
  const niveaux = [
    { id: "aucun", name: "Aucun niveau" },
    { id: "débutant", name: "Débutant" },
    { id: "intermédiaire", name: "Intermédiaire" },
    { id: "avancé", name: "Avancé" },
    { id: "expert", name: "Expert" },
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        // Convertir les valeurs undefined en valeurs par défaut
        tags: product.tags || [],
        bestseller: product.bestseller || false,
        oldPrice: product.oldPrice || null,
        longDescription: product.longDescription || "",
        details: product.details || {},
        rating: product.rating || 4,
        niveau: product.niveau || "aucun",
        auteur: product.auteur || null,
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Convertir les valeurs numériques
    if (name === "prix" || name === "stock" || name === "oldPrice" || name === "rating") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    // Pour le niveau, utiliser null si la valeur est "aucun"
    if (name === "niveau" && value === "aucun") {
      setFormData({
        ...formData,
        [name]: null,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove),
    })
  }

  const addDetail = () => {
    if (newDetailKey.trim() && newDetailValue.trim()) {
      setFormData({
        ...formData,
        details: {
          ...(formData.details || {}),
          [newDetailKey.trim()]: newDetailValue.trim(),
        },
      })
      setNewDetailKey("")
      setNewDetailValue("")
    }
  }

  const removeDetail = (keyToRemove: string) => {
    const updatedDetails = { ...(formData.details || {}) }
    delete updatedDetails[keyToRemove]

    setFormData({
      ...formData,
      details: updatedDetails,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validation de base
      if (!formData.nom || !formData.description || formData.prix === undefined) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      console.log("Données du formulaire à soumettre:", formData)

      // Préparer les données à envoyer
      const dataToSubmit = { ...formData }

      if (product?.id) {
        // Mise à jour d'un produit existant
        const success = await updateProduit(product.id, dataToSubmit)
        if (success) {
          toast({
            title: "Produit mis à jour",
            description: "Le produit a été mis à jour avec succès.",
          })
          onSuccess?.()
        } else {
          throw new Error("Erreur lors de la mise à jour du produit")
        }
      } else {
        // Création d'un nouveau produit
        const newProductId = await createProduit(dataToSubmit as Omit<Produit, "id" | "dateCreation">)
        if (newProductId) {
          toast({
            title: "Produit créé",
            description: "Le produit a été créé avec succès.",
          })
          onSuccess?.()
        } else {
          throw new Error("Erreur lors de la création du produit")
        }
      }
    } catch (err: any) {
      console.error("Erreur lors de la soumission du formulaire:", err)
      setError(err.message || "Une erreur est survenue")
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom du produit *</Label>
            <Input id="nom" name="nom" value={formData.nom || ""} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="description">Description courte *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              required
              className="h-24"
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Description détaillée</Label>
            <Textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription || ""}
              onChange={handleChange}
              className="h-32"
            />
          </div>

          <div>
            <Label htmlFor="categorie">Catégorie *</Label>
            <Select
              value={formData.categorie || "livres"}
              onValueChange={(value) => handleSelectChange("categorie", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="niveau">Niveau</Label>
            <Select value={formData.niveau || "aucun"} onValueChange={(value) => handleSelectChange("niveau", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                {niveaux.map((niveau) => (
                  <SelectItem key={niveau.id} value={niveau.id}>
                    {niveau.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="auteur">Auteur</Label>
            <Input
              id="auteur"
              name="auteur"
              value={formData.auteur || ""}
              onChange={handleChange}
              placeholder="Nom de l'auteur"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ""}
              onChange={handleChange}
              placeholder="/placeholder.svg?height=200&width=400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prix">Prix (FCFA) *</Label>
              <Input
                id="prix"
                name="prix"
                type="number"
                value={formData.prix || 0}
                onChange={handleChange}
                required
                min={0}
              />
            </div>

            <div>
              <Label htmlFor="oldPrice">Ancien prix (FCFA)</Label>
              <Input
                id="oldPrice"
                name="oldPrice"
                type="number"
                value={formData.oldPrice || ""}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock || 0}
                onChange={handleChange}
                required
                min={0}
              />
            </div>

            <div>
              <Label htmlFor="rating">Note (0-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating || 4}
                onChange={handleChange}
                min={0}
                max={5}
                step={0.1}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="estPublie"
              checked={formData.estPublie || false}
              onCheckedChange={(checked) => handleSwitchChange("estPublie", checked)}
            />
            <Label htmlFor="estPublie">Publier le produit</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="bestseller"
              checked={formData.bestseller || false}
              onCheckedChange={(checked) => handleSwitchChange("bestseller", checked)}
            />
            <Label htmlFor="bestseller">Marquer comme bestseller</Label>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nouveau tag"
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Détails supplémentaires</Label>
            <div className="space-y-2">
              {Object.entries(formData.details || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                  <button type="button" onClick={() => removeDetail(key)} className="text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input value={newDetailKey} onChange={(e) => setNewDetailKey(e.target.value)} placeholder="Clé" />
              <Input value={newDetailValue} onChange={(e) => setNewDetailValue(e.target.value)} placeholder="Valeur" />
            </div>
            <Button type="button" size="sm" onClick={addDetail} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un détail
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Mettre à jour" : "Créer le produit"}
        </Button>
      </div>
    </form>
  )
}
