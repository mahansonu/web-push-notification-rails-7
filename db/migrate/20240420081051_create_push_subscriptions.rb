class CreatePushSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :push_subscriptions do |t|
      t.string :endpoint
      t.string :auth
      t.string :p256dh
      t.boolean :subscribed

      t.timestamps
    end
  end
end
