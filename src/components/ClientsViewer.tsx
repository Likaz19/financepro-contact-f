import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowsClockwise, Warning, CheckCircle } from "@phosphor-icons/react"

type Client = {
  id: string
  name: string
  email: string
  country_code?: string
  phone?: string
  address?: string
  interests?: string[]
  services?: string[]
  modules?: string[]
  message?: string
  created_at: string
}

export function ClientsViewer() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const fetchClients = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('Clients data:', data)
      console.log('Clients error:', fetchError)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setClients(data || [])
      setLastFetch(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      console.error('Erreur lors de la récupération des clients:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={24} weight="bold" className="text-primary" />
          <h3 className="text-lg font-semibold">Table Clients</h3>
        </div>
        <Button
          onClick={fetchClients}
          disabled={loading}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <ArrowsClockwise size={16} weight="bold" className={loading ? "animate-spin" : ""} />
          Actualiser
        </Button>
      </div>

      {lastFetch && (
        <p className="text-xs text-muted-foreground">
          Dernière actualisation: {lastFetch.toLocaleTimeString('fr-FR')}
        </p>
      )}

      {error && (
        <Alert variant="destructive">
          <Warning size={16} weight="bold" />
          <AlertDescription>
            <strong>Erreur:</strong> {error}
            {error.includes('does not exist') && (
              <div className="mt-2">
                <p className="text-sm">La table 'clients' n'existe pas dans votre base de données.</p>
                <p className="text-sm mt-1">Créez-la avec cette commande SQL dans Supabase:</p>
                <code className="block mt-2 p-2 bg-black/10 rounded text-xs">
                  CREATE TABLE clients (
                    <br />
                    &nbsp;&nbsp;id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    <br />
                    &nbsp;&nbsp;name TEXT NOT NULL,
                    <br />
                    &nbsp;&nbsp;email TEXT NOT NULL,
                    <br />
                    &nbsp;&nbsp;country_code TEXT,
                    <br />
                    &nbsp;&nbsp;phone TEXT,
                    <br />
                    &nbsp;&nbsp;address TEXT,
                    <br />
                    &nbsp;&nbsp;interests TEXT[],
                    <br />
                    &nbsp;&nbsp;services TEXT[],
                    <br />
                    &nbsp;&nbsp;modules TEXT[],
                    <br />
                    &nbsp;&nbsp;message TEXT,
                    <br />
                    &nbsp;&nbsp;created_at TIMESTAMPTZ DEFAULT NOW()
                    <br />
                  );
                </code>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!error && !loading && clients.length === 0 && (
        <Alert>
          <CheckCircle size={16} weight="bold" />
          <AlertDescription>
            La connexion à la table 'clients' fonctionne, mais aucune donnée n'a été trouvée.
          </AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {!loading && !error && clients.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Intérêts</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      {client.phone ? `${client.country_code || ''} ${client.phone}` : '-'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {client.address || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.interests?.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(client.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              {clients.length} client{clients.length > 1 ? 's' : ''} trouvé{clients.length > 1 ? 's' : ''}
            </p>
          </div>
        </Card>
      )}

      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Console Output</h4>
        <p className="text-xs text-muted-foreground">
          Ouvrez la console du navigateur (F12) pour voir les données complètes retournées par Supabase.
        </p>
        <code className="block mt-2 p-2 bg-black/10 rounded text-xs">
          const &#123; data, error &#125; = await supabase.from('clients').select('*')
        </code>
      </div>
    </div>
  )
}
