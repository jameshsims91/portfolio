class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.jsonb :technologies,
              default: [],
              null: false

      t.string :github_url
      t.string :live_url
      t.string :image_url
      
      t.boolean :featured,
                default: false,
                null: false
      t.integer :position,
                default: 0,
                null: false

      t.timestamps
    end

    add_index :projects, :featured
    add_index :projects, :position
  end
end
