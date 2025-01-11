import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcryptjs from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    console.log('Received password attempt for:', password)

    const hashedPassword = process.env.ADMIN_PASSWORD_HASH
    console.log('Raw stored hash:', hashedPassword)

    if (!hashedPassword) {
      console.error('No password hash found in environment variables')
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Clean and validate the hash format
    const cleanHash = hashedPassword
      .trim()
      .replace(/\\\$/g, '$') // Replace escaped $ with actual $
    console.log('Cleaned hash:', cleanHash)

    // Validate bcrypt hash format ($2a$10$...)
    if (!cleanHash.match(/^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/)) {
      console.error('Invalid bcrypt hash format')
      return NextResponse.json(
        { message: 'Server configuration error - invalid hash format' },
        { status: 500 }
      )
    }

    console.log('Hash format validation passed')
    console.log('Attempting password validation...')
    
    try {
      const isValid = await bcryptjs.compare(password, cleanHash)
      console.log('Password validation result:', isValid)

      if (!isValid) {
        return NextResponse.json(
          { message: 'Invalid password' },
          { status: 401 }
        )
      }

      // Set the auth cookie
      cookies().set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24
      })

      return NextResponse.json({ message: 'Logged in successfully' })
    } catch (bcryptError) {
      console.error('Bcrypt comparison error:', bcryptError)
      return NextResponse.json(
        { message: 'Error validating password' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    )
  }
} 