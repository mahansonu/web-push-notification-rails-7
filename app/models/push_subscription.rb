class PushSubscription < ApplicationRecord

  def send_message(message)
    WebPush.payload_send(
      message: JSON.generate(message),
      endpoint: endpoint,
      p256dh: p256dh,
      auth: auth,
      vapid: {
        subject: "mailto:sender@example.com",
        public_key: Rails.application.credentials.dig(:webpush, :public_key),
        private_key: Rails.application.credentials.dig(:webpush, :private_key)
      }
    )
  end
end
