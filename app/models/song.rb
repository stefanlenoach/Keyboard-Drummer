class Song < ActiveRecord::Base

  validates :name, :youtube_id, presence: true

  has_many(
    :beats,
    class_name: "Beat",
    primary_key: :id,
    foreign_key: :song_id
  )
end
