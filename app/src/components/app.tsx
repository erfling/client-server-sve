import * as React from "react";
import Games from "./games";
import IGame from '../../../shared/models/Game';

import './app.scss';

interface Thing {
    hey?:string
}

// State is never set so we use the '{}' type.
export default class App extends React.Component<Thing, {}> {
    render() {
        return <div>
                 <h1>wowee {this.props.hey}</h1>
                    <Games Games={[
                            {
                                Location:'butt', 
                                Teams:[
                                    {
                                        Slug: "TESTING123",
                                        Name: "Testing 123",
                                    },
                                    {
                                        Slug: "TESTING123",
                                        Name: "Testing 123",
                                    }
                                ] 
                            },
                            {
                                Location:'butt 2', 
                                Teams:[
                                    {
                                        Slug: "TESTING123",
                                        Name: "Testing 123",
                                    }
                                ] 
                            }
                        ]}/>
                </div>
    }
}