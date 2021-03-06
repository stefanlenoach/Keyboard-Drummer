Rails.application.routes.draw do
  root to: "static_pages#index"

  namespace :api, defaults: { format: :json } do
    resources :songs, only: [:index, :show]
    resources :beats, only: [:create, :show]
  end
end
