import { useEffect, useState } from "react"
import { EnvelopeSimple, CheckCircle, XCircle, Clock } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { EmailResult } from "@/lib/email-notifications"

export function EmailNotificationLogs() {
  const [logs, setLogs] = useState<EmailResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const savedLogs = await window.spark.kv.get<EmailResult[]>('email-notification-logs') || []
      setLogs(savedLogs.reverse())
    } catch (error) {
      console.error('Failed to load email logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    try {
      await window.spark.kv.set('email-notification-logs', [])
      setLogs([])
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Clock className="animate-spin text-muted-foreground" size={24} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Historique des notifications</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Les 100 dernières tentatives d'envoi d'emails
          </p>
        </div>
        {logs.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearLogs}>
            Effacer l'historique
          </Button>
        )}
      </div>

      {logs.length === 0 ? (
        <Alert>
          <EnvelopeSimple className="h-4 w-4" />
          <AlertDescription>
            Aucun historique de notification. Les notifications apparaîtront ici après l'envoi de formulaires.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          {logs.map((log, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {log.success ? (
                    <CheckCircle size={20} weight="fill" className="text-green-600" />
                  ) : (
                    <XCircle size={20} weight="fill" className="text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground truncate">
                      {log.recipientEmail}
                    </span>
                    <Badge variant={log.success ? "default" : "destructive"}>
                      {log.success ? "Ouvert" : "Échec"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(log.timestamp).toLocaleString('fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'medium'
                    })}
                  </p>
                  {log.error && (
                    <p className="text-xs text-destructive mt-1">
                      Erreur: {log.error}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
