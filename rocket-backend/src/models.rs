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
use self::schema::template::dsl::{template, template_id};

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

#[derive(Queryable, Debug)]
pub struct Template {
    pub template_id: Option<i32>,
    pub name: String,
    pub content: String,
    pub position: i32,
}

#[table_name = "template_table"]
#[derive(Insertable, Debug)]
pub struct NewTemplate {
    pub name: String,
    pub content: String,
    pub position: i32,
}

impl Template {
    pub fn all() -> Vec<Template> {
        let connection = establish_connection();
        template
            .order(template_id.desc())
            .load::<Template>(&connection)
            .unwrap()
    }

    pub fn insert() {
        let connection = establish_connection();
        let new_templates = vec![
            NewTemplate {
                name: "Introduction".to_string(),
                content: "Hello I'm...".to_string(),
                position: 0,
            },
            NewTemplate {
                name: "Thanks".to_string(),
                content: "Thank you for reaching out...".to_string(),
                position: 1,
            },
        ];

        diesel::insert_into(template_table::table)
            .values(&new_templates)
            .execute(&connection)
            .unwrap();
    }
}
