class Beat < ActiveRecord::Base

  validates :time, :song_id, presence: true

  belongs_to(
    :song,
    class_name: "Song",
    primary_key: :id,
    foreign_key: :song_id
  )
end
