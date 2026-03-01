# Tour Pages Revalidation Guide

This document explains how to trigger revalidation of tour pages from the CMS (Payload) and Ecommerce (Medusa) microservices.

## ISR Configuration

Tour pages use **Incremental Static Regeneration (ISR)** with the following configuration:

```typescript
// src/app/[countryCode]/(marketing)/tours/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every 1 hour
```

### Cache Tags

Each tour page is tagged with:

- `tours` - General tours collection tag
- `tour-{slug}` - Specific tour tag (e.g., `tour-machu-picchu`)

## Revalidation API Endpoint

**Endpoint:** `POST /api/revalidate`

**Authentication:** Requires `REVALIDATE_TOKEN` environment variable

### Request Format

```json
{
  "secret": "your-revalidate-token",
  "paths": ["/pe/tours/machu-picchu"],
  "tags": ["tour-machu-picchu", "tours"]
}
```

### Response Format

**Success (200):**

```json
{
  "revalidated": true,
  "revalidatedPaths": ["/pe/tours/machu-picchu"],
  "revalidatedTags": ["tour-machu-picchu", "tours"],
  "now": 1709087234567
}
```

**Partial Success (207 Multi-Status):**

```json
{
  "message": "Algunas revalidaciones fallaron.",
  "revalidatedPaths": ["/pe/tours/machu-picchu"],
  "revalidatedTags": ["tour-machu-picchu"],
  "errors": [
    {
      "item": "/invalid/path",
      "type": "path",
      "error": "Invalid path"
    }
  ],
  "now": 1709087234567
}
```

**Error Responses:**

- `401` - Invalid or missing secret token
- `400` - Missing or invalid request body
- `500` - Server error

## Integration Examples

### 1. Payload CMS Webhook

Configure a Payload CMS webhook to trigger revalidation when a tour is updated:

**Payload CMS Configuration:**

```typescript
// payload.config.ts
export default buildConfig({
  // ... other config
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (req.collection.slug === "tours" && operation === "update") {
          const tourSlug = doc.slug;

          // Trigger revalidation
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              secret: process.env.REVALIDATE_TOKEN,
              paths: [`/pe/tours/${tourSlug}`],
              tags: [`tour-${tourSlug}`, "tours"],
            }),
          });
        }
      },
    ],
  },
});
```

**Alternative: Payload Webhook UI**

1. Go to Payload Admin → Settings → Webhooks
2. Create new webhook:
   - **URL:** `https://your-domain.com/api/revalidate`
   - **Method:** POST
   - **Events:** `tours.update`, `tours.create`
   - **Headers:** `Content-Type: application/json`
   - **Body Template:**
   ```json
   {
     "secret": "${REVALIDATE_TOKEN}",
     "paths": ["/pe/tours/${doc.slug}"],
     "tags": ["tour-${doc.slug}", "tours"]
   }
   ```

### 2. Medusa Ecommerce Webhook

Configure Medusa to revalidate tours when products are updated:

**Medusa Subscriber:**

```typescript
// src/subscribers/revalidate-tour.ts
import { EventBusService } from "@medusajs/medusa";

export default async function revalidateTourSubscriber(container) {
  const eventBusService: EventBusService = container.resolve("eventBusService");

  eventBusService.subscribe("product.updated", async (data) => {
    const product = data;

    // Check if product is a tour (has tour metadata or custom logic)
    if (product.metadata?.tourSlug) {
      const tourSlug = product.metadata.tourSlug;

      await fetch(`${process.env.STOREFRONT_URL}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.REVALIDATE_TOKEN,
          paths: [`/pe/tours/${tourSlug}`],
          tags: [`tour-${tourSlug}`, "tours", "products"],
        }),
      });
    }
  });
}
```

**Environment Variables for Medusa:**

```env
STOREFRONT_URL=https://your-storefront.com
REVALIDATE_TOKEN=your-secret-token
```

### 3. Manual Revalidation (Testing)

**Using cURL:**

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-revalidate-token",
    "paths": ["/pe/tours/machu-picchu"],
    "tags": ["tour-machu-picchu", "tours"]
  }'
```

**Using JavaScript:**

```javascript
async function revalidateTour(slug) {
  const response = await fetch("https://your-domain.com/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: process.env.REVALIDATE_TOKEN,
      paths: [`/pe/tours/${slug}`],
      tags: [`tour-${slug}`, "tours"],
    }),
  });

  return response.json();
}

// Usage
await revalidateTour("machu-picchu");
```

## Revalidation Strategies

### By Path (Recommended for Specific Tours)

Revalidates a specific tour page URL:

```json
{
  "secret": "token",
  "paths": ["/pe/tours/machu-picchu"]
}
```

**Use when:**

- A specific tour is updated
- Content changes for one tour
- Need precise cache invalidation

### By Tag (Recommended for Bulk Updates)

Revalidates all pages with a specific tag:

```json
{
  "secret": "token",
  "tags": ["tours"]
}
```

**Use when:**

- Multiple tours updated
- Global tour data changes (e.g., pricing structure)
- Category or metadata updates affecting all tours

### Combined (Most Comprehensive)

```json
{
  "secret": "token",
  "paths": ["/pe/tours/machu-picchu"],
  "tags": ["tour-machu-picchu", "tours", "products"]
}
```

**Use when:**

- Tour content AND product data change
- Maximum cache freshness required
- After major updates

## Environment Variables

### Frontend (Next.js)

```env
# .env
REVALIDATE_TOKEN=your-secret-revalidate-token-here
```

### CMS (Payload)

```env
# .env
NEXT_PUBLIC_APP_URL=https://your-storefront.com
REVALIDATE_TOKEN=your-secret-revalidate-token-here
```

### Ecommerce (Medusa)

```env
# .env
STOREFRONT_URL=https://your-storefront.com
REVALIDATE_TOKEN=your-secret-revalidate-token-here
```

## Security Considerations

1. **Secret Token:** Keep `REVALIDATE_TOKEN` secure and rotate periodically
2. **Rate Limiting:** Consider implementing rate limiting on the revalidate endpoint
3. **Validation:** The endpoint validates the token before processing
4. **HTTPS Only:** Always use HTTPS in production

## Monitoring

### Check Revalidation Status

Monitor revalidation requests in your application logs:

```typescript
// The endpoint logs all revalidation attempts
console.log(`Revalidating path: ${path}`);
console.log(`Revalidating tag: ${tag}`);
```

### Verify ISR is Working

1. Build the application: `pnpm build`
2. Check build output for static pages:
   ```
   ○ /pe/tours/machu-picchu (ISR: 3600 Seconds)
   ```
3. Run production server: `pnpm start`
4. Access a tour page and check response headers for cache status

## Troubleshooting

### Issue: Pages Not Revalidating

**Solutions:**

1. Verify `REVALIDATE_TOKEN` matches in all services
2. Check webhook URLs are correct and accessible
3. Review server logs for revalidation errors
4. Ensure ISR is configured correctly in page component

### Issue: 401 Unauthorized

**Solutions:**

1. Verify secret token is correct
2. Check environment variables are loaded
3. Ensure token doesn't have extra whitespace

### Issue: 400 Bad Request

**Solutions:**

1. Verify request body has `paths` or `tags` array
2. Check JSON formatting is valid
3. Ensure paths start with `/`

## Best Practices

1. **Granular Tagging:** Use specific tags for precise cache control
2. **Batch Updates:** Revalidate multiple related pages in one request
3. **Error Handling:** Always handle revalidation failures gracefully
4. **Monitoring:** Log all revalidation attempts for debugging
5. **Testing:** Test revalidation in staging before production deployment

## Additional Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [Next.js revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Payload CMS Hooks](https://payloadcms.com/docs/hooks/overview)
- [Medusa Subscribers](https://docs.medusajs.com/development/events/subscribers)
