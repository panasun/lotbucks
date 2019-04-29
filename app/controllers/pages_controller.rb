class PagesController < ApplicationController
  def index
  end
  def result
    @round_laos = Round.where(status: "proceed", product: 'หวยลาว').order_by(result_date: 'desc').limit(5)
    @round_thai = Round.where(status: "proceed", product: 'หวยไทย').order_by(result_date: 'desc').limit(5)
  end

  def odd_table
  end

  def faq
  end
end
