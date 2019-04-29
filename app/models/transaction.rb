class Transaction
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated

  field :username,                type: BSON::ObjectId
  field :round,                   type: BSON::ObjectId
  field :bet_value,               type: Float, default: 0
  field :money720808,             type: Float
  field :discount   ,             type: Float, default: 0
  field :odd,                     type: Float, default: 0
  field :paid,                    type: Float, default: 0
  field :number,                  type: String, default: ""
  field :bet_type,                type: String, default: ""
  field :status,                  type: String, default: "รอ"

end
