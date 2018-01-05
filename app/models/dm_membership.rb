# == Schema Information
#
# Table name: dm_memberships
#
#  id         :integer          not null, primary key
#  dm_id      :integer          not null
#  user_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  subscribed :boolean          not null
#

class DmMembership < ApplicationRecord
  validates :dm_id, :user_id, presence: true
  validates :subscribed, inclusion: { in: [true, false] }

  belongs_to :user
  belongs_to :dm

  after_initialize :init

  def init
    self.subscribed ||= false
  end
end
