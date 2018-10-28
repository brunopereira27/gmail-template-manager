#![feature(plugin)]
#![plugin(rocket_codegen)]

#[macro_use]
extern crate diesel;
extern crate dotenv;
extern crate rocket;
pub mod models;
use self::models::Template;

//#[get("/")]
//fn index() -> &'static str {
//    "
//    USAGE
//
//      POST /
//
//          accepts raw data in the body of the request and responds with a URL of
//          a page containing the body's content
//
//      GET /<id>
//
//          retrieves the content for the paste with id `<id>`
//    "
//}

fn main() {
    //rocket::ignite().mount("/", routes![index]).launch();
    Template::insert();
    println!("{:?}", Template::all());
}
