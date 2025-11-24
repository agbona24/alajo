/**
 * Biometric Authentication using Web Authentication API (WebAuthn)
 * Works on modern browsers, PWAs, and can be extended with Capacitor for native apps
 */

// Storage keys
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'
const BIOMETRIC_CREDENTIAL_KEY = 'biometric_credential_id'
const BIOMETRIC_USER_KEY = 'biometric_user'

interface BiometricUser {
  id: string
  phone: string
  name: string
}

/**
 * Check if the device supports biometric authentication
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  // Check if WebAuthn is available
  if (!window.PublicKeyCredential) {
    console.log('WebAuthn not supported')
    return false
  }

  try {
    // Check if platform authenticator (biometric) is available
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    console.log('Platform authenticator available:', available)
    return available
  } catch (error) {
    console.error('Error checking biometric availability:', error)
    return false
  }
}

/**
 * Check if biometric login is enabled for this device
 */
export const isBiometricEnabled = (): boolean => {
  return localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true'
}

/**
 * Get the stored biometric user info
 */
export const getBiometricUser = (): BiometricUser | null => {
  const userStr = localStorage.getItem(BIOMETRIC_USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Generate a random challenge for WebAuthn
 */
const generateChallenge = (): Uint8Array => {
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return array
}

/**
 * Convert ArrayBuffer to base64 string
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

/**
 * Convert base64 string to ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Enroll biometric authentication for the current user
 */
export const enrollBiometric = async (user: { id: number; phone: string; name: string }): Promise<boolean> => {
  if (!(await isBiometricAvailable())) {
    throw new Error('Biometric authentication is not available on this device')
  }

  try {
    const challenge = generateChallenge()
    const userId = new TextEncoder().encode(user.id.toString())

    // Create credential options
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: challenge as BufferSource,
      rp: {
        name: 'Alajo - Digital Savings',
        id: window.location.hostname,
      },
      user: {
        id: userId as BufferSource,
        name: user.phone,
        displayName: user.name,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Use device biometrics
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    }

    // Create the credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential

    if (!credential) {
      throw new Error('Failed to create credential')
    }

    // Store credential ID and user info
    const credentialId = arrayBufferToBase64(credential.rawId)
    localStorage.setItem(BIOMETRIC_CREDENTIAL_KEY, credentialId)
    localStorage.setItem(BIOMETRIC_USER_KEY, JSON.stringify({
      id: user.id.toString(),
      phone: user.phone,
      name: user.name,
    }))
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true')

    console.log('Biometric enrollment successful')
    return true
  } catch (error: any) {
    console.error('Biometric enrollment failed:', error)

    // Handle specific errors
    if (error.name === 'NotAllowedError') {
      throw new Error('Biometric authentication was cancelled or denied')
    } else if (error.name === 'InvalidStateError') {
      throw new Error('A credential already exists for this account')
    }

    throw new Error('Failed to set up biometric authentication')
  }
}

interface BiometricAuthResult {
  success: boolean
  user?: BiometricUser
  credentialId?: string
  error?: string
}

/**
 * Authenticate using biometric
 * Returns a result object with user info and credential ID if successful
 */
export const authenticateWithBiometric = async (): Promise<BiometricAuthResult> => {
  if (!isBiometricEnabled()) {
    return { success: false, error: 'Biometric login is not enabled' }
  }

  const credentialIdBase64 = localStorage.getItem(BIOMETRIC_CREDENTIAL_KEY)
  if (!credentialIdBase64) {
    return { success: false, error: 'No biometric credential found' }
  }

  try {
    const challenge = generateChallenge()
    const credentialId = base64ToArrayBuffer(credentialIdBase64)

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challenge as BufferSource,
      allowCredentials: [{
        id: credentialId as BufferSource,
        type: 'public-key',
        transports: ['internal'],
      }],
      userVerification: 'required',
      timeout: 60000,
    }

    // Request authentication
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential

    if (!assertion) {
      return { success: false, error: 'Authentication failed' }
    }

    // Verify the credential ID matches
    const assertionCredentialId = arrayBufferToBase64(assertion.rawId)
    if (assertionCredentialId !== credentialIdBase64) {
      return { success: false, error: 'Credential mismatch' }
    }

    // Return stored user info
    const user = getBiometricUser()
    if (!user) {
      return { success: false, error: 'User info not found' }
    }

    console.log('Biometric authentication successful')
    return {
      success: true,
      user,
      credentialId: credentialIdBase64,
    }
  } catch (error: any) {
    console.error('Biometric authentication failed:', error)

    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Biometric authentication was cancelled or denied' }
    }

    return { success: false, error: 'Biometric authentication failed' }
  }
}

/**
 * Disable biometric authentication
 */
export const disableBiometric = (): void => {
  localStorage.removeItem(BIOMETRIC_ENABLED_KEY)
  localStorage.removeItem(BIOMETRIC_CREDENTIAL_KEY)
  localStorage.removeItem(BIOMETRIC_USER_KEY)
  console.log('Biometric authentication disabled')
}

/**
 * Check if we should show biometric login option
 */
export const shouldShowBiometricLogin = async (): Promise<boolean> => {
  const isAvailable = await isBiometricAvailable()
  const isEnabled = isBiometricEnabled()
  const hasUser = getBiometricUser() !== null

  return isAvailable && isEnabled && hasUser
}
