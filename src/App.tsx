import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Warning, PencilSimple, UploadSimple, FilePdf, FileDoc, FileImage, File as FileIcon, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Toaster, toast } from "sonner"
import { Footer } from "@/components/Footer"
import { FloatingContactButton } from "@/components/FloatingContactButton"

type FormData = {
  name: string
  email: string
  phone: string
  interests: string[]
  services: string[]
  modules: string[]
  message: string
  attachments: File[]
}

type ValidationErrors = {
  name?: string
  email?: string
  phone?: string
  message?: string
  interests?: string
  attachments?: string
}

type SubmissionState = "idle" | "submitting" | "success" | "error"

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [apiError, setApiError] = useState<string>("")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    interests: [],
    services: [],
    modules: [],
    message: "",
    attachments: [],
  })

  const totalSteps = 6
  const progress = ((currentStep + 1) / totalSteps) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {}

    if (step === 0) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        newErrors.name = "Le nom doit contenir au moins 2 caractères"
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        newErrors.email = "Veuillez entrer une adresse email valide"
      }

      if (formData.phone.trim()) {
        const phoneDigits = formData.phone.replace(/\D/g, "")
        if (phoneDigits.length < 8 || phoneDigits.length > 15) {
          newErrors.phone = "Le téléphone doit contenir entre 8 et 15 chiffres"
        }
      }
    }

    if (step === 1) {
      if (formData.interests.length === 0) {
        newErrors.interests = "Veuillez sélectionner au moins un intérêt"
      }
    }

    if (step === 3) {
      if (formData.message.trim() && formData.message.trim().length < 10) {
        newErrors.message = "Le message doit contenir au moins 10 caractères"
      }
      if (formData.message.trim().length > 1000) {
        newErrors.message = "Le message ne peut pas dépasser 1000 caractères"
      }
    }

    if (step === 4) {
      if (formData.attachments.length > 5) {
        newErrors.attachments = "Vous ne pouvez joindre que 5 fichiers maximum"
      }
      const maxSize = 10 * 1024 * 1024
      const hasOversizedFile = formData.attachments.some(file => file.size > maxSize)
      if (hasOversizedFile) {
        newErrors.attachments = "Chaque fichier ne doit pas dépasser 10 Mo"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({})
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrev = () => {
    setErrors({})
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    setSubmissionState("submitting")
    setApiError("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("interests", JSON.stringify(formData.interests))
      formDataToSend.append("services", JSON.stringify(formData.services))
      formDataToSend.append("modules", JSON.stringify(formData.modules))
      formDataToSend.append("message", formData.message)
      
      formData.attachments.forEach((file, index) => {
        formDataToSend.append(`attachment_${index}`, file)
      })

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Formulaire soumis avec succès:", result)
      
      setSubmissionState("success")
      toast.success("Message envoyé avec succès!")
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      setSubmissionState("error")
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      
      setApiError(errorMessage)
      toast.error(errorMessage)
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const currentFiles = formData.attachments
    const totalFiles = currentFiles.length + newFiles.length

    if (totalFiles > 5) {
      toast.error("Vous ne pouvez joindre que 5 fichiers maximum")
      return
    }

    const maxSize = 10 * 1024 * 1024
    const oversizedFiles = newFiles.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      toast.error("Chaque fichier ne doit pas dépasser 10 Mo")
      return
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }))
    
    if (errors.attachments) {
      setErrors({ ...errors, attachments: undefined })
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FilePdf size={24} weight="fill" className="text-destructive" />
      case 'doc':
      case 'docx':
        return <FileDoc size={24} weight="fill" className="text-primary" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage size={24} weight="fill" className="text-accent-foreground" />
      default:
        return <FileIcon size={24} weight="fill" className="text-muted-foreground" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const showConsulting = formData.interests.includes("Consulting")
  const showFormation = formData.interests.includes("Formation")

  if (submissionState === "success") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-background p-4">
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
        <Footer />
        <FloatingContactButton />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <Toaster position="top-center" richColors />
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
                      Nom complet <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        updateField("name", e.target.value)
                        if (errors.name) setErrors({ ...errors, name: undefined })
                      }}
                      className={`mt-2 ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        updateField("email", e.target.value)
                        if (errors.email) setErrors({ ...errors, email: undefined })
                      }}
                      className={`mt-2 ${errors.email ? "border-destructive" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        updateField("phone", e.target.value)
                        if (errors.phone) setErrors({ ...errors, phone: undefined })
                      }}
                      placeholder="76 464 42 90"
                      className={`mt-2 ${errors.phone ? "border-destructive" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                    )}
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
                      Votre intérêt <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="consulting"
                          checked={formData.interests.includes("Consulting")}
                          onCheckedChange={() => {
                            toggleInterest("Consulting")
                            if (errors.interests) setErrors({ ...errors, interests: undefined })
                          }}
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
                          onCheckedChange={() => {
                            toggleInterest("Formation")
                            if (errors.interests) setErrors({ ...errors, interests: undefined })
                          }}
                        />
                        <label
                          htmlFor="formation"
                          className="text-base cursor-pointer select-none"
                        >
                          Formation
                        </label>
                      </div>
                    </div>
                    {errors.interests && (
                      <p className="text-destructive text-sm mt-2">{errors.interests}</p>
                    )}
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
                      Message (optionnel)
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        updateField("message", e.target.value)
                        if (errors.message) setErrors({ ...errors, message: undefined })
                      }}
                      className={`mt-2 ${errors.message ? "border-destructive" : ""}`}
                      placeholder="Décrivez brièvement vos besoins... (10-1000 caractères)"
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message ? (
                        <p className="text-destructive text-sm">{errors.message}</p>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          {formData.message.length}/1000 caractères
                        </p>
                      )}
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

              {currentStep === 4 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <Label className="text-base font-semibold">
                      Joindre des fichiers (optionnel)
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Vous pouvez joindre jusqu'à 5 fichiers (max. 10 Mo chacun)
                    </p>
                    
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.xls"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <UploadSimple size={32} weight="bold" className="text-primary" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            Cliquez pour sélectionner des fichiers
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PDF, Word, Images, etc.
                          </p>
                        </div>
                      </label>
                    </div>

                    {errors.attachments && (
                      <p className="text-destructive text-sm mt-2">{errors.attachments}</p>
                    )}

                    {formData.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          Fichiers joints ({formData.attachments.length}/5)
                        </p>
                        {formData.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-muted rounded-lg group hover:bg-muted/80 transition-colors"
                          >
                            <div className="flex-shrink-0">
                              {getFileIcon(file.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="flex-shrink-0 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash size={18} weight="bold" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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

              {currentStep === 5 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">
                      Récapitulatif de votre demande
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Vérifiez vos informations avant l'envoi
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">Informations de contact</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStep(0)}
                          className="h-8 gap-1"
                        >
                          <PencilSimple size={16} />
                          Modifier
                        </Button>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Nom:</span> {formData.name}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        {formData.phone && <p><span className="font-medium">Téléphone:</span> {formData.phone}</p>}
                      </div>
                    </div>

                    <div className="border-l-4 border-secondary pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">Intérêts</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStep(1)}
                          className="h-8 gap-1"
                        >
                          <PencilSimple size={16} />
                          Modifier
                        </Button>
                      </div>
                      <div className="text-sm">
                        <p>{formData.interests.join(", ")}</p>
                      </div>
                    </div>

                    {(formData.services.length > 0 || formData.modules.length > 0) && (
                      <div className="border-l-4 border-accent pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Services sélectionnés</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(2)}
                            className="h-8 gap-1"
                          >
                            <PencilSimple size={16} />
                            Modifier
                          </Button>
                        </div>
                        <div className="text-sm space-y-1">
                          {formData.services.length > 0 && (
                            <p><span className="font-medium">Consulting:</span> {formData.services.join(", ")}</p>
                          )}
                          {formData.modules.length > 0 && (
                            <p><span className="font-medium">Formation:</span> {formData.modules.join(", ")}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {formData.message && (
                      <div className="border-l-4 border-muted pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Message</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(3)}
                            className="h-8 gap-1"
                          >
                            <PencilSimple size={16} />
                            Modifier
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{formData.message}</p>
                      </div>
                    )}

                    {formData.attachments.length > 0 && (
                      <div className="border-l-4 border-secondary pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Fichiers joints</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(4)}
                            className="h-8 gap-1"
                          >
                            <PencilSimple size={16} />
                            Modifier
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="flex-shrink-0">
                                {getFileIcon(file.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {apiError && (
                    <Alert variant="destructive">
                      <Warning className="h-4 w-4" />
                      <AlertDescription>{apiError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-lg"
                      disabled={submissionState === "submitting"}
                    >
                      {submissionState === "submitting" ? "Envoi en cours..." : "Confirmer et envoyer"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={submissionState === "submitting"}
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
      <Footer />
      <FloatingContactButton />
    </div>
  )
}

export default App