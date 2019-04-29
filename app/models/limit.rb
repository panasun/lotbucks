class Limit
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated

  field :round,                   type: BSON::ObjectId
  field :bet_type,                type: String
  field :number,                  type: String
  field :odd,                     type: Float
end
