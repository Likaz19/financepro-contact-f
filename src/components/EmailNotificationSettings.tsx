import { useState } from "react"
import { Plus, Trash, EnvelopeSimple, PaperPlaneTilt, Palette } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { useEmailNotifications, type EmailNotificationConfig, sendEmailNotification, type EmailPayload } from "@/lib/email-notifications"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateEmailTemplate } from "@/lib/email-templates"

export function EmailNotificationSettings() {
  const [emailConfigs, setEmailConfigs, deleteEmailConfigs] = useEmailNotifications()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [testingEmail, setTestingEmail] = useState<string | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewType, setPreviewType] = useState<'consulting' | 'formation' | 'combined'>('consulting')
  const [newEmail, setNewEmail] = useState({
    name: "",
    email: "",
    useHtmlTemplate: true,
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
      useHtmlTemplate: newEmail.useHtmlTemplate,
    }

    setEmailConfigs((current) => [...(current || []), config])
    setNewEmail({ name: "", email: "", useHtmlTemplate: true })
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

  const handleToggleHtmlTemplate = (id: string) => {
    setEmailConfigs((current) =>
      (current || []).map(c => c.id === id ? { ...c, useHtmlTemplate: !c.useHtmlTemplate } : c)
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
        toast.success(`Email de test ouvert pour ${config.recipientEmail} (Template: ${result.templateType})`)
      } else {
        toast.error(`Échec: ${result.error}`)
      }
    } catch (error) {
      toast.error("Erreur lors du test")
    } finally {
      setTestingEmail(null)
    }
  }

  const getPreviewPayload = (type: 'consulting' | 'formation' | 'combined'): EmailPayload => {
    const basePayload = {
      formData: {
        name: "Marie Diallo",
        email: "marie.diallo@example.com",
        countryCode: "+221",
        phone: "77 123 45 67",
        interests: [] as string[],
        services: [] as string[],
        modules: [] as string[],
        message: "Bonjour, je suis très intéressée par vos services. J'aimerais discuter de mes besoins en détail. Pouvez-vous me rappeler dans les prochains jours ?",
      },
      submittedAt: new Date().toISOString(),
      attachmentCount: 1,
    }

    if (type === 'consulting') {
      return {
        ...basePayload,
        formData: {
          ...basePayload.formData,
          interests: ['Consulting'],
          services: ['Audit financier', 'Conseil stratégique', 'Optimisation fiscale'],
        },
      }
    } else if (type === 'formation') {
      return {
        ...basePayload,
        formData: {
          ...basePayload.formData,
          interests: ['Formation'],
          modules: ['Comptabilité fondamentale', 'Analyse financière', 'Gestion financière'],
        },
      }
    } else {
      return {
        ...basePayload,
        formData: {
          ...basePayload.formData,
          interests: ['Consulting', 'Formation'],
          services: ['Audit financier', 'Gestion de trésorerie'],
          modules: ['Comptabilité fondamentale', 'Stratégie & reporting'],
        },
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notifications Email</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Recevez des emails automatiques avec templates personnalisés par intérêt
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewDialogOpen(true)} className="gap-2">
            <Palette size={20} weight="bold" />
            Aperçu Templates
          </Button>
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
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="html-template">Template HTML personnalisé</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Design adapté selon Consulting/Formation
                    </p>
                  </div>
                  <Switch
                    id="html-template"
                    checked={newEmail.useHtmlTemplate}
                    onCheckedChange={(checked) => setNewEmail({ ...newEmail, useHtmlTemplate: checked })}
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
                      {config.useHtmlTemplate && (
                        <Badge variant="outline" className="gap-1">
                          <Palette size={12} weight="bold" />
                          HTML
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{config.recipientEmail}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ajouté le {new Date(config.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`enabled-${config.id}`} className="text-xs">Actif</Label>
                      <Switch
                        id={`enabled-${config.id}`}
                        checked={config.enabled}
                        onCheckedChange={() => handleToggleEmail(config.id)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`html-${config.id}`} className="text-xs">HTML</Label>
                      <Switch
                        id={`html-${config.id}`}
                        checked={config.useHtmlTemplate ?? true}
                        onCheckedChange={() => handleToggleHtmlTemplate(config.id)}
                      />
                    </div>
                  </div>
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
          <strong>Templates personnalisés:</strong> Chaque type d'intérêt (Consulting, Formation, ou les deux) 
          utilise un template HTML unique avec des couleurs et icônes adaptées pour une meilleure expérience.
        </AlertDescription>
      </Alert>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu des Templates Email</DialogTitle>
            <DialogDescription>
              Visualisez les différents templates HTML selon le type d'intérêt du client
            </DialogDescription>
          </DialogHeader>
          <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as typeof previewType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consulting">💼 Consulting</TabsTrigger>
              <TabsTrigger value="formation">📚 Formation</TabsTrigger>
              <TabsTrigger value="combined">⭐ Les Deux</TabsTrigger>
            </TabsList>
            <TabsContent value={previewType} className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generateEmailTemplate(getPreviewPayload(previewType))}
                  title="Email Preview"
                  className="w-full h-[600px] bg-white"
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
