sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes note and clicks Save

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Response (status 201 Created)
    deactivate server

    Note right of browser: Browser updates notes list dynamically using JavaScript<br/>No full page reload happens
