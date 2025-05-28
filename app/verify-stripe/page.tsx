import { stripe } from "@/lib/stripe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

async function getStripeAccountInfo() {
  try {
    const account = await stripe.account.retrieve()
    return {
      success: true,
      account,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export default async function VerifyStripePage() {
  const result = await getStripeAccountInfo()

  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Stripe Integration Verification</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            {result.success ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                Stripe Integration Active
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                Stripe Integration Error
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.success ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Account Name</p>
                <p className="font-medium">{result.account.business_profile?.name || "Not set"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      result.account.charges_enabled ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {result.account.charges_enabled ? "Active" : "Pending Activation"}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Environment</p>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      !result.account.test_mode ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {!result.account.test_mode ? "Live Mode" : "Test Mode"}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">API Version</p>
                <p className="font-medium">{stripe.getApiField("version")}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-green-600 font-medium">
                  ✓ Your Stripe integration is properly configured with live keys
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600">Error connecting to Stripe: {result.error}</p>

              <div className="pt-4 border-t">
                <p className="font-medium">Troubleshooting Steps:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Verify your STRIPE_SECRET_KEY environment variable is set correctly</li>
                  <li>Ensure your Stripe account is active and in good standing</li>
                  <li>Check that you're using a valid API key with the correct permissions</li>
                  <li>Confirm you're using the correct API key type (live vs test)</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        <p>This page is only visible to administrators and is used for verification purposes.</p>
      </div>
    </div>
  )
}
