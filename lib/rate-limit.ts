/**
 * RATE-LIMIT.TS - Système de rate limiting avec Upstash Redis
 *
 * Ce système protège les actions publiques critiques contre les abus
 * en limitant le nombre de requêtes par utilisateur/IP.
 *
 * CONFIGURATION REQUISE:
 * - UPSTASH_REDIS_REST_URL: URL de votre base Redis Upstash
 * - UPSTASH_REDIS_REST_TOKEN: Token d'authentification Upstash
 *
 * Si ces variables ne sont pas définies, le rate limiting sera désactivé
 * et un avertissement sera affiché dans les logs.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Get client identifier (IP address) for rate limiting
 */
async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "anonymous";
}

// Configuration de Redis - seulement si les variables d'environnement sont définies
let redis: Redis | null = null;
let isRateLimitEnabled = false;

try {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    isRateLimitEnabled = true;
  } else {
    console.warn(
      "AVERTISSEMENT: Rate limiting désactivé - Variables UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN non configurées"
    );
  }
} catch (error) {
  console.error("Erreur lors de l'initialisation de Redis:", error);
  isRateLimitEnabled = false;
}

/**
 * Rate limiter pour les formulaires de contact
 * Limite: 3 soumissions par 10 minutes par IP
 */
export const contactFormRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      analytics: true,
      prefix: "@ratelimit/contact-form",
    })
  : null;

/**
 * Rate limiter pour les inscriptions aux événements
 * Limite: 5 inscriptions par heure par IP
 */
export const eventRegistrationRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "@ratelimit/event-registration",
    })
  : null;

/**
 * Rate limiter pour les inscriptions à la newsletter
 * Limite: 2 inscriptions par jour par IP
 */
export const newsletterSubscriptionRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, "1 d"),
      analytics: true,
      prefix: "@ratelimit/newsletter-subscription",
    })
  : null;

/**
 * Rate limiter pour les candidatures aux offres d'emploi
 * Limite: 10 candidatures par jour par IP
 */
export const jobApplicationRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 d"),
      analytics: true,
      prefix: "@ratelimit/job-application",
    })
  : null;

/**
 * Classe d'erreur pour les dépassements de rate limit
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Vérifie le rate limit pour une action donnée
 *
 * @param rateLimit - L'instance de rate limiter à utiliser
 * @param identifier - Un identifiant unique (par défaut: IP du client)
 * @throws {RateLimitError} Si la limite est dépassée
 */
export async function checkRateLimit(
  rateLimit: Ratelimit | null,
  identifier?: string
): Promise<void> {
  // Si le rate limiting n'est pas activé, on laisse passer
  if (!isRateLimitEnabled || !rateLimit) {
    return;
  }

  // Obtenir l'identifiant du client (IP ou identifiant personnalisé)
  const clientId = identifier || (await getClientIdentifier());

  try {
    const { success, limit, reset, remaining } =
      await rateLimit.limit(clientId);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      throw new RateLimitError(
        `Trop de tentatives. Veuillez réessayer dans ${retryAfter} secondes.`,
        retryAfter
      );
    }

    // Log pour le monitoring (uniquement en développement)
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Rate limit OK - Remaining: ${remaining}/${limit}, Reset in: ${Math.ceil((reset - Date.now()) / 1000)}s`
      );
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    // En cas d'erreur Redis, on laisse passer plutôt que de bloquer le service
    console.error("Erreur rate limiting:", error);
  }
}

/**
 * Helper pour vérifier le rate limit du formulaire de contact
 */
export async function checkContactFormRateLimit(): Promise<void> {
  return checkRateLimit(contactFormRateLimit);
}

/**
 * Helper pour vérifier le rate limit des inscriptions aux événements
 */
export async function checkEventRegistrationRateLimit(): Promise<void> {
  return checkRateLimit(eventRegistrationRateLimit);
}

/**
 * Helper pour vérifier le rate limit des inscriptions à la newsletter
 */
export async function checkNewsletterSubscriptionRateLimit(): Promise<void> {
  return checkRateLimit(newsletterSubscriptionRateLimit);
}

/**
 * Helper pour vérifier le rate limit des candidatures aux offres d'emploi
 */
export async function checkJobApplicationRateLimit(): Promise<void> {
  return checkRateLimit(jobApplicationRateLimit);
}

/**
 * Vérifie si le rate limiting est activé
 */
export function isRateLimitingEnabled(): boolean {
  return isRateLimitEnabled;
}
