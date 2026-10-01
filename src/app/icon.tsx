import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const size = {
  width: 64,
  height: 64,
}

export const contentType = 'image/png'

export default async function Icon() {
  const instrumentSerif = await readFile(
    join(process.cwd(), 'src/app/fonts/InstrumentSerif-Regular.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          borderRadius: 12,
          color: 'white',
          fontSize: 40,
          fontFamily: 'Instrument Serif',
        }}
      >
        TR
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: instrumentSerif, style: 'normal', weight: 400 },
      ],
    }
  )
}
