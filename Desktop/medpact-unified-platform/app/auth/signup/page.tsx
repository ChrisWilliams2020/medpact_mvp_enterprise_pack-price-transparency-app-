'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Fingerprint, Eye, EyeOff } from 'lucide-react'

type IndustryVertical = 'MEDICAL' | 'PHARMA' | 'MEDTECH' | 'DIAGNOSTICS'
type UserRoleType = 'OWNER' | 'C_SUITE' | 'PRACTICE_MANAGER' | 'STAFF'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    industryVertical: '' as IndustryVertical,
    role: '' as UserRoleType,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [biometricSupported, setBiometricSupported] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)

  // Check for biometric support on mount
  useState(() => {
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setBiometricSupported(available))
        .catch(() => setBiometricSupported(false))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (!formData.industryVertical || !formData.role) {
      setError('Please select industry vertical and role')
      setLoading(false)
      return
    }

    try {
      // Create account
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          biometricEnabled,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // If biometric enabled, register credential
      if (biometricEnabled && biometricSupported) {
        await registerBiometric(data.userId)
      }

      // Redirect to sign in
      router.push('/auth/signin?registered=true')
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const registerBiometric = async (userId: string) => {
    try {
      // Get challenge from server
      const challengeResponse = await fetch('/api/auth/biometric/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type: 'registration' }),
      })

      const { challenge, userId: serverUserId } = await challengeResponse.json()

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
          rp: {
            name: 'MedPact Platform',
            id: window.location.hostname,
          },
          user: {
            id: Uint8Array.from(String(serverUserId), c => c.charCodeAt(0)),
            name: formData.email,
            displayName: formData.name,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'none',
        },
      }) as PublicKeyCredential

      // Send credential to server
      const credentialData = {
        id: credential.id,
        rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        response: {
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array((credential.response as any).clientDataJSON))),
          attestationObject: btoa(String.fromCharCode(...new Uint8Array((credential.response as any).attestationObject))),
        },
        type: credential.type,
      }

      await fetch('/api/auth/biometric/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, credential: credentialData }),
      })
    } catch (err) {
      console.error('Biometric registration failed:', err)
      // Non-fatal - user can still use password
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join MedPact Platform
          </h1>
          <p className="text-gray-600">
            Enterprise Survey & Intelligence Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                placeholder="john@company.com"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div>
            <Label htmlFor="organizationName">Organization Name</Label>
            <input
              id="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
              placeholder="ABC Medical Group"
            />
          </div>

          {/* Industry & Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industryVertical">Industry Vertical</Label>
              <Select
                value={formData.industryVertical}
                onValueChange={(value) => setFormData({ ...formData, industryVertical: value as IndustryVertical })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEDICAL">Medical Practices</SelectItem>
                  <SelectItem value="PHARMA">Pharmaceutical</SelectItem>
                  <SelectItem value="MEDTECH">Medical Technology</SelectItem>
                  <SelectItem value="DIAGNOSTICS">Diagnostics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role">Your Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRoleType })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="C_SUITE">C-Suite Executive</SelectItem>
                  <SelectItem value="PRACTICE_MANAGER">Practice Manager</SelectItem>
                  <SelectItem value="STAFF">Staff Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Biometric Authentication */}
          {biometricSupported && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Fingerprint className="text-blue-600 mt-0.5" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Enable Biometric Authentication
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Use Face ID, Touch ID, or Windows Hello for secure, password-free login
                  </p>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={biometricEnabled}
                      onChange={(e) => setBiometricEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-blue-900">
                      Enable biometric login for this device
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign In
          </a>
        </p>
      </Card>
    </div>
  )
}
