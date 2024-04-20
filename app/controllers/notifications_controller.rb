class NotificationsController < ApplicationController
  def subscribe
    subscription = PushSubscription.new(subs_params)
    if subscription.save
      render json: {message: 'Subscription saved.'}, status: :ok
    else
      render json: {error: 'Please try after some time.'}, status: :unprocessable_entity
    end
  end

  private
  def subs_params
    params.permit(:endpoint, :auth, :p256dh, :subscribed)
  end
end
