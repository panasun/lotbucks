class Request
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated


  field :username,                type: BSON::ObjectId
  field :type,                    type: String
  field :value,                   type: Float
  field :money720808,             type: Float
  field :status,                  type: String
  field :deposit_to_bank_id,      type: String
  field :deposit_timestamp,       type: String
  field :note,                    type: String
  field :adminname,               type: String
end
