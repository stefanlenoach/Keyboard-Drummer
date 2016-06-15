class Api::SongsController < ApplicationController
  def index
    @songs = Song.all
  end

  def show
    @song = Song.includes(:beats).find(params[:id])
  end
end
