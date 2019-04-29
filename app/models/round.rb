class Round
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated

  field :result_date,             type: String
  field :result_time,             type: String
  field :status,                  type: String, default: "open"
  field :product,                 type: String
  field :payout,                  type: Object
  field :limit,                   type: Object
  field :result_number,           type: Object
  field :result_number_bet_type,  type: Object

end
