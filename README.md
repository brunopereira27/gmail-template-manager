
# Table of Contents

1.  [Getting started](#org2797c6e)
    1.  [Structure](#org2e7f3b7)
        1.  [chrome-extension, for the code related to the extension.](#orgc667422)
        2.  [app, which is the react webapp loaded by the chrome extension](#org2023fac)
        3.  [rocket-backend, for our small backend that handles templates data](#org32c0035)
    2.  [Running the app](#orgcd5087f)
        1.  [cd to app and \`yarn install\` to get dependencies.](#org7bd66ec)
        2.  [Set your HTTPS environment variable to true \`export HTTPS=true\`](#orgf02690d)
        3.  [yarn start to run the webapp development server](#orgaa84344)
        4.  [Go to https://localhost:3000/ and agree with the security warning](#orgd320e2a)
        5.  [Go to chrome extension page, and activate developper mode](#org6476afd)
        6.  [Load our chrome extension by setting the path to our<sub>project</sub>/chrome-extension](#orgc6f032e)
        7.  [Set backend by installing rust nightly version and Cargo. Then simply \`cargo run\` from rocket-backend dir.](#org8870bc5)
        8.  [Go to gmail with the extension activated, write an email a look for templates !](#org3ae7f0f)
2.  [Tech Stack and notes](#org035d8ea)
    1.  [Chrome extension](#orgf6d0899)
        1.  [Pain points](#org011aa47)
    2.  [React webapp](#org356aa0e)
        1.  [Implemented features :](#org9d6895f)
    3.  [Rust backend](#orge879a09)
        1.  [Implemented features :](#org37f0717)
        2.  [Feedback on Rust and Rocket framework](#org62d03bc)

This project is a google chrome extension for gmail.
It adds a button near the "Send" action which displays a list 
of templates that can fill the content of it right into the 
gmail email editor.


<a id="org2797c6e"></a>

# Getting started


<a id="org2e7f3b7"></a>

## Structure

You have three main directories (under the same git monorepo) which are :


<a id="orgc667422"></a>

### chrome-extension, for the code related to the extension.


<a id="org2023fac"></a>

### app, which is the react webapp loaded by the chrome extension


<a id="org32c0035"></a>

### rocket-backend, for our small backend that handles templates data


<a id="orgcd5087f"></a>

## Running the app


<a id="org7bd66ec"></a>

### cd to app and \`yarn install\` to get dependencies.


<a id="orgf02690d"></a>

### Set your HTTPS environment variable to true \`export HTTPS=true\`

By doing so, you allow react development http server to serve the app
using http (required)


<a id="orgaa84344"></a>

### yarn start to run the webapp development server


<a id="orgd320e2a"></a>

### Go to <https://localhost:3000/> and agree with the security warning

Mandatory, otherwise the chrome extension won't be able to load it into its iframe !
In production, with a real signed certificate and proper https setup, it wouldn't be necessary.


<a id="org6476afd"></a>

### Go to chrome extension page, and activate developper mode


<a id="orgc6f032e"></a>

### Load our chrome extension by setting the path to our<sub>project</sub>/chrome-extension


<a id="org8870bc5"></a>

### Set backend by installing rust nightly version and Cargo. Then simply \`cargo run\` from rocket-backend dir.


<a id="org3ae7f0f"></a>

### Go to gmail with the extension activated, write an email a look for templates !


<a id="org035d8ea"></a>

# Tech Stack and notes


<a id="orgf6d0899"></a>

## Chrome extension

Simply using InboxSDK which provides a nice modal widget into which we load 
our react webapp within an Iframe.


<a id="org011aa47"></a>

### Pain points

Nothing really challenging, untill you try to load an external resource into the iframe&#x2026;
Gmail CSP rules blocks every external resource loading which are not whitelisted. As we obviously
don't have access to this whitelist, I found a workarround on the net, maybe you guys have a better
solution. And even then, loading the iframe wouldn't work without https&#x2026; I learned it the hard way.

1.  The workarround

    The idea is, if you load within the iframe, an other chrome extension (which is allowed by CSP 
    security check), which also embeds an iframe, then this iframe won't be blocked. 
    So, we have in iframe.html and iframe.js kind of an other extension, which is an iframe 
    that communicates with the outer iframe in order to interact.
    Really, really painful.


<a id="org356aa0e"></a>

## React webapp

Using create-react-app. Might be overkill for such a small app, but still it's handy.
Huge fan of typescript, but didn't want to bloat the app too much as it really isn't 
necessary for something of this size.

I use emotion css, again not necessary, plain css would have been enough, but it's a technical test 
so it's also good to display some skills I guess.
Same for redux and thunk.

The design has been made in the extension context, so judging how it renders on plain browser 
isn't relevant.


<a id="org9d6895f"></a>

### Implemented features :

1.  Template list from backend

2.  Write template content to editor

3.  Create template

4.  Reorder template by dragging them

    Clearly could have done features such as edit or preview template, but not as fun as the draggable order.
    So, being free from business constraint in this context, I favour fun over feature and product.


<a id="orge879a09"></a>

## Rust backend

Never have done Rust in my life, but I find this technology interesting and I follow it. Having a strong
Python background, I'm looking for a tool that could help solving performance issues. Go, Erlang, Haskell 
are on my list of solutions to explore. 

Not that this exercice requires huge performance, but I wanted to take the opportunity to leverage the time 
spent on this project at my advantage and learn something new, this is how I'm providing this Rust backend.

Lot of things are missing, such as request validation, but the most important is there.


<a id="org37f0717"></a>

### Implemented features :

1.  'localhost:8000' gives you a small doc

2.  Getting template list

3.  Create template

4.  Reorder template


<a id="org62d03bc"></a>

### Feedback on Rust and Rocket framework

Learning curve for Rust is steep ! Coding using mostly high level languages 
during the last 3 years makes you forget about all computer science's internals.
Having a background in embedded development, it came back quickly. 
The ecosystem is still immature, few problems with autocomplete and installs here and there.
Not so many resources on the net yet, but overall it's growing at its pace, and at least, 
it's stable, it doesn't suffer from all the non-sense of a very dynamic community such as JS
(can't have best of both world).

I would recommand it only for specific usage where performance is really required, and for application 
that has scalling issues. Infact with python/Django I would have done the same work in one hour. 

