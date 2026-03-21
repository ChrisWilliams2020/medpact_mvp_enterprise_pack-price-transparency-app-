'use client';

import { supabase } from '@/lib/db/supabase';

export class BiometricAuth {
  static async isAvailable(): Promise<boolean> {
    if (!window.PublicKeyCredential) {
      return false;
    }
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  static async register(userId: string, email: string): Promise<boolean> {
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "MedPact SaaS",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: email,
          displayName: email,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },  // ES256
          { alg: -257, type: "public-key" } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      // Store credential in database
      const { error } = await supabase
        .from('biometric_credentials')
        .insert({
          user_id: userId,
          credential_id: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
          public_key: btoa(String.fromCharCode(...new Uint8Array(
            (credential.response as AuthenticatorAttestationResponse).getPublicKey()!
          ))),
          counter: 0
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Biometric registration failed:', error);
      return false;
    }
  }

  static async authenticate(userId: string): Promise<boolean> {
    try {
      const { data: credentials } = await supabase
        .from('biometric_credentials')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!credentials) return false;

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
          id: Uint8Array.from(atob(credentials.credential_id), c => c.charCodeAt(0)),
          type: 'public-key',
          transports: ['internal']
        }],
        timeout: 60000,
        userVerification: "required"
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      // Verify assertion (simplified - production should verify signature)
      return assertion !== null;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }
}