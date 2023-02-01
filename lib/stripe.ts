import {
  createCheckoutSession,
  getStripePayments,
} from "@stripe/firestore-stripe-payments";
import { getFunctions, httpsCallable } from "@firebase/functions";
import app from "../firebase";

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});

const loadCheckout = async (priceId: string) => {
  await createCheckoutSession(payments, {
    price: priceId,
    success_url: window.location.origin, //The origin read-only property of the Location interface is a string containing the Unicode serialization of the origin of the represented URL ie Returns:'http://localhost:3000/' in development mode.
    cancel_url: window.location.origin,
  })
    .then((snapshot) => window.location.assign(snapshot.url))
    .catch((error) => console.log(error.message));
};

const goToBillingPortal = async () => {
  const instance = getFunctions(app, "us-central1");
  const functionRef = httpsCallable(
    instance,
    "ext-firestore-stripe-payments-createPortalLink"
  );

  await functionRef({
    returnUrl: `${window.location.origin}/account`,
    locale: "auto",
  })
    .then(({ data }: any) => window.location.assign(data.url))
    .catch((error) => console.log(error.message));
};
export { loadCheckout, goToBillingPortal };
export default payments;
