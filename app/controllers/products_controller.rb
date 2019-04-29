class ProductsController < ApplicationController
  before_action :authenticate_user!, only: [:thai, :laos]


  def index
    @round_laos = Round.where(product: 'หวยลาว').order_by(created_at: 'desc').first
    @round_thai = Round.where(product: 'หวยไทย').order_by(created_at: 'desc').first
    @bet_types = BetType.all
  end

  def thai
    @round = Round.where(status: 'open', product: 'หวยไทย').first
    if @round.nil?
      redirect_to products_index_path
    end

    @bet_type = BetType.where(product: 'หวยไทย').first
    @bet_code = ["b31", "b32", "b33", "b34", "b21", "b22", "b11", "b12"]  
    @payout = {}
    @bet_type['bet_type'].each do |k, v|
      @payout[k] = { 'odd' => v['odd'],
                     'minbet' => v['level'][current_user.level]['minbet'],
                     'maxbet' => v['level'][current_user.level]['maxbet'],
                     'discount' => v['level'][current_user.level]['discount']
                   }
    end
  end

  def laos
    @round = Round.where(status: 'open', product: 'หวยลาว').first
    if @round.nil?
      redirect_to products_index_path
    end

    @bet_type = BetType.where(product: 'หวยลาว').first
    @bet_code = ["b31", "b32", "b21", "b22"]
    @payout = {}
    @bet_type['bet_type'].each do |k, v|
      @payout[k] = { 'odd' => v['odd'],
                     'minbet' => v['level'][current_user.level]['minbet'],
                     'maxbet' => v['level'][current_user.level]['maxbet'],
                     'discount' => v['level'][current_user.level]['discount']
                   }
    end
  end
end
