'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { ImageUpload } from '@/components/ui/image-upload'
import { Plus, Search, Edit, Trash2, Grid3x3, Grid2x2, LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Destination = Database['public']['Tables']['destinations']['Row']
type Country = Database['public']['Tables']['countries']['Row']

// Type for destination with joined country
type DestinationWithCountry = Destination & {
  countries?: Country | Country[] | null
}

export default function DestinationsPage() {
  const { user } = useAuthStore()
  const [destinations, setDestinations] = useState<DestinationWithCountry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDestination, setEditingDestination] = useState<DestinationWithCountry | null>(null)
  const [newDestination, setNewDestination] = useState({ name: '', country_id: '', description: '', image_url: '' })
  const [saving, setSaving] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [gridCols, setGridCols] = useState<3 | 4 | 5>(3)

  useEffect(() => {
    loadDestinations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDestinations = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from('destinations')
        .select('*, countries(*)')
        .order('name', { ascending: true })

      if (user?.agency_id) {
        query = query.eq('agency_id', user.agency_id)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('Database table may not exist yet:', error.message)
          toast.error('טבלת היעדים לא קיימת. אנא צור את הטבלאות ב-Supabase.')
        } else {
          throw error
        }
      }
      setDestinations((data as DestinationWithCountry[]) || [])
    } catch (error: any) {
      console.error('Error loading destinations:', error)
      toast.error(error.message || 'שגיאה בטעינת יעדים')
    } finally {
      setLoading(false)
    }
  }

  const loadCountries = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from('countries').select('*').order('name')
      setCountries(data || [])
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  useEffect(() => {
    if (showModal) {
      loadCountries()
    }
  }, [showModal])

  const handleSaveDestination = async () => {
    if (!newDestination.name.trim()) {
      toast.error('אנא הזן שם יעד')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      
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

      if (editingDestination) {
        // Update existing destination
        const { data, error } = await supabase
          .from('destinations')
          .update({
            name: newDestination.name,
            country_id: newDestination.country_id || null,
            description: newDestination.description || null,
            image_url: newDestination.image_url || null,
          })
          .eq('id', editingDestination.id)
          .select()
          .single()
        
        if (error) throw error
      } else {
        // Create new destination
        const { data, error } = await supabase
          .from('destinations')
          .insert({
            agency_id: currentUser.agency_id,
            name: newDestination.name,
            country_id: newDestination.country_id || null,
            description: newDestination.description || null,
            image_url: newDestination.image_url || null,
            highlights: [],
            gallery: [],
            is_active: true,
            sort_order: 0,
          })
          .select()
          .single()
        
        if (error) throw error
      }

      toast.success(editingDestination ? 'יעד עודכן בהצלחה!' : 'יעד נוצר בהצלחה!')
      setShowModal(false)
      setEditingDestination(null)
      setNewDestination({ name: '', country_id: '', description: '', image_url: '' })
      loadDestinations()
    } catch (error: any) {
      console.error('Error saving destination:', error)
      if (error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        toast.error('טבלת היעדים לא קיימת. אנא צור את הטבלאות ב-Supabase.')
      } else {
        toast.error(error.message || (editingDestination ? 'שגיאה בעדכון יעד' : 'שגיאה ביצירת יעד'))
      }
    } finally {
      setSaving(false)
    }
  }

  const handleEditDestination = (destination: DestinationWithCountry) => {
    setEditingDestination(destination)
    setNewDestination({
      name: destination.name,
      country_id: destination.country_id || '',
      description: destination.description || '',
      image_url: destination.image_url || '',
    })
    setShowModal(true)
  }

  const handleDeleteDestination = async (destination: DestinationWithCountry) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את ${destination.name}?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('destinations').delete().eq('id', destination.id)
      
      if (error) throw error
      toast.success('יעד נמחק בהצלחה!')
      loadDestinations()
    } catch (error: any) {
      toast.error(error.message || 'שגיאה במחיקת יעד')
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
          <h1 className="text-3xl font-bold">יעדים</h1>
          <p className="text-gray-500 mt-2">נהל את כל היעדים שלך</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={gridCols === 3 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setGridCols(3)}
              className="h-8 w-8 p-0"
              title="3 עמודות"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={gridCols === 4 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setGridCols(4)}
              className="h-8 w-8 p-0"
              title="4 עמודות"
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={gridCols === 5 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setGridCols(5)}
              className="h-8 w-8 p-0"
              title="5 עמודות"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="ml-2 h-4 w-4" />
            יעד חדש
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingDestination(null)
          setNewDestination({ name: '', country_id: '', description: '', image_url: '' })
        }}
        title={editingDestination ? 'ערוך יעד' : 'יעד חדש'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">שם יעד *</label>
            <Input
              value={newDestination.name}
              onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
              placeholder="תל אביב"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">מדינה</label>
            <select
              value={newDestination.country_id}
              onChange={(e) => setNewDestination({ ...newDestination, country_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">בחר מדינה</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">תיאור</label>
            <Input
              value={newDestination.description}
              onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
              placeholder="תיאור היעד"
            />
          </div>
          <ImageUpload
            currentImage={newDestination.image_url}
            onUpload={(url) => setNewDestination({ ...newDestination, image_url: url })}
            onRemove={() => setNewDestination({ ...newDestination, image_url: '' })}
            bucket="destination-images"
            path={`destination-${Date.now()}`}
            label="תמונת יעד"
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveDestination} disabled={saving} className="flex-1">
              {saving ? (editingDestination ? 'מעדכן...' : 'יוצר...') : (editingDestination ? 'עדכן יעד' : 'צור יעד')}
            </Button>
            <Button variant="ghost" onClick={() => {
              setShowModal(false)
              setEditingDestination(null)
              setNewDestination({ name: '', country_id: '', description: '', image_url: '' })
            }} disabled={saving}>
              ביטול
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="חיפוש יעדים..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              loadDestinations()
            }}
            className="pr-10"
          />
        </div>
      </div>

      {destinations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">אין יעדים עדיין</p>
            <Button onClick={() => setShowModal(true)}>צור יעד ראשון</Button>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-4 ${
          gridCols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
          gridCols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
          'md:grid-cols-3 lg:grid-cols-5'
        }`}>
          {destinations.map((destination) => (
            <Card key={destination.id} className="hover:shadow-md transition-shadow overflow-hidden relative">
              {destination.image_url ? (
                <div className="relative w-full h-48">
                  <Image
                    src={destination.image_url}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <span className="text-6xl">🏖️</span>
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditDestination(destination)}
                  className="bg-white/90 hover:bg-white shadow-md"
                  title="ערוך"
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDestination(destination)}
                  className="bg-white/90 hover:bg-white shadow-md"
                  title="מחק"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              <CardHeader>
                <CardTitle>{destination.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {destination.countries && (
                  <p className="text-sm text-gray-500">
                    מדינה: {Array.isArray(destination.countries) 
                      ? destination.countries[0]?.name 
                      : destination.countries?.name}
                  </p>
                )}
                {destination.description && (
                  <p className="text-sm text-gray-600 mt-2">{destination.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
