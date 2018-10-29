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
        let t = template
            .find(id)
            .get_result::<Template>(&connection)
            .unwrap();
        let old_position = t.position;
        let is_asc = new_position > old_position;

        // Set the position to negative in order to avoid conflict during reordering.
        diesel::update(template.find(id))
            .set(position.eq(-1))
            .execute(&connection);

        // If the template is moving up, templates below it would lose one rank.
        // If the template is moving down, template above would gain one rank.
        if is_asc {
            let target = template
                .filter(position.le(new_position))
                .filter(position.gt(old_position));
            diesel::update(target)
                .set(position.eq(position - 1))
                .execute(&connection)
                .is_ok();
        } else {
            let target = template
                .filter(position.lt(old_position))
                .filter(position.ge(new_position));
            diesel::update(target)
                .set(position.eq(position + 1))
                .execute(&connection)
                .is_ok();
        }

        diesel::update(template.find(id))
            .set(position.eq(new_position))
            .execute(&connection)
            .is_ok()
    }
}
