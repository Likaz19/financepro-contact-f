import { useState, useMemo } from "react"
import { Plus, Trash, PencilSimple, Copy, WebhooksLogo, PaperPlaneTilt } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useWebhooks, type WebhookConfig, sendToWebhook, type WebhookPayload } from "@/lib/webhooks"
import { Badge } from "@/components/ui/badge"
import { WebhookLogs } from "@/components/WebhookLogs"
import { LocalhostWebhookWarning } from "@/components/LocalhostWebhookWarning"

export function WebhookSettings() {
  const [webhooks, setWebhooks, deleteWebhooks] = useWebhooks()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null)
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    headers: "",
  })

  const localhostWebhooks = useMemo(() => {
    return (webhooks || []).filter(w => 
      w.enabled && (w.url.includes('localhost') || w.url.includes('127.0.0.1'))
    )
  }, [webhooks])

  const handleDisableAllLocalhost = () => {
    setWebhooks((current) =>
      (current || []).map(w => 
        (w.url.includes('localhost') || w.url.includes('127.0.0.1'))
          ? { ...w, enabled: false }
          : w
      )
    )
    toast.success(`${localhostWebhooks.length} webhook(s) localhost désactivé(s)`)
  }

  const handleAddWebhook = () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim()) {
      toast.error("Le nom et l'URL sont requis")
      return
    }

    try {
      new URL(newWebhook.url)
    } catch {
      toast.error("URL invalide")
      return
    }

    if (newWebhook.url.includes('localhost') || newWebhook.url.includes('127.0.0.1')) {
      toast.warning("⚠️ URL localhost détectée", {
        description: "Ce webhook ne fonctionnera que si un serveur local est en cours d'exécution. Utilisez une URL publique pour un usage en production.",
        duration: 6000
      })
    }

    let parsedHeaders: Record<string, string> = {}
    if (newWebhook.headers.trim()) {
      try {
        parsedHeaders = JSON.parse(newWebhook.headers)
      } catch {
        toast.error("En-têtes invalides. Utilisez le format JSON: {\"key\": \"value\"}")
        return
      }
    }

    const webhook: WebhookConfig = {
      id: `webhook_${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      enabled: true,
      headers: Object.keys(parsedHeaders).length > 0 ? parsedHeaders : undefined,
      createdAt: new Date().toISOString(),
    }

    setWebhooks((current) => [...(current || []), webhook])
    setNewWebhook({ name: "", url: "", headers: "" })
    setIsAddDialogOpen(false)
    toast.success("Webhook ajouté avec succès")
  }

  const handleUpdateWebhook = () => {
    if (!editingWebhook) return

    if (!editingWebhook.name.trim() || !editingWebhook.url.trim()) {
      toast.error("Le nom et l'URL sont requis")
      return
    }

    try {
      new URL(editingWebhook.url)
    } catch {
      toast.error("URL invalide")
      return
    }

    setWebhooks((current) =>
      (current || []).map((w) => (w.id === editingWebhook.id ? editingWebhook : w))
    )
    setEditingWebhook(null)
    toast.success("Webhook mis à jour")
  }

  const handleDeleteWebhook = (id: string) => {
    setWebhooks((current) => (current || []).filter((w) => w.id !== id))
    toast.success("Webhook supprimé")
  }

  const handleToggleWebhook = (id: string) => {
    setWebhooks((current) =>
      (current || []).map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    )
  }

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    setTestingWebhook(webhook.id)
    
    const testPayload: WebhookPayload = {
      formData: {
        name: "Test Utilisateur",
        email: "test@example.com",
        countryCode: "+221",
        phone: "764644290",
        address: "Dakar, Sénégal",
        interests: ["Consulting", "Formation"],
        services: ["Audit financier"],
        modules: ["Comptabilité fondamentale"],
        message: "Ceci est un message de test",
      },
      submittedAt: new Date().toISOString(),
      attachmentCount: 0,
    }

    try {
      const result = await sendToWebhook(webhook, testPayload)
      
      if (result.success) {
        toast.success(`Test réussi: ${webhook.name} (${result.statusCode})`)
      } else {
        toast.error(`Test échoué: ${result.error}`)
      }
    } catch (error) {
      toast.error("Erreur lors du test du webhook")
    } finally {
      setTestingWebhook(null)
    }
  }

  const copyExamplePayload = () => {
    const examplePayload = {
      formData: {
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        countryCode: "+221",
        phone: "764644290",
        interests: ["Consulting", "Formation"],
        services: ["Audit financier", "Conseil stratégique"],
        modules: ["Comptabilité fondamentale"],
        message: "Je souhaite en savoir plus sur vos services",
      },
      submittedAt: new Date().toISOString(),
      attachmentCount: 2,
    }

    navigator.clipboard.writeText(JSON.stringify(examplePayload, null, 2))
    toast.success("Exemple de payload copié dans le presse-papiers")
  }

  return (
    <Tabs defaultValue="webhooks" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="webhooks">Configuration</TabsTrigger>
        <TabsTrigger value="logs">Historique</TabsTrigger>
      </TabsList>
      
      <TabsContent value="webhooks" className="space-y-6">
        {localhostWebhooks.length > 0 && (
          <LocalhostWebhookWarning 
            webhookCount={localhostWebhooks.length}
            onDisableAll={handleDisableAllLocalhost}
          />
        )}

        <Alert>
          <WebhooksLogo className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Connectez vos outils favoris</p>
            <p className="text-sm mb-2">
              Les webhooks permettent d'envoyer automatiquement les soumissions du formulaire vers Zapier, Make.com, Slack, ou votre propre API.
            </p>
            <p className="text-sm font-semibold text-destructive mb-2">
              ⚠️ N'utilisez PAS d'URL localhost (127.0.0.1) - elles ne fonctionneront pas dans cette application web.
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyExamplePayload}
                className="gap-2"
              >
                <Copy size={14} />
                Exemple de payload
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="https://webhook.site" target="_blank" rel="noopener noreferrer">
                  Tester avec webhook.site
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
              <WebhooksLogo size={24} weight="bold" />
              Intégrations Webhook
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Envoyez automatiquement les données du formulaire vers des services externes
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={20} weight="bold" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un webhook</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="webhook-name">Nom du webhook</Label>
                  <Input
                    id="webhook-name"
                    placeholder="Ex: Zapier, Make.com, Service CRM"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-url">URL du webhook</Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-headers">
                    En-têtes personnalisés (optionnel)
                  </Label>
                  <Input
                    id="webhook-headers"
                    placeholder='{"Authorization": "Bearer YOUR_TOKEN"}'
                    value={newWebhook.headers}
                    onChange={(e) => setNewWebhook({ ...newWebhook, headers: e.target.value })}
                    className="mt-2 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format JSON: clés et valeurs entre guillemets
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddWebhook}>Ajouter le webhook</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {!webhooks || webhooks.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <WebhooksLogo size={48} className="mx-auto text-muted-foreground mb-4" weight="thin" />
            <h4 className="font-semibold text-foreground mb-2">Aucun webhook configuré</h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Ajoutez des webhooks pour envoyer automatiquement les soumissions du formulaire vers Zapier, Make.com, ou tout autre service.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{webhook.name}</h4>
                      <Badge variant={webhook.enabled ? "default" : "secondary"}>
                        {webhook.enabled ? "Activé" : "Désactivé"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {webhook.url}
                    </p>
                    {(webhook.url.includes('localhost') || webhook.url.includes('127.0.0.1')) && (
                      <Alert className="mt-2 py-2 px-3 bg-destructive/5 border-destructive/20">
                        <AlertDescription className="text-xs text-destructive">
                          <strong>⚠️ URL localhost détectée</strong>
                          <br />
                          Ce webhook sera automatiquement ignoré lors des soumissions. Les URLs localhost ne fonctionnent pas dans les applications web.
                          <br />
                          <span className="font-semibold">Solutions recommandées:</span> Utilisez webhook.site, Zapier, Make.com, ou une autre URL publique accessible sur internet.
                        </AlertDescription>
                      </Alert>
                    )}
                    {webhook.headers && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {Object.keys(webhook.headers).length} en-tête(s) personnalisé(s)
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Créé le {new Date(webhook.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook)}
                      disabled={testingWebhook === webhook.id}
                      className="gap-2"
                    >
                      <PaperPlaneTilt size={16} weight="bold" />
                      {testingWebhook === webhook.id ? "Test..." : "Tester"}
                    </Button>
                    <Switch
                      checked={webhook.enabled}
                      onCheckedChange={() => handleToggleWebhook(webhook.id)}
                    />
                    <Dialog
                      open={editingWebhook?.id === webhook.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setEditingWebhook(webhook)
                        } else {
                          setEditingWebhook(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <PencilSimple size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Modifier le webhook</DialogTitle>
                        </DialogHeader>
                        {editingWebhook && (
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="edit-webhook-name">Nom du webhook</Label>
                              <Input
                                id="edit-webhook-name"
                                value={editingWebhook.name}
                                onChange={(e) =>
                                  setEditingWebhook({ ...editingWebhook, name: e.target.value })
                                }
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-webhook-url">URL du webhook</Label>
                              <Input
                                id="edit-webhook-url"
                                type="url"
                                value={editingWebhook.url}
                                onChange={(e) =>
                                  setEditingWebhook({ ...editingWebhook, url: e.target.value })
                                }
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-webhook-headers">
                                En-têtes personnalisés (optionnel)
                              </Label>
                              <Input
                                id="edit-webhook-headers"
                                value={
                                  editingWebhook.headers
                                    ? JSON.stringify(editingWebhook.headers)
                                    : ""
                                }
                                onChange={(e) => {
                                  try {
                                    const parsed = e.target.value.trim()
                                      ? JSON.parse(e.target.value)
                                      : undefined
                                    setEditingWebhook({ ...editingWebhook, headers: parsed })
                                  } catch {
                                    setEditingWebhook({
                                      ...editingWebhook,
                                      headers: editingWebhook.headers,
                                    })
                                  }
                                }}
                                className="mt-2 font-mono text-sm"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="secondary" onClick={() => setEditingWebhook(null)}>
                            Annuler
                          </Button>
                          <Button onClick={handleUpdateWebhook}>Enregistrer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash size={18} weight="bold" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="logs">
        <WebhookLogs />
      </TabsContent>
    </Tabs>
  )
}
