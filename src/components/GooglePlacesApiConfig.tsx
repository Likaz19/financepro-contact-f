import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, X, Check } from "@phosphor-icons/react"
import { toast } from "sonner"

export function GooglePlacesApiConfig() {
  const [apiKey, setApiKey] = useKV<string | null>("google-places-api-key", null)
  const [inputValue, setInputValue] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    if (!inputValue.trim()) {
      toast.error("Veuillez entrer une clé API valide")
      return
    }
    
    setApiKey(inputValue.trim())
    setInputValue("")
    setIsEditing(false)
    toast.success("Clé API Google Places enregistrée")
  }

  const handleRemove = () => {
    setApiKey(null)
    setInputValue("")
    setIsEditing(false)
    toast.success("Clé API supprimée")
  }

  if (!isEditing && !apiKey) {
    return (
      <Alert className="border-muted-foreground/20">
        <Key className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm">
            Autocomplétion d'adresse désactivée. Configurez Google Places API pour l'activer.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="ml-4"
          >
            Configurer
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
        <div>
          <Label htmlFor="google-api-key" className="text-sm font-semibold">
            Clé API Google Places
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Obtenez votre clé sur{" "}
            <a
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
        <Input
          id="google-api-key"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="AIzaSy..."
          className="font-mono text-sm"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="gap-2">
            <Check size={16} weight="bold" />
            Enregistrer
          </Button>
          <Button
            onClick={() => {
              setInputValue("")
              setIsEditing(false)
            }}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <X size={16} weight="bold" />
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Alert className="border-primary/20 bg-primary/5">
      <Key className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm text-primary">
          Autocomplétion d'adresse activée via Google Places API
        </span>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInputValue(apiKey || "")
              setIsEditing(true)
            }}
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="text-destructive hover:bg-destructive/10"
          >
            Supprimer
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
