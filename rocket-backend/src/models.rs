use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use std::env;

mod schema {
    table! {
        template (template_id) {
            template_id -> Nullable<Integer>,
            name -> Text,
            content -> Text,
            position -> Integer,
        }
    }
}

use self::schema::template as template_table;
use self::schema::template::dsl::{position, template};

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

#[derive(Queryable, Serialize, Debug)]
pub struct Template {
    pub template_id: Option<i32>,
    pub name: String,
    pub content: String,
    pub position: i32,
}

#[table_name = "template_table"]
#[derive(Insertable, Deserialize, Serialize, Debug)]
pub struct NewTemplate {
    pub name: String,
    pub content: String,
    pub position: i32,
}

impl Template {
    pub fn all() -> Vec<Template> {
        let connection = establish_connection();
        template
            .order(position.asc())
            .load::<Template>(&connection)
            .unwrap()
    }

    pub fn insert(new_template: &NewTemplate) -> bool {
        let connection = establish_connection();

        diesel::insert_into(template_table::table)
            .values(new_template)
            .execute(&connection)
            .is_ok()
    }

    pub fn change_position(id: i32, new_position: i32) -> bool {
        let connection = establish_connection();

        // Increment all positions greater than the new one.
        let target = template.filter(position.gt(new_position));
        let increment_done = diesel::update(target)
            .set(position.eq(position + 1))
            .execute(&connection)
            .is_ok();

        if !increment_done {
            return false;
        }
        // Set the given template to its new position.
        diesel::update(template.find(id))
            .set(position.eq(new_position))
            .execute(&connection)
            .is_ok()
    }
}
