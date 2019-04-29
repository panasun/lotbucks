class RoundsController < ApplicationController
  before_action :set_round, only: %i[show edit update destroy]
  before_action :authenticate_admin

  # GET /rounds
  # GET /rounds.json
  def index
    @rounds = Round.all
    @bet_type = BetType.all
  end

  # GET /rounds/1
  # GET /rounds/1.json
  def show
    @bet_type = BetType.where(product: @round['product']).first
    @transactions = Transaction.where(round: params[:id])

    @bet_type_list = { 'b31' => '3ตัวบน',
                       'b32' => '3ตัวโต๊ด',
                       'b33' => '3ตัวล่าง',
                       'b34' => '3ตัวหน้า',
                       'b21' => '2ตัวบน',
                       'b22' => '2ตัวล่าง',
                       'b23' => '2ตัวโต๊ด',
                       'b11' => 'วิ่งบน',
                       'b12' => 'วิ่งล่าง' }

    @summary = Hash.new
    @summary['total'] = Hash.new
    @summary['total']['count'] = @transactions.count;
    @summary['total']['bet'] = @transactions.map { |h| h['bet_value'] }.sum
    @summary['total']['user'] = @transactions.map { |h| h['username'] }.uniq.count
    @summary['total']['discount'] = @transactions.map { |h| h['discount']*h['bet_value']/100 }.sum
    @summary['total']['paid'] = @transactions.map { |h| h['paid'] }.sum
    @summary['total']['pnl'] = @summary['total']['bet'] - @summary['total']['discount'] - @summary['total']['paid']

    @bet_type_list.each do |k, v|
      @summary[k] = Hash.new
      @summary[k]['count'] = @transactions.map { |h| h['bet_type'] == k ? 1 : 0 }.sum
      @summary[k]['bet'] = @transactions.map { |h| h['bet_type'] == k ? h['bet_value'] : 0 }.sum
      @summary[k]['user'] = @transactions.map { |h| h['bet_type'] == k ? h['username'] : nil }.uniq.count - 1
      @summary[k]['discount'] = @transactions.map { |h| h['bet_type'] == k ? h['discount']*h['bet_value']/100 : 0 }.sum
      @summary[k]['paid'] = @transactions.map { |h| h['bet_type'] == k ? h['paid'] : 0 }.sum
      @summary[k]['pnl'] = @summary[k]['bet'] - @summary[k]['discount'] - @summary[k]['paid']

    end
  end

  # GET /rounds/new
  def new
    @round = Round.new
    @bet_type_list = { 'b31' => '3ตัวบน',
                       'b32' => '3ตัวโต๊ด',
                       'b33' => '3ตัวล่าง',
                       'b34' => '3ตัวหน้า',
                       'b21' => '2ตัวบน',
                       'b22' => '2ตัวล่าง',
                       'b23' => '2ตัวโต๊ด',
                       'b11' => 'วิ่งบน',
                       'b12' => 'วิ่งล่าง' }
    @round['id'] = "new"
  end

  # GET /rounds/1/edit
  def edit
    @bet_type_list = { 'b31' => '3ตัวบน',
                       'b32' => '3ตัวโต๊ด',
                       'b33' => '3ตัวล่าง',
                       'b34' => '3ตัวหน้า',
                       'b21' => '2ตัวบน',
                       'b22' => '2ตัวล่าง',
                       'b23' => '2ตัวโต๊ด',
                       'b11' => 'วิ่งบน',
                       'b12' => 'วิ่งล่าง' }
    @idx = params[:id]
  end

  # POST /rounds/calculate
  def calculate
    @round = Round.find(round_params['round_id'])
    msg = []

    if @round['status'] == 'proceed'
      msg = "รอบหวยนี้ได้ประมวลผลรายการแทงแล้ว"
      render json: {"msg": msg}, status: :unprocessable_entity
      return
    end

    if @round['status'] == 'open'
      msg = "รอบหวยนี้ยังไม่ปิดรับแทง กรุณาปิดรับแทง"
      render json: {"msg": msg}, status: :unprocessable_entity
      return
    end

    # Generate Result for each bet type
    if @round['product'] == 'หวยไทย'
      @result_number = Hash.new
      @result_number['b31'] = [@round['result_number']['6digits'][3..5]]
      @result_number['b32'] = @round['result_number']['6digits'][3..5].chars.permutation.map &:join
      @result_number['b32'] = @result_number['b32'].uniq
      @result_number['b33'] = [ @round['result_number']['3digits_1'],
                                @round['result_number']['3digits_2'],
                                @round['result_number']['3digits_3'],
                                @round['result_number']['3digits_4'] ].reject { |c| c.empty? }
      @result_number['b34'] = [ @round['result_number']['3digits_5'],
                              @round['result_number']['3digits_6'], ].reject { |c| c.empty? }
      @result_number['b21'] = [ @round['result_number']['6digits'][4..5] ]
      @result_number['b22'] = [ @round['result_number']['2digits'] ]
      @result_number['b23'] = @round['result_number']['6digits'][3..5].chars.permutation(2).map &:join
      @result_number['b23'] = @result_number['b23'].uniq
      @result_number['b11'] = @round['result_number']['6digits'][3..5].chars.uniq
      @result_number['b12'] = @round['result_number']['2digits'].chars.uniq

      @round.update("result_number_bet_type" => @result_number)
      @round.update('status' => 'close')

      logger.debug "CalculateResult: #{@result_number.to_yaml}"
      msg.push( @result_number )

    elsif @round['product'] == 'หวยลาว'
      @result_number = Hash.new
      @result_number['b31'] = [@round['result_number']['3digits']]
      @result_number['b32'] = @round['result_number']['3digits'].chars.permutation.map &:join
      @result_number['b32'] = @result_number['b32'].uniq
      @result_number['b21'] = [@round['result_number']['2digits']]
      @result_number['b22'] = [@round['result_number']['4digits'][0..1]]

      @round.update("result_number_bet_type" => @result_number)
      @round.update('status' => 'close')

      logger.debug "CalculateResult: #{@result_number.to_yaml}"
      msg.push( @result_number )

    end


    render json: {"msg": msg.to_json}, status: :ok
  end

  # POST /rounds/process1688
  def process1688
    @round = Round.find(round_params['round_id'])

    if @round['status'] == 'proceed'
      msg = "รอบหวยนี้ได้ประมวลผลรายการแทงแล้ว"
      render json: {"msg": msg}, status: :unprocessable_entity
      return
    end

    if @round['status'] == 'open'
      msg = "รอบหวยนี้ยังไม่ปิดรับแทง กรุณาปิดรับแทง"
      render json: {"msg": msg}, status: :unprocessable_entity
      return
    end

    mBet = 0
    mPay = 0
    mDiscount = 0

    transactions = Transaction.where(status: "รอ", round: round_params['round_id'])
    @tc = transactions.count
    transactions.each do |t|
      @tr = t
      user = User.find(t['username'])

      isWin = 0
      @round['result_number_bet_type'][t['bet_type']].each do |r|
        if r == t['number']
          isWin = 1
          break;
        end
      end

      paid = 0
      mDiscount += (t['bet_value']*t['discount']/100)

      if isWin == 0
        #paid = (t['discount'] / 100)*t['bet_value']
        t.update("status" => "ผิด", "paid" => paid)
      else
        paid = (t['bet_value']*t['odd'])
        t.update("status" => "ถูก", "paid" => paid)
      end

      m = user.money720808 + paid
      mPay += paid
      user.update("money720808" => m)

      mBet += t['bet_value']
    end

    @round.update('status' => 'proceed')


    msg = "ยอดแทงทั้งหมด " + mBet.to_s + " บาท<br>ส่วนลดทั้งหมด " + mDiscount.to_s + " บาท<br>ยอดจ่าย " + mPay.to_s + " บาท<br>กำไร " + (mBet-mPay-mDiscount).to_s + " บาท"
    render json: {"msg": msg}, status: :ok
  end

  # POST /rounds
  # POST /rounds.json
  def create
    @round = Round.new(round_params)
    @res = Round.where(status: 'open', product: params[:_json][0][:product])

    logger.debug "@res: #{@res.count}"

    msg = ""
    if @res.count == 0 && @round.save
      msg = "เปิดรอบแทงสำเร็จ"
      render json: {"msg": msg}
    else
      msg = round_params['product'] + " ได้ถูกสร้างขึ้นมาแล้ว"
      render json: {"msg": msg}, status: :unprocessable_entity
    end

  end

  # PATCH/PUT /rounds/1
  # PATCH/PUT /rounds/1.json
  def update
    if @round['status'] == 'proceed'
      msg = "รอบหวยนี้ได้ประมวลผลรายการแทงแล้ว"
      render json: {"msg": msg}, status: :unprocessable_entity
      return
    end

    if @round.update(round_params)
      msg = "บันทึกข้อมูลสำเร็จ"
      render json: {"msg": msg}
    else
      msg = "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      render json: {"msg": msg}, status: :unprocessable_entity
    end
  end

  # DELETE /rounds/1
  # DELETE /rounds/1.json
  def destroy
    @round.destroy
    respond_to do |format|
      format.html { redirect_to rounds_url, notice: 'Round was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def authenticate_admin
    if !(user_signed_in? && current_user.username == '168899')
      redirect_to root_path
    end
  end


  # Use callbacks to share common setup or constraints between actions.
  def set_round
    @round = Round.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def round_params
    r_params = params[:_json][0]

    r_params = r_params.as_json

    r_params
  end
end
