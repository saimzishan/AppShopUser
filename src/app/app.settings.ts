import { Injectable } from '@angular/core';

export class Settings {
    constructor(public name: string,
                public theme: string) { }
}

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'APPSHOP',  // theme name
        'blue'     // green, blue, red, pink, purple, grey
    );
}
