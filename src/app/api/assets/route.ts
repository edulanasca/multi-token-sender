import { NextResponse } from 'next/server'
import { helius } from '@/utils/helius'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const owner = searchParams.get('owner')
  const page = searchParams.get('page')

  if (!owner) {
    return NextResponse.json({ error: 'Owner address is required' }, { status: 400 })
  }

  try {
    const assets = await helius.rpc.getAssetsByOwner({
      ownerAddress: owner,
      page: page ? parseInt(page) : 1,
      displayOptions: {
        showZeroBalance: false,
        showUnverifiedCollections: false,
        showFungible: true
      }
    })

    return NextResponse.json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
  }
}