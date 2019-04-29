class RequestsController < ApplicationController
  before_action :set_request, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

  # GET /requests
  # GET /requests.json
  def index
    @requests = Request.where(username: current_user._id)

  end

  # GET /requests/1
  # GET /requests/1.json
  def show

  end

  # GET /requests/new
  def new
    @request = Request.new
  end

  # GET /requests/1/edit
  def edit

  end


  # GET /requests/1/confirm
  def confirm

    @request = Request.find(params[:request_id])

    if @request.status == "รอ" && (user_signed_in? && current_user.username == '168899')
      u = User.find(@request.username)
      if@request.type == "ฝาก"
        u.money720808 = u.money720808 + @request.value
      end
      @request.status = "สำเร็จ"

      respond_to do |format|
        if @request.save && u.save
          format.html { redirect_to admin_requests_path, notice: 'Request was successfully created.' }
        else
          format.html { render :new }
        end
      end
    else
      redirect_to root_path
    end
  end

  # GET /requests/1/cancel
  def cancel
    :authenticate_admin
    @request = Request.find(params[:request_id])

    if @request.status == "รอ" && (user_signed_in? && current_user.username == '168899')
      @request.status = "ยกเลิก"
      respond_to do |format|
        if @request.save
          format.html { redirect_to admin_requests_path, notice: 'Request was successfully created.' }
        else
          format.json { render json: @request.errors, status: :unprocessable_entity }
        end
      end
    else
      redirect_to root_path
    end

  end

  # POST /requests
  # POST /requests.json
  def create
    @request = Request.new(params[:_json][0].as_json)
    @request.username = current_user._id
    @request.money720808 = current_user.money720808
    @request.status = "รอ"

    if @request.type == "ถอน"
      current_user.money720808 = current_user.money720808 - @request.value
    end

    respond_to do |format|
      if current_user.save && @request.save
        format.html { redirect_to @request, notice: 'Request was successfully created.' }
        format.json { render :show, status: :created, location: @request }
      else
        format.html { render :new }
        format.json { render json: @request.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /requests/1
  # PATCH/PUT /requests/1.json
  def update
    respond_to do |format|
      if @request.update(request_params)
        format.html { redirect_to admin_requests_path, notice: 'Request was successfully updated.' }
        format.json { render :show, status: :ok, location: admin_requests_path }
      else
        format.html { render :edit }
        format.json { render json: @request.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /requests/1
  # DELETE /requests/1.json
  def destroy
    @request.destroy
    respond_to do |format|
      format.html { redirect_to requests_url, notice: 'Request was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def authenticate_admin
      if !(user_signed_in? && current_user.username == '168899')
        redirect_to root_path
      else
      end
    end
    # Use callbacks to share common setup or constraints between actions.
    def set_request
      @request = Request.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def request_params
      params.require(:request).permit(:type, :value, :deposit_to_bank_id, :deposit_timestamp, :note)
    end
end
