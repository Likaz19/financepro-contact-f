import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type FormData = {
  name: string
  email: string
  phone: string
  interests: string[]
  services: string[]
  modules: string[]
  message: string
}

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    interests: [],
    services: [],
    modules: [],
    message: "",
  })

  const totalSteps = 4
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const toggleModule = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter((m) => m !== module)
        : [...prev.modules, module],
    }))
  }

  const showConsulting = formData.interests.includes("Consulting")
  const showFormation = formData.interests.includes("Formation")

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-12 text-center"
          >
            <div className="checkmark-circle w-24 h-24 rounded-full border-[5px] border-primary flex items-center justify-center mx-auto mb-6">
              <CheckCircle
                className="checkmark-icon text-primary"
                size={52}
                weight="bold"
              />
            </div>
            <h2 className="text-3xl font-semibold text-primary mb-3">
              Message envoyé !
            </h2>
            <p className="text-lg text-foreground">
              Merci pour votre confiance. Notre équipe vous contactera
              rapidement.
            </p>
          </motion.div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-center text-primary mb-2">
            Contactez FinancePro
          </h2>
          <p className="text-center text-foreground mb-8">
            Consulting • Formation • Accompagnement professionnel
          </p>

          <Progress value={progress} className="mb-8 h-2.5" />

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold">
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="76 464 42 90"
                      className="mt-2"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    size="lg"
                    className="w-full mt-6 text-lg"
                  >
                    Suivant
                  </Button>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label className="text-base font-semibold">
                      Votre intérêt
                    </Label>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="consulting"
                          checked={formData.interests.includes("Consulting")}
                          onCheckedChange={() => toggleInterest("Consulting")}
                        />
                        <label
                          htmlFor="consulting"
                          className="text-base cursor-pointer select-none"
                        >
                          Consulting
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="formation"
                          checked={formData.interests.includes("Formation")}
                          onCheckedChange={() => toggleInterest("Formation")}
                        />
                        <label
                          htmlFor="formation"
                          className="text-base cursor-pointer select-none"
                        >
                          Formation
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="lg"
                      className="w-full text-lg"
                    >
                      Suivant
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {showConsulting && (
                    <div>
                      <Label className="text-base font-semibold">
                        Services Consulting
                      </Label>
                      <div className="space-y-3 mt-3">
                        {[
                          "Audit financier",
                          "Conseil stratégique",
                          "Optimisation fiscale",
                          "Gestion de trésorerie",
                        ].map((service) => (
                          <div
                            key={service}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={service}
                              checked={formData.services.includes(service)}
                              onCheckedChange={() => toggleService(service)}
                            />
                            <label
                              htmlFor={service}
                              className="text-base cursor-pointer select-none"
                            >
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showFormation && (
                    <div>
                      <Label className="text-base font-semibold">
                        Modules Formation
                      </Label>
                      <div className="space-y-3 mt-3">
                        {[
                          "Comptabilité fondamentale",
                          "Analyse financière",
                          "Gestion financière",
                          "Stratégie & reporting",
                        ].map((module) => (
                          <div
                            key={module}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={module}
                              checked={formData.modules.includes(module)}
                              onCheckedChange={() => toggleModule(module)}
                            />
                            <label
                              htmlFor={module}
                              className="text-base cursor-pointer select-none"
                            >
                              {module}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!showConsulting && !showFormation && (
                    <div className="text-center py-8 text-muted-foreground">
                      Veuillez sélectionner au moins un intérêt dans l'étape
                      précédente.
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="lg"
                      className="w-full text-lg"
                    >
                      Suivant
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-base font-semibold"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      className="mt-2"
                      placeholder="Décrivez brièvement vos besoins..."
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-lg"
                    >
                      Envoyer
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Retour
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default App