class BetTypesController < ApplicationController
  before_action :set_bet_type, only: %i[show edit update destroy]
  before_action :authenticate_admin

  # GET /bet_types
  # GET /bet_types.json
  def index
    @bet_types = BetType.all.order_by(created_at: 'desc')
  end

  # GET /bet_types/1
  # GET /bet_types/1.json
  def show; end

  # GET /bet_types/new
  def new
    @bet_type = BetType.new
    @bet_type_list = { 'b31' => '3ตัวบน',
                       'b32' => '3ตัวโต๊ด',
                       'b33' => '3ตัวล่าง',
                       'b34' => '3ตัวหน้า',
                       'b21' => '2ตัวบน',
                       'b22' => '2ตัวล่าง',
                       'b23' => '2ตัวโต๊ด',
                       'b11' => 'วิ่งบน',
                       'b12' => 'วิ่งล่าง' }
    @bet_type['id'] = "new"
  end

  # GET /bet_types/1/edit
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
  end

  # POST /bet_types
  # POST /bet_types.json
  def create
    @b = bet_type_params
    logger.debug "@b: #{@b}"
    @bet_type = BetType.new(bet_type_params)
    @res = BetType.where(product: params[:_json][0][:product])

    respond_to do |format|
      if @res.count == 0 && @bet_type.save
        format.json { render json: {"msg": "บันทึกสำเร็จ"}, status: :ok, location: @bet_type }
      else
        format.json { render json: {"msg": "บันทึกไม่สำเร็จ"}, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bet_types/1
  # PATCH/PUT /bet_types/1.json
  def update
    respond_to do |format|
      if @bet_type.update(bet_type_params)
        format.json { render json: {"msg": "บันทึกสำเร็จ"}, status: :ok, location: @bet_type }
      else
        format.json { render json: {"msg": "บันทึกไม่สำเร็จ"}, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bet_types/1
  # DELETE /bet_types/1.json
  def destroy
    @bet_type.destroy
    respond_to do |format|
      format.html { redirect_to bet_types_url, notice: 'Bet type was successfully destroyed.' }
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
  def set_bet_type
    @bet_type = BetType.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def bet_type_params
    b_params = params[:_json][0]

    b_params = b_params.as_json

    b_params
  end
end
