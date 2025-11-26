import { useState } from "react"
import { Plus, Trash, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { useEmailNotifications, type EmailNotificationConfig, sendEmailNotification, type EmailPayload } from "@/lib/email-notifications"
import { Badge } from "@/components/ui/badge"

export function EmailNotificationSettings() {
  const [emailConfigs, setEmailConfigs, deleteEmailConfigs] = useEmailNotifications()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [testingEmail, setTestingEmail] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState({
    name: "",
    email: "",
  })

  const handleAddEmail = () => {
    if (!newEmail.name.trim() || !newEmail.email.trim()) {
      toast.error("Le nom et l'email sont requis")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail.email)) {
      toast.error("Adresse email invalide")
      return
    }

    const config: EmailNotificationConfig = {
      id: `email-${Date.now()}`,
      recipientEmail: newEmail.email,
      recipientName: newEmail.name,
      enabled: true,
      createdAt: new Date().toISOString(),
    }

    setEmailConfigs((current) => [...(current || []), config])
    setNewEmail({ name: "", email: "" })
    setIsAddDialogOpen(false)
    toast.success(`Email ajouté: ${newEmail.email}`)
  }

  const handleRemoveEmail = (id: string) => {
    setEmailConfigs((current) => (current || []).filter(c => c.id !== id))
    toast.success("Email supprimé")
  }

  const handleToggleEmail = (id: string) => {
    setEmailConfigs((current) =>
      (current || []).map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)
    )
  }

  const handleTestEmail = async (config: EmailNotificationConfig) => {
    setTestingEmail(config.id)
    
    const testPayload: EmailPayload = {
      formData: {
        name: "John Doe (TEST)",
        email: "test@example.com",
        countryCode: "+221",
        phone: "76 123 45 67",
        interests: ["Consulting", "Formation"],
        services: ["Audit financier", "Conseil stratégique"],
        modules: ["Comptabilité fondamentale"],
        message: "Ceci est un message de test pour vérifier les notifications email.",
      },
      submittedAt: new Date().toISOString(),
      attachmentCount: 2,
    }

    try {
      const result = await sendEmailNotification(config, testPayload)
      if (result.success) {
        toast.success(`Email de test ouvert pour ${config.recipientEmail}`)
      } else {
        toast.error(`Échec: ${result.error}`)
      }
    } catch (error) {
      toast.error("Erreur lors du test")
    } finally {
      setTestingEmail(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notifications Email</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Recevez des emails automatiques lors de nouvelles soumissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} weight="bold" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une notification email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="recipient-name">Nom du destinataire</Label>
                <Input
                  id="recipient-name"
                  value={newEmail.name}
                  onChange={(e) => setNewEmail({ ...newEmail, name: e.target.value })}
                  placeholder="Ex: Jean Dupont"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="recipient-email">Email</Label>
                <Input
                  id="recipient-email"
                  type="email"
                  value={newEmail.email}
                  onChange={(e) => setNewEmail({ ...newEmail, email: e.target.value })}
                  placeholder="Ex: contact@example.com"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddEmail}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {emailConfigs && emailConfigs.length === 0 ? (
        <Alert>
          <EnvelopeSimple className="h-4 w-4" />
          <AlertDescription>
            Aucune notification email configurée. Ajoutez une adresse email pour recevoir des notifications
            automatiques lors de nouvelles soumissions de formulaire.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {emailConfigs?.map((config) => (
            <Card key={config.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <EnvelopeSimple size={20} weight="bold" className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-foreground">{config.recipientName}</h4>
                      <Badge variant={config.enabled ? "default" : "secondary"}>
                        {config.enabled ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{config.recipientEmail}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ajouté le {new Date(config.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={() => handleToggleEmail(config.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestEmail(config)}
                    disabled={testingEmail === config.id}
                    className="gap-2"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(config.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={18} weight="bold" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Alert>
        <EnvelopeSimple className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Les emails seront ouverts dans votre client email par défaut (Gmail, Outlook, etc.) 
          avec un message pré-rempli contenant toutes les informations du formulaire. Vous devrez ensuite l'envoyer manuellement.
        </AlertDescription>
      </Alert>
    </div>
  )
}
