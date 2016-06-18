json.name @song.name
json.song_id @song.id
json.youtube_id @song.youtube_id
json.beats @song.beats.sort_by { |beat| beat.time }
