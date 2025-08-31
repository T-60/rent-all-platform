"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ScheduleDeliveryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (dateTime: string) => void
  productTitle: string
  type: 'delivery' | 'return'
}

export function ScheduleDeliveryModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productTitle, 
  type 
}: ScheduleDeliveryModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedHour, setSelectedHour] = useState<string>("")
  const [selectedMinute, setSelectedMinute] = useState<string>("")

  const isDelivery = type === 'delivery'
  const title = isDelivery ? 'Programar Entrega' : 'Programar Devolución'
  const actionText = isDelivery ? 'entrega' : 'devolución'

  // Generar opciones de horas (8 AM a 8 PM)
  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8
    return {
      value: hour.toString().padStart(2, '0'),
      label: `${hour}:00`
    }
  })

  // Generar opciones de minutos (cada 15 minutos)
  const minutes = [
    { value: "00", label: "00" },
    { value: "15", label: "15" },
    { value: "30", label: "30" },
    { value: "45", label: "45" }
  ]

  const handleConfirm = () => {
    if (!selectedDate || !selectedHour || !selectedMinute) {
      alert("Por favor selecciona fecha y hora completas")
      return
    }

    // Crear la fecha y hora completa
    const dateTime = new Date(selectedDate)
    dateTime.setHours(parseInt(selectedHour), parseInt(selectedMinute), 0, 0)
    
    // Formatear para enviar al backend
    const formattedDateTime = dateTime.toISOString()
    
    onConfirm(formattedDateTime)
    handleClose()
  }

  const handleClose = () => {
    setSelectedDate(undefined)
    setSelectedHour("")
    setSelectedMinute("")
    onClose()
  }

  // No permitir fechas pasadas
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDelivery ? (
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            ) : (
              <CalendarIcon className="h-5 w-5 text-purple-600" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>
            Selecciona la fecha y hora para la {actionText} de <strong>"{productTitle}"</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Selector de Fecha */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">📅 Fecha</Label>
            <div className="border rounded-lg p-3 bg-gray-50">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < today}
                locale={es}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Selector de Hora */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Hora
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Hora</Label>
                <Select value={selectedHour} onValueChange={setSelectedHour}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Minutos</Label>
                <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Minutos" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute.value} value={minute.value}>
                        {minute.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Vista previa de la fecha seleccionada */}
          {selectedDate && selectedHour && selectedMinute && (
            <div className={`p-3 rounded-lg border-l-4 ${
              isDelivery 
                ? 'bg-blue-50 border-blue-400' 
                : 'bg-purple-50 border-purple-400'
            }`}>
              <div className="flex items-center gap-2">
                <CalendarIcon className={`h-4 w-4 ${
                  isDelivery ? 'text-blue-600' : 'text-purple-600'
                }`} />
                <span className="font-medium text-sm">
                  {actionText.charAt(0).toUpperCase() + actionText.slice(1)} programada para:
                </span>
              </div>
              <p className={`text-lg font-semibold mt-1 ${
                isDelivery ? 'text-blue-700' : 'text-purple-700'
              }`}>
                {format(
                  new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 
                          parseInt(selectedHour), parseInt(selectedMinute)), 
                  "EEEE, dd 'de' MMMM 'de' yyyy 'a las' HH:mm", 
                  { locale: es }
                )}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedHour || !selectedMinute}
            className={isDelivery 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-purple-600 hover:bg-purple-700"
            }
          >
            {isDelivery ? "📅 Programar Entrega" : "📅 Programar Devolución"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
