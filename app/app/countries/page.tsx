'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { ImageUpload } from '@/components/ui/image-upload'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Country = Database['public']['Tables']['countries']['Row']

export default function CountriesPage() {
  const { user, agency } = useAuthStore()
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [newCountry, setNewCountry] = useState({ name: '', name_en: '', code: '', currency: agency?.default_currency || 'ILS', image_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCountries = async () => {
    try {
      const supabase = createClient()
      
      // Get user from session if not in store
      let currentUser = user
      if (!currentUser) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: userDataArray } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (userDataArray) {
            currentUser = userDataArray
          }
        }
      }
      
      let query = supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true })
      
      if (currentUser?.agency_id) {
        query = query.eq('agency_id', currentUser.agency_id)
      }
      
      const { data, error } = await query

      if (error) {
        // Handle missing table gracefully
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('Database table may not exist yet:', error.message)
          toast.error('טבלת המדינות לא קיימת. אנא צור את הטבלאות ב-Supabase.')
        } else {
          throw error
        }
      }
      setCountries(data || [])
    } catch (error: any) {
      console.error('Error loading countries:', error)
      toast.error(error.message || 'שגיאה בטעינת מדינות')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCountry = async () => {
    if (!newCountry.name.trim()) {
      toast.error('אנא הזן שם מדינה')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      
      // Get user from session if not in store
      let currentUser = user
      if (!currentUser) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: userDataArray } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (userDataArray) {
            currentUser = userDataArray
          }
        }
      }
      
      if (!currentUser?.agency_id) {
        throw new Error('לא נמצא agency_id')
      }

      if (editingCountry) {
        // Update existing country
        const { data, error } = await supabase
          .from('countries')
          .update({
            name: newCountry.name,
            name_en: newCountry.name_en || null,
            code: newCountry.code || null,
            currency: newCountry.currency,
            image_url: newCountry.image_url || null,
          })
          .eq('id', editingCountry.id)
          .select()
          .single()
        
        if (error) throw error
      } else {
        // Create new country
        const { data, error } = await supabase
          .from('countries')
          .insert({
            agency_id: currentUser.agency_id,
            name: newCountry.name,
            name_en: newCountry.name_en || null,
            code: newCountry.code || null,
            currency: newCountry.currency,
            image_url: newCountry.image_url || null,
          })
          .select()
          .single()
        
        if (error) throw error
      }

      toast.success(editingCountry ? 'מדינה עודכנה בהצלחה!' : 'מדינה נוצרה בהצלחה!')
      setShowModal(false)
      setEditingCountry(null)
      setNewCountry({ name: '', name_en: '', code: '', currency: agency?.default_currency || 'ILS', image_url: '' })
      loadCountries()
    } catch (error: any) {
      console.error('Error saving country:', error)
      if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        toast.error('טבלת המדינות לא קיימת. אנא צור את הטבלאות ב-Supabase.')
      } else {
        toast.error(error.message || (editingCountry ? 'שגיאה בעדכון מדינה' : 'שגיאה ביצירת מדינה'))
      }
    } finally {
      setSaving(false)
    }
  }

  const handleEditCountry = (country: Country) => {
    setEditingCountry(country)
    setNewCountry({
      name: country.name,
      name_en: country.name_en || '',
      code: country.code || '',
      currency: country.currency || agency?.default_currency || 'ILS',
      image_url: country.image_url || '',
    })
    setShowModal(true)
  }

  const handleDeleteCountry = async (country: Country) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את ${country.name}?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('countries').delete().eq('id', country.id)
      
      if (error) throw error
      toast.success('מדינה נמחקה בהצלחה!')
      loadCountries()
    } catch (error: any) {
      toast.error(error.message || 'שגיאה במחיקת מדינה')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">טוען...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">מדינות</h1>
          <p className="text-gray-500 mt-2">נהל את המדינות שלך</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="ml-2 h-4 w-4" />
          מדינה חדשה
        </Button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingCountry(null)
          setNewCountry({ name: '', name_en: '', code: '', currency: agency?.default_currency || 'ILS', image_url: '' })
        }}
        title={editingCountry ? 'ערוך מדינה' : 'מדינה חדשה'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">שם מדינה *</label>
            <Input
              value={newCountry.name}
              onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              placeholder="ישראל"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">שם באנגלית</label>
            <Input
              value={newCountry.name_en}
              onChange={(e) => setNewCountry({ ...newCountry, name_en: e.target.value })}
              placeholder="Israel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">קוד</label>
            <Input
              value={newCountry.code}
              onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })}
              placeholder="IL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">מטבע</label>
            <Input
              value={newCountry.currency}
              onChange={(e) => setNewCountry({ ...newCountry, currency: e.target.value })}
              placeholder="ILS"
            />
          </div>
          <ImageUpload
            currentImage={newCountry.image_url}
            onUpload={(url) => setNewCountry({ ...newCountry, image_url: url })}
            onRemove={() => setNewCountry({ ...newCountry, image_url: '' })}
            bucket="destination-images"
            path={`country-${Date.now()}`}
            label="תמונת מדינה"
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveCountry} disabled={saving} className="flex-1">
              {saving ? (editingCountry ? 'מעדכן...' : 'יוצר...') : (editingCountry ? 'עדכן מדינה' : 'צור מדינה')}
            </Button>
            <Button variant="ghost" onClick={() => {
              setShowModal(false)
              setEditingCountry(null)
              setNewCountry({ name: '', name_en: '', code: '', currency: agency?.default_currency || 'ILS', image_url: '' })
            }} disabled={saving}>
              ביטול
            </Button>
          </div>
        </div>
      </Modal>

      {countries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין מדינות עדיין</p>
            <Button onClick={() => setShowModal(true)}>צור מדינה ראשונה</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <Card key={country.id} className="overflow-hidden hover:shadow-md transition-shadow relative">
              {country.image_url ? (
                <div className="relative w-full h-48">
                  <Image
                    src={country.image_url}
                    alt={country.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-6xl">🌍</span>
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditCountry(country)}
                  className="bg-white/90 hover:bg-white shadow-md"
                  title="ערוך"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCountry(country)}
                  className="bg-white/90 hover:bg-white shadow-md"
                  title="מחק"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{country.name}</h3>
                {country.name_en && (
                  <p className="text-gray-600 mb-2">{country.name_en}</p>
                )}
                <p className="text-sm text-gray-500">קוד: {country.code}</p>
                <p className="text-sm text-gray-500">מטבע: {country.currency}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
