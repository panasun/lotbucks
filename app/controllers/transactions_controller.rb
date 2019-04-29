require 'date'

class TransactionsController < ApplicationController
  before_action :set_transaction, only: %i[show edit update destroy]
  before_action :authenticate_user!

  # GET /transactions
  # GET /transactions.json
  def index
    @transactions = Transaction.all
    @transactions_wait = Transaction.where(:username => current_user._id, :status => 'รอ')
    @transactions_history = Transaction.where(:username => current_user._id, :status.ne => 'รอ')

    @rounds = {}
    rd = Round.all
    rd.each do |r|
      @rounds[r[:_id]] = r
    end


    @bet_type_list = { 'b31' => '3ตัวบน',
                       'b32' => '3ตัวโต๊ด',
                       'b33' => '3ตัวล่าง',
                       'b34' => '3ตัวหน้า',
                       'b21' => '2ตัวบน',
                       'b22' => '2ตัวล่าง',
                       'b23' => '2ตัวโต๊ด',
                       'b11' => 'วิ่งบน',
                       'b12' => 'วิ่งล่าง' }

  end

  # GET /transactions/1
  # GET /transactions/1.json
  def show; end

  # GET /transactions/new
  def new
    @transaction = Transaction.new
  end

  # GET /transactions/1/edit
  def edit; end

  # POST /transactions
  # POST /transactions.json
  def create
    # data = JSON(transaction_params)
    # @transaction = Transaction.new(transaction_params)
    msg = []
    transactions = params[:_json]
    @round = Round.find(params[:_json][0]['round'])
    @bet_type = BetType.where(product: @round['product']).first
    stime = "%s %s:00 +0700" % [@round['result_date'], @round['result_time']]
    snow = Time.now
    sc = stime.to_time - snow.to_time

    if sc <= 0
      @round.update("status" => "close")
      respond_to do |format|
        if @round.update("status" => "close")
          format.html { redirect_to products_index_path, notice: 'Transaction was successfully updated.' }
          format.json { render :show, status: :ok, location: @transaction }
        end
      end

    end


    @payout = {}
    @bet_type['bet_type'].each do |k, v|
      @payout[k] = { 'maxrisk' => v['maxrisk'].to_f,
                     'odd' => v['odd'].to_f,
                     'minbet' => v['level'][current_user.level]['minbet'].to_f,
                     'maxbet' => v['level'][current_user.level]['maxbet'].to_f,
                     'discount' => v['level'][current_user.level]['discount'].to_f
                   }
    end

    transactions.each do |t|
      @tr = { 'username' => current_user._id,
              'round' => t['round'],
              'bet_value' => t['value'],
              'money720808' => current_user.money720808,
              'odd' => @payout[t['bet_type']]['odd'].to_f,
              'discount' => @payout[t['bet_type']]['discount'].to_f,
              'number' => t['number'],
              'bet_type' => t['bet_type'] }

      # Validate payout and bet_value again
      @tr['bet_value'] = [ @tr['bet_value'].to_f, @payout[@tr['bet_type']]['minbet'].to_f ].max
      @tr['bet_value'] = [ @tr['bet_value'].to_f, @payout[@tr['bet_type']]['maxbet'].to_f ].min


      # Limit Number and Odd
      @round['limit'].each do |r|
        if r['number'] == @tr['number'] && r['bet_type'] == @tr['bet_type'] && @payout[t['bet_type']]['odd'].to_f > r['odd'].to_f
          @tr['odd'] = r['odd'].to_f
          break
        end
      end

      ####
      # Check Maxrisk for each number and bet_type, close if its exceed maxrisk
      limitArr = @round['limit'].map do |e| e.dup end

      maxRiskPerRound = @payout[@tr['bet_type']]['maxrisk'].to_f
      totalRisk = 0
      trSameNumber = Transaction.where(round: @tr['round'], bet_type: @tr['bet_type'], number: @tr['number'])
      trSameNumber.each_with_index do |ts, index|
        totalRisk += ts['bet_value'] * ts['odd']
      end

      totalBetUser = 0
      trSameNumberUser = Transaction.where(round: @tr['round'], bet_type: @tr['bet_type'], number: @tr['number'], username: current_user._id)
      trSameNumberUser.each_with_index do |ts, index|
        totalBetUser += ts['bet_value'].to_f
      end

      @tsu = trSameNumberUser
      @tsb = totalBetUser

      logger.debug "@tsr #{@tsb}"
      #### End check maxrisk

      ### Update transaction and decrease money720808
      if (totalRisk + @tr['bet_value']*@tr['odd'] > maxRiskPerRound) || (totalBetUser + @tr['bet_value'] > @payout[@tr['bet_type']]['maxbet']) || @tr['odd'] == 0

        msg.push( {'bet_type' =>  @tr['bet_type'], 'number' => @tr['number'], 'bet_value' => @tr['bet_value'], 'discount' => @tr['discount'], 'odd' => @tr['odd'], 'status' => 'ไม่รับแทง'} )
      elsif current_user.money720808 >= @tr['bet_value'] && @tr['odd'] > 0

        current_user.money720808 -= @tr['bet_value'] * (1 - @tr['discount']/100)



        @transaction = Transaction.new(@tr)
        @transaction.save
        current_user.save

        msg.push( {'bet_type' =>  @tr['bet_type'], 'number' => @tr['number'], 'bet_value' => @tr['bet_value'], 'discount' => @tr['discount'], 'odd' => @tr['odd'], 'status' => 'รับแทง'} )
      else
        msg.push( {'bet_type' =>  @tr['bet_type'], 'number' => @tr['number'], 'bet_value' => @tr['bet_value'], 'discount' => @tr['discount'], 'odd' => @tr['odd'], 'status' => 'เงินในบัญชีไม่พอ'} )
      end
      ### end Update


      ### Limit Number if risk > 90%
      if (totalRisk + @tr['bet_value']*@tr['odd']) / maxRiskPerRound >= 0.90

        logger.debug "maxrisk >= 0.9"
        odd = 0
        haveLimit = 0
        if (totalRisk + @tr['bet_value']*@tr['odd']) / maxRiskPerRound <= 1.0
          @round['limit'].each_with_index do |r, index|
            if r['number'] == @tr['number'] && r['bet_type'] == @tr['bet_type']
              haveLimit = 1
              limitArr[index]['odd'] = odd
              @round.update("limit" => limitArr)
              break
            end
          end

          logger.debug "maxrisk <= 1.0"
        else
          haveLimit = 1
        end

        if haveLimit == 0
          limitArr.push( {'bet_type' =>  @tr['bet_type'], 'number' => @tr['number'], 'odd' => odd} )
          @round.update("limit" => limitArr)
        end

      end

      ###  end limit number


    end

    render json: {"msg": msg.to_json}, status: :ok

  end

  # PATCH/PUT /transactions/1
  # PATCH/PUT /transactions/1.json
  def update
    respond_to do |format|
      if @transaction.update(transaction_params)
        format.html { redirect_to @transaction, notice: 'Transaction was successfully updated.' }
        format.json { render :show, status: :ok, location: @transaction }
      else
        format.html { render :edit }
        format.json { render json: @transaction.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /transactions/1
  # DELETE /transactions/1.json
  def destroy
    @transaction.destroy
    respond_to do |format|
      format.html { redirect_to transactions_url, notice: 'Transaction was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_transaction
    @transaction = Transaction.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def transaction_params
    params.require(:transaction).permit(:username, :round, :bet_value,
                                        :money720808, :odd, :number, :bet_type, :status)
  end
end
