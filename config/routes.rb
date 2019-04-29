Rails.application.routes.draw do


  get 'pages/result'

  get 'products/laos'
  get 'products/thai'


  resources :bet_types
  get 'admin/index'
  get 'admin/rounds'
  get 'admin/requests'
  get 'admin/transactions'
  get 'admin/users'
  get 'admin/stats'
  get 'admin/notification'
  get 'admin/bypass'
  get 'admin/resetpwd'

  resources :transactions
  resources :rounds

  post 'rounds/calculate'
  post 'rounds/process1688'

  resources :requests do
    get 'confirm(.:format)' => 'requests#confirm'
    get 'cancel(.:format)' => 'requests#cancel'
  end
  get 'pages/index'
  get 'pages/faq'
  get 'pages/odd_table'
  root 'products#index'
  get 'products/thai'
  get 'products/laos'
  get 'products/index'

  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '*path' => redirect('/')
end
