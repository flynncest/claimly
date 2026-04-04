import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import type { ScanData, AnalysisResult } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { scanData, result, email }: {
      scanData: ScanData
      result: AnalysisResult
      email: string
    } = await req.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('scan_results')
      .insert({
        user_id: user?.id ?? null,
        email: email || null,
        country: scanData.country ?? '',
        scan_data: scanData,
        result,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('save-report error:', err)
    const message = err instanceof Error ? err.message : 'Failed to save report'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
