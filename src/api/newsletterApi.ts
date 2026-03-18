export interface NewsletterSubscribeRequest {
  email: string;
}

export interface NewsletterSubscribeResponse {
  success: boolean;
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function subscribeToNewsletter(
  payload: NewsletterSubscribeRequest,
): Promise<NewsletterSubscribeResponse> {
  await wait(700);

  if (payload.email.includes('fail')) {
    throw new Error('Subscription failed. Please try again.');
  }

  return { success: true };
}
