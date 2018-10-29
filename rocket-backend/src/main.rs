#![feature(plugin, custom_derive)]
#![plugin(rocket_codegen)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate rocket_contrib;
extern crate dotenv;
extern crate rocket;
extern crate rocket_cors;
use rocket::http::Method;
use rocket_contrib::{Json, Value};
use rocket_cors::{AllowedHeaders, AllowedOrigins};

pub mod models;
use self::models::{NewTemplate, Template};

#[derive(Deserialize, Debug)]
pub struct NewPosition {
    position: i32,
}

#[get("/")]
fn index() -> &'static str {
    "
    USAGE

      GET /templates/

          Gives you the list of all templates.

      POST /templates/

          Creates a template. Position is append at the end.
          params: name - unique name of the template
          params: content - content of the template

      POST /templates/<id>/position/
          Reorder the given template to given position.
          params: position - new position of targeted template
    "
}

#[get("/", format = "application/json")]
fn get_templates() -> Json<Vec<Template>> {
    let templates = Template::all();
    Json(templates)
}

#[post("/", format = "application/json", data = "<new_template>")]
fn create_template(new_template: Json<NewTemplate>) -> Json<Value> {
    let result = Template::insert(&new_template);
    if result {
        Json(json!({ "status": "ok" }))
    } else {
        Json(json!({
            "status": "error",
            "reason": "Something went wrong."
        }))
    }
}

#[post("/<id>/position", format = "application/json", data = "<new_position>")]
fn change_position(id: i32, new_position: Json<NewPosition>) -> Json<Value> {
    let result = Template::change_position(id, new_position.position);
    if result {
        Json(json!({ "status": "ok" }))
    } else {
        Json(json!({
            "status": "error",
            "reason": "Something went wrong."
        }))
    }
}

fn main() {
    let (allowed_origins, failed_origins) = AllowedOrigins::some(&["https://localhost:3000"]);

    // You can also deserialize this
    let options = rocket_cors::Cors {
        allowed_origins: allowed_origins,
        allowed_methods: vec![Method::Get, Method::Post]
            .into_iter()
            .map(From::from)
            .collect(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        ..Default::default()
    };

    rocket::ignite()
        .mount("/", routes![index])
        .mount(
            "/templates",
            routes![get_templates, create_template, change_position],
        )
        .attach(options)
        .launch();
}
