require 'date'

class AdminController < ApplicationController
  before_action :authenticate_admin

  def index
  end

  def rounds
  end

  def requests
    #Deposit
    @res = Request.where(status: "รอ", type: "ฝาก")
    @deposit = []
    i = 0

    @res.each do |r|
      u = User.find(r.username)
      @deposit[i] = {'idx'=>i + 1,
                      '_id'=>r._id,
                      'created_at'=>r.created_at,
                      'username'=>u.username,
                      'type'=>r.type,
                      'deposit_timestamp'=>r.deposit_timestamp,
                      'value'=>r.value,
                      'money720808'=>r.money720808,
                      'deposit_to_bank_id'=>r.deposit_to_bank_id,
                      'note'=>r.note,
                      'status'=>r.status
                    }
      i = i + 1
    end

    #Withdraw
    @res = Request.where(status: "รอ", type: "ถอน")
    @withdraw = []
    i = 0

    @res.each do |r|
      u = User.find(r.username)
      @withdraw[i] = {'idx'=>i + 1,
                      '_id'=>r._id,
                    'created_at'=>r.created_at,
                    'username'=>u.username,
                    'type'=>r.type,
                    'name'=>u.name,
                    'bank_name'=>u.bank_name,
                    'bank_id'=>u.bank_id,
                    'value'=>r.value,
                    'status'=>r.status
                      }
      i = i + 1
    end


    #all transactions
    @res = Request.all
    @requests = []
    i = 0

    @res.each do |r|
      u = User.find(r.username)
      @requests[i] = {'idx'=>i + 1,
                      '_id'=>r._id,
                      'created_at'=>r.created_at,
                      'username'=>u.username,
                      'type'=>r.type,
                      'deposit_timestamp'=>r.deposit_timestamp,
                      'value'=>r.value,
                      'money720808'=>r.money720808,
                      'deposit_to_bank_id'=>r.deposit_to_bank_id,
                      'name'=>u.name,
                      'bank_name'=>u.bank_name,
                      'bank_id'=>u.bank_id,
                      'status'=>r.status
                      }
      i = i + 1
    end




  end

  def transactions
  end

  def users
    @users = User.all

  end

  def notification
    wait_deposit = Request.where(status: "รอ", type: "ฝาก").count
    wait_withdraw = Request.where(status: "รอ", type: "ถอน").count

    msg = []
    msg.push( {'wait_deposit'=>wait_deposit, 'wait_withdraw'=>wait_withdraw} )
    render json: {"msg": msg.to_json}, status: :ok
  end

  def stats

  end

  def bypass
    sign_in(:user, User.find(params[:u]), { :bypass => true })
    redirect_to root_url
  end

  def resetpwd
    temp_pass = (0...6).map { ('a'..'z').to_a[rand(26)] }.join
    msg = []

    @user = User.find(params[:u])
    if @user.update(password:temp_pass,password_confirmation:temp_pass)
      msg = "รหัสผ่านชั่วคราวคือ: " + temp_pass
      render json: {"msg": msg.to_json}, status: :ok
    else
      msg = "ไม่สามารถแก้ไขรหัสผ่านได้"
      render json: {"msg": msg}, status: :unprocessable_entity
    end

  end

  private

  def authenticate_admin
    if !(user_signed_in? && current_user.username == '168899')
      redirect_to root_path
    end
  end

end
