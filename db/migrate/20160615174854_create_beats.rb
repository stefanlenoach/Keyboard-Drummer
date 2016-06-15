class CreateBeats < ActiveRecord::Migration
  def change
    create_table :beats do |t|
      t.float :time, null: false
      t.integer :song_id, null: false
      t.string :key
      t.timestamps null: false
    end
  end
end
