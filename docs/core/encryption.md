---
title: Encryption
slug: /encryption
description: Encrypting and decrypting data with the Strux Encrypter component.
---

# Encryption

The **Encrypter** component provides a simple, secure way to encrypt and decrypt data in your Strux application. It uses **AES-256-CBC** via OpenSSL with **HMAC integrity verification**, ensuring your data is both confidential and tamper-proof.

## How It Works

```
Original Data → serialize() → openssl_encrypt() → base64_encode() → HMAC → Final Payload
Final Payload → HMAC Verify → base64_decode() → openssl_decrypt() → unserialize() → Original Data
```

Each encrypted payload includes:
- A **random IV** (Initialization Vector) — unique per encryption
- The **ciphertext** — AES-256-CBC encrypted data
- An **HMAC-SHA256 signature** — verifies integrity and authenticity

This means the same plaintext produces a different ciphertext each time, and tampering with the payload is detected immediately.

## Configuration

### Encryption Key

Set your encryption key in `.env`:

```env
ENCRYPTION_KEY=your-32-character-secret-key-here
```

> [!CAUTION]
> - The key must be **32 bytes long** for AES-256-CBC.
> - Use a **cryptographically random** string — not a dictionary word.
> - Keep the key **secret**. Anyone with the key can decrypt your data.
> - Once set, **do not change** the key unless you re-encrypt all existing data.

To generate a secure random key:

```bash
php -r "echo bin2hex(random_bytes(16));"
```

This outputs a 32-character hex string that you can paste into your `.env` file.

Alternatively, use the `ENCRYPTION_KEY` variable directly in your configuration's `encryption` block:

```php
// src/Config/App.php
'encryption' => [
    'cipher' => 'AES-256-CBC',
    'key' => env('ENCRYPTION_KEY', 'random_key_32_bytes_long'),
    'cipher_mode' => 'CBC',
],
```

### Cipher Configuration

The default cipher is **`aes-256-cbc`**, which is suitable for most applications. You can change it in the `encryption` config array:

```php
'encryption' => [
    'cipher' => 'AES-256-CBC',   // Any OpenSSL cipher
    'key' => env('ENCRYPTION_KEY'),
],
```

> [!WARNING]
> If you change the cipher, previously encrypted data **cannot** be decrypted with the new cipher. Plan for migration or re-encryption.

## Usage

### Basic Encrypt / Decrypt

```php
use Strux\Component\Encryption\EncrypterInterface;

class UserController
{
    public function store(EncrypterInterface $encrypter)
    {
        $token = $encrypter->encrypt([
            'user_id' => 42,
            'expires' => strtotime('+1 hour'),
        ]);

        // $token is a safe string — store in DB, cookie, URL, etc.

        $decoded = $encrypter->decrypt($token);
        // ['user_id' => 42, 'expires' => 1744567890]
    }
}
```

### Via Base Controller

The `EncrypterInterface` is automatically available in every controller via `$this->encrypter`:

```php
class PaymentController extends BaseController
{
    public function checkout()
    {
        $sessionData = $this->encrypter->encrypt([
            'cart_id' => $this->session->get('cart_id'),
            'total' => 2999,
        ]);

        return $this->redirect("/pay?session={$sessionData}");
    }
}
```

### Using a Different Key

You can create an encrypter instance with a different key using `withKey()`. The original instance is **immutable** — it remains unchanged:

```php
$encrypter = $this->encrypter; // Uses the app's default key

$tempKey = 'temporary-key-for-this-operation';
$tempEncrypter = $encrypter->withKey($tempKey);

$data = $tempEncrypter->encrypt('sensitive');
$decrypted = $tempEncrypter->decrypt($data);

// $encrypter still has the original key
```

### Checking the Active Key

```php
$key = $this->encrypter->getKey(); // Returns the current key as an ASCII string
```

## What Can Be Encrypted

Any **serializable** PHP value:

| Type | Example |
|---|---|
| Strings | `'hello world'` |
| Integers / Floats | `42`, `3.14` |
| Arrays | `['user_id' => 1, 'role' => 'admin']` |
| Objects (serializable) | `$user->toArray()` |
| Booleans | `true`, `false` |
| Null | `null` |

## Exceptions

All encryption errors throw `Strux\Component\Exceptions\EncrypterException`:

| Scenario | Exception Message |
|---|---|
| Invalid cipher | `Unsupported cipher: ...` |
| Encryption failure | `Encryption failed: ...` |
| Corrupted payload | `Invalid payload encoding.` |
| Wrong format | `Invalid payload format.` |
| Tampered data | `Payload integrity check failed.` |
| Wrong key | `Payload integrity check failed.` |
| Decryption failure | `Decryption failed: ...` |
| Broken serialization | `Failed to unserialize decrypted data.` |

```php
use Strux\Component\Exceptions\EncrypterException;

try {
    $data = $this->encrypter->decrypt($userInput);
} catch (EncrypterException $e) {
    // Handle invalid or tampered data
    $this->logWarning('Decryption failed: ' . $e->getMessage());
    return $this->redirect('/error');
}
```

## Security Considerations

### Key Rotation

If you need to rotate your encryption key, you must re-encrypt all existing data. There is no automatic key rotation — the HMAC ensures data was encrypted with the current key, and a different key will not validate.

### Data Length Overhead

Encrypted payloads are longer than the original data. Plan for approximately:

| Original Size | Encrypted Size (approx) |
|---|---|
| 10 bytes | ~120 bytes |
| 100 bytes | ~220 bytes |
| 1 KB | ~1.5 KB |

This includes the IV, ciphertext, HMAC, and base64 encoding overhead.

### When Not to Use Encryption

- **Passwords** — Use `password_hash()` / `password_verify()` instead (one-way hashing).
- **Session data** — Sessions are server-side; don't encrypt the session ID.
- **Large files** — The Encrypter loads everything into memory. Use streaming encryption for large files.

### Production Checklist

- [ ] `ENCRYPTION_KEY` is set in `.env` to a random 32-byte string
- [ ] The key is **not** committed to version control
- [ ] The key is backed up securely (lost key = lost data)
- [ ] `APP_DEBUG=false` in production

## The EncrypterInterface

```php
namespace Strux\Component\Encryption;

interface EncrypterInterface
{
    public function encrypt(mixed $data): string;
    public function decrypt(string $payload): mixed;
    public function withKey(string $key): EncrypterInterface;
    public function getKey(): string;
}
```

## Related Documentation

- [Dependency Injection](./dependency-injection.mdx) — How `EncrypterInterface` is auto-wired
- [Service Registries](./registries.md) — The `EncryptionRegistry` binding
- [Configuration](../getting-started/environment.md) — Environment variables and config files
- [Response](./response.md) — Building secure responses
- [Cookies](./cookies.md) — Storing encrypted cookie values
