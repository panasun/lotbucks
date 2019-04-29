class BetType
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated

  field :product,           type: String
  field :bet_type,          type: Object
end
