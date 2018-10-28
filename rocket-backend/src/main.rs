#![feature(plugin)]
#![plugin(rocket_codegen)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate serde_derive;
extern crate dotenv;
extern crate rocket;
use rocket_contrib::{Json, Value};

pub mod models;
use self::models::Template;

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

fn main() {
    rocket::ignite()
        .mount("/", routes![index])
        .mount("/templates", routes![get_templates])
        .launch();
}
