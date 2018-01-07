class Api::SessionsController < ApplicationController

  before_action :confirm_logged_in, except: [:create]

  def create
    @user = User.find_by_credentials(user_params[:email], user_params[:password])
    if @user
      login(@user)
      render "api/users/current_user.json.jbuilder"
    else
      if User.find_by(email: user_params[:email])
        render json: ["Password is incorrect"], status: 400
      else
        render json: ["Email not found"], status: 400
      end
    end
  end

  def payload
    @payload = current_user.session_payload
    render :payload
  end

  def user
    @user = User.find_by(id: Integer(params[:id]))
    render 'api/users/show.json.jbuilder'
  end

  def destroy
    logout
    render json: {}
  end

  private
  def user_params
    params.require(:user).permit(:email, :password)
  end

end
