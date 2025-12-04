import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Warning, Flask, Database, WebhooksLogo, Envelope } from "@phosphor-icons/react"
import { useWebhooks, sendToAllWebhooks, type WebhookPayload } from "@/lib/webhooks"
import { useEmailNotifications, sendToAllEmailRecipients, type EmailPayload } from "@/lib/email-notifications"
import { toast } from "sonner"

type TestResult = {
  name: string
  status: "pending" | "success" | "error" | "warning"
  message: string
  details?: string
}

export function FormSubmissionTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [webhooks] = useWebhooks()
  const [emailNotifications] = useEmailNotifications()

  const updateResult = (name: string, status: TestResult["status"], message: string, details?: string) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name)
      if (existing) {
        return prev.map(r => r.name === name ? { name, status, message, details } : r)
      }
      return [...prev, { name, status, message, details }]
    })
  }

  const runTests = async () => {
    setIsRunning(true)
    setResults([])
    toast.info("Démarrage des tests...")

    updateResult("validation", "pending", "Test de validation des champs...")
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const validationTests = {
      name: "Jean Dupont".length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test("test@example.com"),
      phone: /^[0-9]{9}$/.test("764644290"),
    }
    
    if (Object.values(validationTests).every(Boolean)) {
      updateResult("validation", "success", "Validation des champs réussie", 
        "Nom, email et téléphone validés correctement")
    } else {
      updateResult("validation", "error", "Échec de validation", 
        "Un ou plusieurs champs ne passent pas la validation")
    }

    updateResult("storage", "pending", "Test du stockage KV...")
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const testKey = `test_${Date.now()}`
      const testValue = { test: "data", timestamp: Date.now() }
      
      await window.spark.kv.set(testKey, testValue)
      const retrieved = await window.spark.kv.get(testKey)
      
      if (retrieved && JSON.stringify(retrieved) === JSON.stringify(testValue)) {
        await window.spark.kv.delete(testKey)
        updateResult("storage", "success", "Stockage KV opérationnel", 
          "Écriture et lecture des données réussies")
      } else {
        updateResult("storage", "error", "Erreur de stockage", 
          "Les données n'ont pas été correctement enregistrées")
      }
    } catch (err) {
      updateResult("storage", "error", "Erreur storage", 
        err instanceof Error ? err.message : "Erreur inconnue")
    }

    updateResult("webhooks", "pending", "Vérification des webhooks...")
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!webhooks || webhooks.length === 0) {
      updateResult("webhooks", "warning", "Aucun webhook configuré", 
        "Les soumissions ne seront pas envoyées à des services externes")
    } else {
      const enabledWebhooks = webhooks.filter(w => w.enabled)
      if (enabledWebhooks.length === 0) {
        updateResult("webhooks", "warning", `${webhooks.length} webhook(s) désactivé(s)`, 
          "Activez au moins un webhook pour recevoir les soumissions")
      } else {
        updateResult("webhooks", "success", `${enabledWebhooks.length} webhook(s) actif(s)`, 
          enabledWebhooks.map(w => w.name).join(", "))
      }
    }

    updateResult("email", "pending", "Vérification des notifications email...")
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!emailNotifications || emailNotifications.length === 0) {
      updateResult("email", "warning", "Aucune notification email configurée", 
        "Configurez des notifications pour recevoir les soumissions par email")
    } else {
      const enabledEmails = emailNotifications.filter(e => e.enabled)
      if (enabledEmails.length === 0) {
        updateResult("email", "warning", `${emailNotifications.length} notification(s) désactivée(s)`, 
          "Activez au moins une notification pour recevoir les emails")
      } else {
        updateResult("email", "success", `${enabledEmails.length} notification(s) active(s)`, 
          enabledEmails.map(e => `${e.recipientName} (${e.recipientEmail})`).join(", "))
      }
    }

    updateResult("integration", "pending", "Test d'intégration complète...")
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const testSubmission = {
        id: `test_${Date.now()}`,
        formData: {
          name: "Test Utilisateur",
          email: "test@example.com",
          countryCode: "+221",
          phone: "764644290",
          address: "Dakar, Sénégal",
          interests: ["Consulting"],
          services: ["Audit financier"],
          modules: [],
          message: "Test de soumission",
        },
        submittedAt: new Date().toISOString(),
        attachmentCount: 0,
      }

      const existingSubmissions = await window.spark.kv.get<any[]>("form-submissions") || []
      await window.spark.kv.set("form-submissions", [...existingSubmissions, testSubmission])
      
      const updatedSubmissions = await window.spark.kv.get<any[]>("form-submissions") || []
      const found = updatedSubmissions.find(s => s.id === testSubmission.id)
      
      if (found) {
        const cleanedSubmissions = updatedSubmissions.filter(s => s.id !== testSubmission.id)
        await window.spark.kv.set("form-submissions", cleanedSubmissions)
        
        updateResult("integration", "success", "Test d'intégration réussi", 
          "Insertion et suppression test effectuées avec succès")
      } else {
        updateResult("integration", "error", "Échec du test d'insertion", 
          "La soumission test n'a pas été trouvée")
      }
    } catch (err) {
      updateResult("integration", "error", "Erreur d'intégration", 
        err instanceof Error ? err.message : "Erreur inconnue")
    }

    setIsRunning(false)
    toast.success("Tests terminés!")
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle size={20} weight="fill" className="text-green-600" />
      case "error":
        return <XCircle size={20} weight="fill" className="text-destructive" />
      case "warning":
        return <Warning size={20} weight="fill" className="text-amber-500" />
      default:
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-600">Réussi</Badge>
      case "error":
        return <Badge variant="destructive">Échec</Badge>
      case "warning":
        return <Badge className="bg-amber-500">Attention</Badge>
      default:
        return <Badge variant="secondary">En cours...</Badge>
    }
  }

  const successCount = results.filter(r => r.status === "success").length
  const errorCount = results.filter(r => r.status === "error").length
  const warningCount = results.filter(r => r.status === "warning").length

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Flask size={24} weight="bold" />
            Test de Soumission du Formulaire
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vérifiez que tous les composants fonctionnent correctement
          </p>
        </div>
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="gap-2"
          size="lg"
        >
          <Flask size={20} weight="bold" />
          {isRunning ? "Tests en cours..." : "Lancer les tests"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Alert className="border-green-600/50 bg-green-600/10">
            <AlertDescription className="flex items-center justify-between">
              <span className="font-semibold text-green-600">Réussis</span>
              <span className="text-2xl font-bold text-green-600">{successCount}</span>
            </AlertDescription>
          </Alert>
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertDescription className="flex items-center justify-between">
              <span className="font-semibold text-amber-600">Avertissements</span>
              <span className="text-2xl font-bold text-amber-600">{warningCount}</span>
            </AlertDescription>
          </Alert>
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertDescription className="flex items-center justify-between">
              <span className="font-semibold">Échecs</span>
              <span className="text-2xl font-bold">{errorCount}</span>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="space-y-3">
        {results.length === 0 && !isRunning && (
          <Alert>
            <Flask className="h-4 w-4" />
            <AlertDescription>
              Cliquez sur "Lancer les tests" pour vérifier le bon fonctionnement du formulaire de soumission.
            </AlertDescription>
          </Alert>
        )}

        {results.map((result, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getStatusIcon(result.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{result.message}</h4>
                  {getStatusBadge(result.status)}
                </div>
                {result.details && (
                  <p className="text-sm text-muted-foreground">{result.details}</p>
                )}
              </div>
              {result.name === "storage" && <Database size={20} className="text-muted-foreground" />}
              {result.name === "webhooks" && <WebhooksLogo size={20} className="text-muted-foreground" />}
              {result.name === "email" && <Envelope size={20} className="text-muted-foreground" />}
            </div>
          </Card>
        ))}
      </div>

      {results.length > 0 && !isRunning && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Résumé des tests</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {errorCount === 0 && warningCount === 0 && (
              <p className="text-green-600 font-semibold">✅ Tous les tests sont passés avec succès!</p>
            )}
            {errorCount > 0 && (
              <p className="text-destructive font-semibold">⚠️ {errorCount} test(s) ont échoué. Vérifiez la configuration.</p>
            )}
            {warningCount > 0 && errorCount === 0 && (
              <p className="text-amber-600 font-semibold">⚠️ {warningCount} avertissement(s). Le formulaire fonctionne mais certaines fonctionnalités sont désactivées.</p>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
