class Project < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true

  validates :technologies, presence: true
  
  validates :position,
            numericality: {
              only_integer: true, 
              greater_than_or_equal_to: 0
            }

  scope :featured, -> { where(featured: true) }
  scope :ordered, -> { order(:position, :id) }
end
